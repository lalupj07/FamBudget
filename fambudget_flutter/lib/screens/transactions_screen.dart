import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction.dart';
import '../models/recurring_template.dart';
import '../services/app_state.dart';
import '../utils/currency_format.dart';
import 'transaction_modal.dart';
import '../widgets/recurring_modal.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  String _search = '';
  String? _filterAccount;
  String? _filterCategory;
  DateTime? _filterDateFrom;
  DateTime? _filterDateTo;

  List<Transaction> _applyFilters(AppState state) {
    var list = state.transactions;
    if (_search.isNotEmpty) {
      final q = _search.toLowerCase();
      list = list.where((t) =>
          t.description.toLowerCase().contains(q) ||
          t.category.toLowerCase().contains(q) ||
          t.account.toLowerCase().contains(q)).toList();
    }
    if (_filterAccount != null && _filterAccount!.isNotEmpty) {
      list = list.where((t) => t.account == _filterAccount).toList();
    }
    if (_filterCategory != null && _filterCategory!.isNotEmpty) {
      list = list.where((t) => t.category == _filterCategory).toList();
    }
    if (_filterDateFrom != null) {
      list = list.where((t) => !t.date.isBefore(_filterDateFrom!)).toList();
    }
    if (_filterDateTo != null) {
      final end = DateTime(_filterDateTo!.year, _filterDateTo!.month, _filterDateTo!.day, 23, 59, 59);
      list = list.where((t) => !t.date.isAfter(end)).toList();
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        final list = _applyFilters(state);
        final accountNames = state.accounts.map((a) => a.name).toList();
        final categories = [...AppState.incomeCategories, ...AppState.expenseCategories]..sort();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
              child: Row(
                children: [
                  Text(
                    'Transactions',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '(${list.length})',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text('Recurring', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(width: 8),
                      FilledButton.tonal(
                        onPressed: () async {
                          final r = await showDialog<RecurringTemplate>(
                            context: context,
                            builder: (ctx) => RecurringModal(
                              accounts: state.accounts,
                              categories: categories,
                            ),
                          );
                          if (r != null && context.mounted) await state.addRecurring(r);
                        },
                        child: const Text('Add recurring'),
                      ),
                    ],
                  ),
                  if (state.recurring.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    ...state.recurring.map((r) => ListTile(
                          dense: true,
                          leading: const Icon(Icons.repeat_rounded),
                          title: Text(r.description),
                          subtitle: Text('${r.category} • ${formatCurrency(r.amount, state.currency)} • ${r.frequency}'),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.edit_rounded, size: 20),
                                onPressed: () async {
                                  final updated = await showDialog<RecurringTemplate>(
                                    context: context,
                                    builder: (ctx) => RecurringModal(
                                      template: r,
                                      accounts: state.accounts,
                                      categories: categories,
                                    ),
                                  );
                                  if (updated != null && context.mounted) await state.updateRecurring(updated);
                                },
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete_rounded, size: 20),
                                onPressed: () async {
                                  final ok = await showDialog<bool>(
                                    context: context,
                                    builder: (ctx) => AlertDialog(
                                      title: const Text('Delete recurring?'),
                                      content: Text('Delete "${r.description}"?'),
                                      actions: [
                                        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                                        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
                                      ],
                                    ),
                                  );
                                  if (ok == true && context.mounted) await state.deleteRecurring(r.id);
                                },
                              ),
                            ],
                          ),
                        )),
                    const SizedBox(height: 16),
                  ],
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 280,
                          child: TextField(
                            decoration: const InputDecoration(
                              hintText: 'Search transactions...',
                              prefixIcon: Icon(Icons.search_rounded),
                              border: OutlineInputBorder(),
                              isDense: true,
                            ),
                            onChanged: (v) => setState(() => _search = v),
                          ),
                        ),
                        const SizedBox(width: 12),
                        SizedBox(
                          width: 200,
                          child: DropdownButtonFormField<String>(
                            initialValue: _filterAccount,
                            isExpanded: true,
                            decoration: const InputDecoration(
                              labelText: 'Account',
                              border: OutlineInputBorder(),
                              isDense: true,
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            items: [
                              const DropdownMenuItem(value: null, child: Text('All', overflow: TextOverflow.ellipsis)),
                              ...accountNames.map((a) => DropdownMenuItem(value: a, child: Text(a, overflow: TextOverflow.ellipsis))),
                            ],
                            onChanged: (v) => setState(() => _filterAccount = v),
                          ),
                        ),
                        const SizedBox(width: 12),
                        SizedBox(
                          width: 200,
                          child: DropdownButtonFormField<String>(
                            initialValue: _filterCategory,
                            isExpanded: true,
                            decoration: const InputDecoration(
                              labelText: 'Category',
                              border: OutlineInputBorder(),
                              isDense: true,
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            items: [
                              const DropdownMenuItem(value: null, child: Text('All', overflow: TextOverflow.ellipsis)),
                              ...categories.map((c) => DropdownMenuItem(value: c, child: Text(c, overflow: TextOverflow.ellipsis))),
                            ],
                            onChanged: (v) => setState(() => _filterCategory = v),
                          ),
                        ),
                      const SizedBox(width: 12),
                      TextButton.icon(
                        onPressed: () async {
                          final range = await showDateRangePicker(
                            context: context,
                            firstDate: DateTime(2000),
                            lastDate: DateTime(2100),
                            initialDateRange: _filterDateFrom != null && _filterDateTo != null
                                ? DateTimeRange(start: _filterDateFrom!, end: _filterDateTo!)
                                : null,
                          );
                          if (range != null) {
                            setState(() {
                              _filterDateFrom = range.start;
                              _filterDateTo = range.end;
                            });
                          }
                        },
                        icon: const Icon(Icons.date_range_rounded),
                        label: Text(_filterDateFrom != null ? '${_filterDateFrom!.toString().split(' ')[0]} – ${_filterDateTo?.toString().split(' ')[0]}' : 'Date range'),
                      ),
                      IconButton(
                        onPressed: () => setState(() {
                          _filterAccount = null;
                          _filterCategory = null;
                          _filterDateFrom = null;
                          _filterDateTo = null;
                        }),
                        icon: const Icon(Icons.filter_alt_off_rounded),
                        tooltip: 'Clear filters',
                      ),
                      const SizedBox(width: 12),
                      FilledButton.icon(
                        onPressed: () => _showImportCsvDialog(context, state),
                        icon: const Icon(Icons.upload_rounded),
                        label: const Text('Import'),
                      ),
                      const SizedBox(width: 12),
                      FilledButton.icon(
                        onPressed: () async {
                          final t = await showDialog<Transaction>(
                            context: context,
                            builder: (ctx) => TransactionModal(
                              accounts: state.accounts,
                              categories: AppState.expenseCategories,
                              incomeCategories: AppState.incomeCategories,
                              currency: state.currency,
                            ),
                          );
                          if (t != null && context.mounted) {
                            await state.addTransaction(t);
                            if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Transaction added'), behavior: SnackBarBehavior.floating));
                          }
                        },
                        icon: const Icon(Icons.add_rounded),
                        label: const Text('Add Transaction'),
                      ),
                    ],
                  ),
                ),
                ],
              ),
            ),
            Expanded(
              child: list.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.receipt_long_rounded, size: 64, color: Theme.of(context).colorScheme.outline),
                          const SizedBox(height: 16),
                          Text('No transactions', style: Theme.of(context).textTheme.titleMedium),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      itemCount: list.length,
                      itemBuilder: (context, i) {
                        final t = list[i];
                        final dateStr = '${t.date.year}-${t.date.month.toString().padLeft(2, '0')}-${t.date.day.toString().padLeft(2, '0')}';
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            title: Text(t.description),
                            subtitle: Text('${t.category} • ${t.account}'),
                            leading: SizedBox(
                              width: 72,
                              child: Text(dateStr, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  formatCurrency(t.amount, state.currency),
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: t.amount >= 0 ? Colors.green : Colors.red,
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.edit_rounded),
                                  onPressed: () async {
                                    final updated = await showDialog<Transaction>(
                                      context: context,
                                      builder: (ctx) => TransactionModal(
                                        transaction: t,
                                        accounts: state.accounts,
                                        categories: AppState.expenseCategories,
                                        incomeCategories: AppState.incomeCategories,
                                        currency: state.currency,
                                      ),
                                    );
                                    if (updated != null && context.mounted) {
                                      await state.updateTransaction(updated);
                                      if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Transaction updated'), behavior: SnackBarBehavior.floating));
                                    }
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete_rounded),
                                  onPressed: () async {
                                    final ok = await showDialog<bool>(
                                      context: context,
                                      builder: (ctx) => AlertDialog(
                                        title: const Text('Delete transaction?'),
                                        content: Text('Delete "${t.description}"?'),
                                        actions: [
                                          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                                          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
                                        ],
                                      ),
                                    );
                                    if (ok == true && context.mounted) {
                                      state.deleteTransactionWithUndo(t.id);
                                      if (context.mounted) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: const Text('Transaction deleted'),
                                            behavior: SnackBarBehavior.floating,
                                            action: SnackBarAction(
                                              label: 'Undo',
                                              onPressed: () => state.undoLastTransactionDelete(),
                                            ),
                                          ),
                                        );
                                      }
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        );
      },
    );
  }

  Future<void> _showImportCsvDialog(BuildContext context, AppState state) async {
    final controller = TextEditingController();
    await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Import from CSV'),
        content: SizedBox(
          width: 500,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Paste CSV data with header: Date,Description,Category,Amount,Account'),
              const SizedBox(height: 8),
              TextField(
                controller: controller,
                maxLines: 10,
                decoration: const InputDecoration(
                  hintText: 'Date,Description,Category,Amount,Account\n2024-01-15,Groceries,Food & Dining,-85.50,Primary Checking',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () async {
              final csv = controller.text.trim();
              if (csv.isEmpty) return;
              final count = await state.importTransactionsFromCsv(csv);
              if (ctx.mounted) Navigator.pop(ctx);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Imported $count transaction(s)'), behavior: SnackBarBehavior.floating),
                );
              }
            },
            child: const Text('Import'),
          ),
        ],
      ),
    );
  }
}
