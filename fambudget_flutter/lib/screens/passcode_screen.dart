import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../services/passcode_service.dart';
import '../services/app_state.dart';
import 'home_shell.dart';
import 'quick_tour_screen.dart';

/// Passcode lock: setup (first time) or unlock. Uses numeric keypad and dots.
class PasscodeScreen extends StatefulWidget {
  /// Called when passcode is verified or set; if null, this screen navigates to HomeShell.
  final VoidCallback? onSuccess;

  const PasscodeScreen({super.key, this.onSuccess});

  @override
  State<PasscodeScreen> createState() => _PasscodeScreenState();
}

class _PasscodeScreenState extends State<PasscodeScreen> {
  final PasscodeService _passcode = PasscodeService();
  final List<String> _digits = [];
  bool _isSetup = false;
  String? _firstPin; // for setup confirm step
  bool _isChecking = false;
  String? _errorMessage;

  static const int _maxDigits = PasscodeService.passcodeLength;

  @override
  void initState() {
    super.initState();
    _checkMode();
  }

  Future<void> _checkMode() async {
    final hasPasscode = await _passcode.hasPasscode();
    if (!mounted) return;
    setState(() {
      _isSetup = !hasPasscode;
      _errorMessage = null;
    });
  }

  void _onDigit(String digit) {
    if (_digits.length >= _maxDigits) return;
    setState(() {
      _digits.add(digit);
      _errorMessage = null;
    });
    if (_digits.length == _maxDigits) _submit();
  }

  void _onBackspace() {
    if (_digits.isEmpty) return;
    setState(() {
      _digits.removeLast();
      _errorMessage = null;
    });
  }

  Future<void> _submit() async {
    final pin = _digits.join();
    setState(() {
      _isChecking = true;
      _errorMessage = null;
    });

    if (_isSetup) {
      if (_firstPin == null) {
        setState(() {
          _firstPin = pin;
          _digits.clear();
          _isChecking = false;
        });
        return;
      }
      if (_firstPin != pin) {
        setState(() {
          _firstPin = null;
          _digits.clear();
          _isChecking = false;
          _errorMessage = 'Passcodes do not match. Try again.';
        });
        return;
      }
      await _passcode.setPasscode(pin);
    } else {
      final ok = await _passcode.verifyPasscode(pin);
      if (!mounted) return;
      if (!ok) {
        setState(() {
          _digits.clear();
          _isChecking = false;
          _errorMessage = 'Wrong passcode';
        });
        HapticFeedback.heavyImpact();
        return;
      }
    }

    if (!mounted) return;
    setState(() => _isChecking = false);
    if (widget.onSuccess != null) {
      widget.onSuccess!();
    } else {
      final state = context.read<AppState>();
      final route = PageRouteBuilder<void>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            state.tourCompleted ? const HomeShell() : const QuickTourScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 400),
      );
      Navigator.of(context).pushReplacement(route);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    String title;
    String subtitle;
    if (_isSetup) {
      title = _firstPin == null ? 'Create passcode' : 'Confirm passcode';
      subtitle = _firstPin == null
          ? 'Enter a 4-digit code to lock the app'
          : 'Enter the same code again';
    } else {
      title = 'Enter passcode';
      subtitle = 'Unlock FamBudget';
    }

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDark
                ? [
                    const Color(0xFF0D47A1),
                    const Color(0xFF1565C0),
                    AppTheme.primaryDark,
                  ]
                : [
                    const Color(0xFFE3F2FD),
                    const Color(0xFFBBDEFB),
                    AppTheme.primaryLight.withValues(alpha: 0.3),
                  ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 48),
              Icon(
                Icons.lock_outline_rounded,
                size: 64,
                color: isDark
                    ? AppTheme.onPrimaryContainerDark
                    : AppTheme.primaryLight,
              ),
              const SizedBox(height: 24),
              Text(
                title,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isDark
                          ? AppTheme.onPrimaryContainerDark
                          : AppTheme.onPrimaryContainerLight,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: isDark
                          ? AppTheme.onSurfaceVariantDark
                          : AppTheme.onSurfaceVariantLight,
                    ),
              ),
              const SizedBox(height: 32),
              _buildDots(isDark),
              if (_errorMessage != null) ...[
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Text(
                    _errorMessage!,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: AppTheme.errorLight,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
              const Spacer(),
              if (_isChecking)
                const Padding(
                  padding: EdgeInsets.only(bottom: 24),
                  child: SizedBox(
                    width: 28,
                    height: 28,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                )
              else
                _buildKeypad(isDark),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDots(bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(_maxDigits, (i) {
        final filled = i < _digits.length;
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 8),
          width: 14,
          height: 14,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: filled
                ? (isDark
                    ? AppTheme.onPrimaryContainerDark
                    : AppTheme.primaryLight)
                : Colors.transparent,
            border: Border.all(
              color: isDark
                  ? AppTheme.onPrimaryContainerDark.withValues(alpha: 0.5)
                  : AppTheme.primaryLight.withValues(alpha: 0.5),
              width: 2,
            ),
          ),
        );
      }),
    );
  }

  Widget _buildKeypad(bool isDark) {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫'],
    ];
    final color = isDark
        ? AppTheme.onPrimaryContainerDark
        : AppTheme.onPrimaryContainerLight;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 48),
      child: Column(
        children: keys.map((row) {
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: row.map((key) {
              if (key.isEmpty) {
                return const SizedBox(width: 72, height: 72);
              }
              if (key == '⌫') {
                return _keypadButton(
                  icon: Icons.backspace_outlined,
                  color: color,
                  onTap: _onBackspace,
                );
              }
              return _keypadButton(
                label: key,
                color: color,
                onTap: () => _onDigit(key),
              );
            }).toList(),
          );
        }).toList(),
      ),
    );
  }

  Widget _keypadButton({
    String? label,
    IconData? icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: SizedBox(
            width: 72,
            height: 72,
            child: Center(
              child: label != null
                  ? Text(
                      label,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w300,
                        color: color,
                      ),
                    )
                  : Icon(icon, size: 28, color: color),
            ),
          ),
        ),
      ),
    );
  }
}
