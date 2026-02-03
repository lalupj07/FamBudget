import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/recurring_template.dart';
import '../models/account.dart';

class RecurringModal extends StatefulWidget {
  const RecurringModal({
    super.key,
    this.template,
    required this.accounts,
    required this.categories,
  });

  final RecurringTemplate? template;
  final List<Account> accounts;
  final List<String> categories;

  @override
  State<RecurringModal> createState() => _RecurringModalState();
}

class _RecurringModalState extends State<RecurringModal> {
  late final TextEditingController _descController;
  late final TextEditingController _amountController;
  late String _category;
  late String _account;
  late String _frequency;
  late DateTime _startDate;

  @override
  void initState() {
    super.initState();
    final t = widget.template;
    _descController = TextEditingController(text: t?.description ?? '');
    _amountController = TextEditingController(text: t?.amount.toString() ?? '');
    _category = t?.category ?? (widget.categories.isNotEmpty ? widget.categories.first : '');
    _account = t?.account ?? (widget.accounts.isNotEmpty ? widget.accounts.first.name : '');
    _frequency = t?.frequency ?? 'monthly';
    _startDate = t?.startDate ?? DateTime.now();
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
    final id = widget.template?.id ?? const Uuid().v4();
    final r = RecurringTemplate(
      id: id,
      description: desc,
      amount: amount,
      category: _category,
      account: _account,
      frequency: _frequency,
      startDate: _startDate,
    );
    Navigator.of(context).pop(r);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.template == null ? 'Add recurring' : 'Edit recurring'),
      content: SizedBox(
        width: 360,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _descController,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(labelText: 'Amount'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _category,
                decoration: const InputDecoration(labelText: 'Category'),
                items: widget.categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _category = v ?? _category),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _account,
                decoration: const InputDecoration(labelText: 'Account'),
                items: widget.accounts.map((a) => DropdownMenuItem(value: a.name, child: Text(a.name))).toList(),
                onChanged: (v) => setState(() => _account = v ?? _account),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _frequency,
                decoration: const InputDecoration(labelText: 'Frequency'),
                items: const [
                  DropdownMenuItem(value: 'weekly', child: Text('Weekly')),
                  DropdownMenuItem(value: 'monthly', child: Text('Monthly')),
                  DropdownMenuItem(value: 'yearly', child: Text('Yearly')),
                ],
                onChanged: (v) => setState(() => _frequency = v ?? _frequency),
              ),
              const SizedBox(height: 8),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Start date'),
                subtitle: Text('${_startDate.year}-${_startDate.month.toString().padLeft(2, '0')}-${_startDate.day.toString().padLeft(2, '0')}'),
                trailing: TextButton(
                  onPressed: () async {
                    final d = await showDatePicker(
                      context: context,
                      initialDate: _startDate,
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (d != null) setState(() => _startDate = d);
                  },
                  child: const Text('Change'),
                ),
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
