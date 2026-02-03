import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import 'dashboard_screen.dart';
import 'transactions_screen.dart';
import 'accounts_screen.dart';
import 'income_screen.dart';
import 'goals_screen.dart';
import 'reports_screen.dart';
import 'settings_screen.dart';
import '../models/transaction.dart';
import 'transaction_modal.dart';
import '../widgets/quick_add_dialog.dart';
import 'search_overlay.dart';

/// Main shell: app bar (theme, currency, FAB) + navigation rail + content.
class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _selectedIndex = 0;
  bool _backupReminderShown = false;
  bool _searchOpen = false;

  static const _sections = [
    ('Dashboard', Icons.dashboard_rounded),
    ('Transactions', Icons.receipt_long_rounded),
    ('Accounts', Icons.account_balance_rounded),
    ('Income', Icons.attach_money_rounded),
    ('Goals', Icons.flag_rounded),
    ('Reports', Icons.analytics_rounded),
    ('Settings', Icons.settings_rounded),
  ];

  Widget _body() {
    switch (_selectedIndex) {
      case 0:
        return const DashboardScreen();
      case 1:
        return const TransactionsScreen();
      case 2:
        return const AccountsScreen();
      case 3:
        return const IncomeScreen();
      case 4:
        return const GoalsScreen();
      case 5:
        return const ReportsScreen();
      case 6:
        return const SettingsScreen();
      default:
        return const DashboardScreen();
    }
  }

  Future<void> _openQuickAdd(BuildContext context, AppState state) async {
    final t = await showDialog<Transaction>(
      context: context,
      builder: (ctx) => QuickAddDialog(
        accounts: state.accounts,
        expenseCategories: AppState.expenseCategories,
        incomeCategories: AppState.incomeCategories,
        currency: state.currency,
      ),
    );
    if (t != null && context.mounted) await _addTransactionWithHint(context, state, t);
  }

  Future<void> _openAddTransaction(BuildContext context, AppState state) async {
    final t = await showDialog<Transaction>(
      context: context,
      builder: (ctx) => TransactionModal(
        accounts: state.accounts,
        categories: AppState.expenseCategories,
        incomeCategories: AppState.incomeCategories,
        currency: state.currency,
      ),
    );
    if (t != null && context.mounted) await _addTransactionWithHint(context, state, t);
  }

  Future<void> _addTransactionWithHint(BuildContext context, AppState state, Transaction t) async {
    final hint = state.getDuplicateHint(t);
    if (hint != null && context.mounted) {
      final add = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Duplicate?'),
          content: Text(hint),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Add anyway')),
          ],
        ),
      );
      if (add != true || !context.mounted) return;
    }
    if (!context.mounted) return;
    await state.addTransaction(t);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Transaction added'),
          behavior: SnackBarBehavior.floating,
          action: SnackBarAction(
            label: 'View',
            onPressed: () => setState(() => _selectedIndex = 1),
          ),
        ),
      );
    }
  }

  void _maybeShowBackupReminder(AppState state) {
    if (_backupReminderShown || !state.shouldShowBackupReminder) return;
    _backupReminderShown = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Backup reminder'),
          content: const Text('It\'s been a while since your last backup. Back up your data to avoid losing it.'),
          actions: [
            TextButton(
              onPressed: () {
                state.dismissBackupReminder();
                Navigator.pop(ctx);
              },
              child: const Text('Remind later'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.pop(ctx);
                setState(() => _selectedIndex = 6);
              },
              child: const Text('Open Settings'),
            ),
          ],
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        return Scaffold(
          appBar: AppBar(
            title: Row(
              children: [
                Icon(Icons.account_balance_wallet_rounded, color: Theme.of(context).colorScheme.onPrimary),
                const SizedBox(width: 12),
                const Text('FamBudget'),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search_rounded),
                onPressed: () => setState(() => _searchOpen = true),
              ),
              PopupMenuButton<String>(
                icon: Text(
                  state.currency,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimary.withValues(alpha: 0.95),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                onSelected: (v) => state.setCurrency(v),
                itemBuilder: (context) => ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'INR'].map((c) => PopupMenuItem(value: c, child: Text(c))).toList(),
              ),
              IconButton(
                icon: Icon(state.isDarkTheme ? Icons.light_mode_rounded : Icons.dark_mode_rounded),
                onPressed: () => state.toggleTheme(),
              ),
              const SizedBox(width: 8),
            ],
          ),
          body: Stack(
            children: [
              Row(
                children: [
                  NavigationRail(
                extended: MediaQuery.sizeOf(context).width > 800,
                selectedIndex: _selectedIndex,
                onDestinationSelected: (i) => setState(() => _selectedIndex = i),
                backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                selectedIconTheme: IconThemeData(color: Theme.of(context).colorScheme.primary),
                unselectedIconTheme: IconThemeData(color: Theme.of(context).colorScheme.onSurfaceVariant),
                destinations: _sections
                    .map((e) => NavigationRailDestination(
                          icon: Icon(e.$2),
                          label: Text(e.$1),
                        ))
                    .toList(),
              ),
                  const VerticalDivider(width: 1),
                  Expanded(
                    child: Builder(
                      builder: (context) {
                        _maybeShowBackupReminder(state);
                        return _body();
                      },
                    ),
                  ),
                ],
              ),
              if (_searchOpen)
                SearchOverlay(
                  state: state,
                  onClose: () => setState(() => _searchOpen = false),
                  onSelectTransaction: () => setState(() { _searchOpen = false; _selectedIndex = 1; }),
                  onSelectAccount: () => setState(() { _searchOpen = false; _selectedIndex = 2; }),
                  onSelectGoal: () => setState(() { _searchOpen = false; _selectedIndex = 4; }),
                ),
            ],
          ),
          floatingActionButton: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              FloatingActionButton.small(
                heroTag: 'full',
                tooltip: 'Add transaction (full form)',
                onPressed: () => _openAddTransaction(context, state),
                child: const Icon(Icons.receipt_long_rounded),
              ),
              const SizedBox(height: 8),
              FloatingActionButton.extended(
                heroTag: 'quick',
                onPressed: () => _openQuickAdd(context, state),
                icon: const Icon(Icons.add_rounded),
                label: const Text('Quick add'),
              ),
            ],
          ),
        );
      },
    );
  }
}
