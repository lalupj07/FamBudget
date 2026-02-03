import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/transaction.dart';
import '../models/account.dart';

/// Minimal dialog: amount, category, account, optional description. For quick transaction entry.
class QuickAddDialog extends StatefulWidget {
  const QuickAddDialog({
    super.key,
    required this.accounts,
    required this.expenseCategories,
    required this.incomeCategories,
    required this.currency,
  });

  final List<Account> accounts;
  final List<String> expenseCategories;
  final List<String> incomeCategories;
  final String currency;

  @override
  State<QuickAddDialog> createState() => _QuickAddDialogState();
}

class _QuickAddDialogState extends State<QuickAddDialog> {
  final _amountController = TextEditingController();
  final _descController = TextEditingController();
  bool _isIncome = true;
  String _category = '';
  String _account = '';

  @override
  void initState() {
    super.initState();
    _category = widget.expenseCategories.isNotEmpty ? widget.expenseCategories.first : '';
    _account = widget.accounts.isNotEmpty ? widget.accounts.first.name : 'Primary Checking';
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descController.dispose();
    super.dispose();
  }

  List<String> get _categories => _isIncome ? widget.incomeCategories : widget.expenseCategories;

  void _submit() {
    final amount = double.tryParse(_amountController.text.replaceAll(',', '.')) ?? 0;
    if (amount == 0) return;
    final desc = _descController.text.trim();
    final signed = _isIncome ? amount : -amount;
    final t = Transaction(
      id: const Uuid().v4(),
      description: desc.isEmpty ? (_isIncome ? 'Income' : 'Expense') : desc,
      amount: signed,
      category: _category,
      date: DateTime.now(),
      account: _account,
    );
    Navigator.of(context).pop(t);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Quick add'),
      content: SizedBox(
        width: 320,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: SegmentedButton<bool>(
                    segments: const [
                      ButtonSegment(value: false, label: Text('Expense')),
                      ButtonSegment(value: true, label: Text('Income')),
                    ],
                    selected: {_isIncome},
                    onSelectionChanged: (s) {
                      setState(() {
                        _isIncome = s.first;
                        _category = _categories.isNotEmpty ? _categories.first : '';
                      });
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Amount',
                prefixText: widget.currency == 'USD' ? '\$ ' : '${widget.currency} ',
              ),
              onSubmitted: (_) => _submit(),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _categories.contains(_category) ? _category : (_categories.isNotEmpty ? _categories.first : null),
              decoration: const InputDecoration(labelText: 'Category'),
              items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (v) => setState(() => _category = v ?? _category),
            ),
            const SizedBox(height: 12),
            if (widget.accounts.isNotEmpty)
              DropdownButtonFormField<String>(
                initialValue: widget.accounts.any((a) => a.name == _account) ? _account : widget.accounts.first.name,
                decoration: const InputDecoration(labelText: 'Account'),
                items: widget.accounts.map((a) => DropdownMenuItem(value: a.name, child: Text(a.name))).toList(),
                onChanged: (v) => setState(() => _account = v ?? _account),
              ),
            const SizedBox(height: 8),
            TextField(
              controller: _descController,
              decoration: const InputDecoration(labelText: 'Description (optional)', hintText: 'e.g. Coffee'),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
        FilledButton(onPressed: _submit, child: const Text('Add')),
      ],
    );
  }
}
