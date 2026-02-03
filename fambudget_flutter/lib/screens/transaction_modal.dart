import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/transaction.dart';
import '../models/account.dart';

class TransactionModal extends StatefulWidget {
  const TransactionModal({
    super.key,
    this.transaction,
    required this.accounts,
    required this.categories,
    this.incomeCategories = const ['Salary', 'Freelance', 'Investments', 'Rental', 'Side business', 'Other'],
    required this.currency,
  });

  final Transaction? transaction;
  final List<Account> accounts;
  final List<String> categories;
  final List<String> incomeCategories;
  final String currency;

  @override
  State<TransactionModal> createState() => _TransactionModalState();
}

class _TransactionModalState extends State<TransactionModal> {
  late final TextEditingController _descController;
  late final TextEditingController _amountController;
  bool _isIncome = true;
  String _category = '';
  DateTime _date = DateTime.now();
  String _account = '';

  List<String> get _categories => _isIncome ? widget.incomeCategories : widget.categories;

  @override
  void initState() {
    super.initState();
    final t = widget.transaction;
    _descController = TextEditingController(text: t?.description ?? '');
    final rawAmount = t?.amount ?? 0;
    _isIncome = rawAmount >= 0;
    _amountController = TextEditingController(text: rawAmount != 0 ? rawAmount.abs().toString() : '');
    _category = t?.category ?? (_categories.isNotEmpty ? _categories.first : '');
    _date = t?.date ?? DateTime.now();
    _account = t?.account ?? (widget.accounts.isNotEmpty ? widget.accounts.first.name : '');
  }

  @override
  void dispose() {
    _descController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  void _submit() {
    final desc = _descController.text.trim();
    final amount = double.tryParse(_amountController.text.replaceAll(',', '.')) ?? 0;
    if (desc.isEmpty) return;
    final id = widget.transaction?.id ?? const Uuid().v4();
    final signedAmount = _isIncome ? amount : -amount;
    final t = Transaction(
      id: id,
      description: desc,
      amount: signedAmount,
      category: _category,
      date: _date,
      account: _account,
    );
    Navigator.of(context).pop(t);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.transaction == null ? 'Add Transaction' : 'Edit Transaction'),
      content: SingleChildScrollView(
        child: SizedBox(
          width: 400,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SegmentedButton<bool>(
                segments: const [
                  ButtonSegment(value: true, icon: Icon(Icons.arrow_downward_rounded), label: Text('Income')),
                  ButtonSegment(value: false, icon: Icon(Icons.arrow_upward_rounded), label: Text('Expense')),
                ],
                selected: {_isIncome},
                onSelectionChanged: (s) {
                  setState(() {
                    _isIncome = s.first;
                    if (!_categories.contains(_category)) _category = _categories.isNotEmpty ? _categories.first : '';
                  });
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _descController,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _amountController,
                decoration: InputDecoration(
                  labelText: 'Amount',
                  prefixText: _isIncome ? null : '-',
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _category.isNotEmpty && _categories.contains(_category) ? _category : null,
                decoration: const InputDecoration(labelText: 'Category'),
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _category = v ?? ''),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _account.isNotEmpty ? _account : null,
                decoration: const InputDecoration(labelText: 'Account'),
                items: widget.accounts.map((a) => DropdownMenuItem(value: a.name, child: Text(a.name))).toList(),
                onChanged: (v) => setState(() => _account = v ?? ''),
              ),
              const SizedBox(height: 12),
              ListTile(
                title: const Text('Date'),
                subtitle: Text('${_date.year}-${_date.month.toString().padLeft(2, '0')}-${_date.day.toString().padLeft(2, '0')}'),
                onTap: () async {
                  final picked = await showDatePicker(context: context, initialDate: _date, firstDate: DateTime(2000), lastDate: DateTime(2100));
                  if (picked != null) setState(() => _date = picked);
                },
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        FilledButton(onPressed: _submit, child: const Text('Save')),
      ],
    );
  }
}
