import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../services/app_state.dart';
import 'home_shell.dart';

/// Quick tour shown after opening animation (and passcode). Slide-through intro.
class QuickTourScreen extends StatefulWidget {
  /// If true, "Get started" will pop back (e.g. when reopened from Settings).
  final bool fromSettings;

  const QuickTourScreen({super.key, this.fromSettings = false});

  @override
  State<QuickTourScreen> createState() => _QuickTourScreenState();
}

class _QuickTourScreenState extends State<QuickTourScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  static const _slides = [
    _SlideData(
      icon: Icons.dashboard_rounded,
      title: 'Welcome to FamBudget',
      body: 'Track spending, manage accounts, and reach your savings goals—all in one place.',
    ),
    _SlideData(
      icon: Icons.receipt_long_rounded,
      title: 'Transactions & categories',
      body: 'Add income and expenses, filter by account or category, and import from CSV.',
    ),
    _SlideData(
      icon: Icons.account_balance_wallet_rounded,
      title: 'Accounts & goals',
      body: 'Keep multiple accounts and set savings goals. Watch your progress on the dashboard.',
    ),
    _SlideData(
      icon: Icons.analytics_rounded,
      title: 'Reports & backup',
      body: 'View spending by category, export data to CSV or JSON, and restore from backup anytime.',
    ),
  ];

  void _onPageChanged(int i) {
    setState(() => _currentPage = i);
  }

  void _next() {
    if (_currentPage < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 450),
        curve: Curves.easeOutCubic,
      );
    } else {
      _finish();
    }
  }

  Future<void> _finish() async {
    if (!widget.fromSettings) {
      final state = context.read<AppState>();
      await state.setTourCompleted(true);
    }
    if (!mounted) return;
    if (widget.fromSettings) {
      Navigator.of(context).pop();
    } else {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder<void>(
          pageBuilder: (context, animation, secondaryAnimation) => const HomeShell(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
          transitionDuration: const Duration(milliseconds: 400),
        ),
      );
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppTheme.primaryDark : AppTheme.primaryLight;
    final onSurface = isDark ? AppTheme.onSurfaceDark : AppTheme.onSurfaceLight;
    final onSurfaceVariant = isDark ? AppTheme.onSurfaceVariantDark : AppTheme.onSurfaceVariantLight;

    final gradientColors = isDark
        ? [const Color(0xFF0D47A1), const Color(0xFF1565C0), primary]
        : [const Color(0xFFE3F2FD), const Color(0xFFBBDEFB), primary.withValues(alpha: 0.3)];

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradientColors,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: _finish,
                  child: Text('Skip', style: TextStyle(color: onSurfaceVariant)),
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: _onPageChanged,
                  itemCount: _slides.length,
                  itemBuilder: (context, i) {
                    final s = _slides[i];
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(28),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? Colors.white.withValues(alpha: 0.12)
                                  : Colors.white.withValues(alpha: 0.9),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: primary.withValues(alpha: 0.25),
                                  blurRadius: 20,
                                  spreadRadius: 1,
                                ),
                              ],
                            ),
                            child: Icon(s.icon, size: 64, color: primary),
                          ),
                          const SizedBox(height: 40),
                          Text(
                            s.title,
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: onSurface,
                                ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            s.body,
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  color: onSurfaceVariant,
                                  height: 1.4,
                                ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _slides.length,
                  (i) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOutCubic,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == i ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == i
                          ? primary
                          : primary.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: FilledButton(
                  onPressed: _next,
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(double.infinity, 48),
                    backgroundColor: primary,
                    foregroundColor: Colors.white,
                  ),
                  child: Text(
                    _currentPage == _slides.length - 1 ? 'Get started' : 'Next',
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

class _SlideData {
  const _SlideData({
    required this.icon,
    required this.title,
    required this.body,
  });
  final IconData icon;
  final String title;
  final String body;
}
