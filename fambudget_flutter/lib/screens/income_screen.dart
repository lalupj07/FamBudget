import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../models/income.dart';
import '../services/app_state.dart';
import '../utils/currency_format.dart';

class IncomeScreen extends StatelessWidget {
  const IncomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        final income = state.income;
        final sources = state.incomeSources;
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Income', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 24),
              Text('Income sources', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              Row(
                children: [
                  FilledButton.icon(
                    onPressed: () => _showIncomeSourceDialog(context, state, null),
                    icon: const Icon(Icons.add),
                    label: const Text('Add source'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (sources.isEmpty)
                const Card(child: Padding(padding: EdgeInsets.all(24), child: Text('No income sources. Add one above.')))
              else
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: sources.map((s) {
                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(s.name, style: Theme.of(context).textTheme.titleSmall),
                                Text(formatCurrency(s.amount, state.currency), style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.green)),
                              ],
                            ),
                            IconButton(icon: const Icon(Icons.edit), onPressed: () => _showIncomeSourceDialog(context, state, s)),
                            IconButton(icon: const Icon(Icons.delete), onPressed: () => state.deleteIncomeSource(s.id)),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              const SizedBox(height: 32),
              Text('Income entries', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              FilledButton.icon(
                onPressed: () => _showIncomeEntryDialog(context, state, null),
                icon: const Icon(Icons.add),
                label: const Text('Add income'),
              ),
              const SizedBox(height: 16),
              if (income.isEmpty)
                const Card(child: Padding(padding: EdgeInsets.all(24), child: Text('No income entries.')))
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: income.length,
                  itemBuilder: (context, i) {
                    final e = income[i];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        title: Text(e.description),
                        subtitle: Text('${e.date.toString().split(' ')[0]} • ${e.type}'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(formatCurrency(e.amount, state.currency), style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w600)),
                            IconButton(icon: const Icon(Icons.delete), onPressed: () => state.deleteIncome(e.id)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _showIncomeSourceDialog(BuildContext context, AppState state, IncomeSource? existing) async {
    final nameController = TextEditingController(text: existing?.name ?? '');
    final amountController = TextEditingController(text: existing?.amount.toString() ?? '');
    String type = existing?.type ?? 'recurring';
    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: Text(existing == null ? 'Add income source' : 'Edit income source'),
          content: SizedBox(
            width: 320,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Name')),
                const SizedBox(height: 12),
                TextField(
                  controller: amountController,
                  decoration: const InputDecoration(labelText: 'Amount'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: type,
                  items: ['recurring', 'one-time'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setDialogState(() => type = v ?? 'recurring'),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            FilledButton(
              onPressed: () {
                final name = nameController.text.trim();
                final amount = double.tryParse(amountController.text.replaceAll(',', '.')) ?? 0;
                if (name.isEmpty) return;
                final id = existing?.id ?? const Uuid().v4();
                Navigator.pop(ctx, IncomeSource(id: id, name: name, amount: amount, type: type));
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    ).then((s) {
      if (s is IncomeSource) {
        if (existing == null) {
          state.addIncomeSource(s);
        } else {
          state.updateIncomeSource(s);
        }
      }
    });
  }

  Future<void> _showIncomeEntryDialog(BuildContext context, AppState state, IncomeEntry? existing) async {
    final descController = TextEditingController(text: existing?.description ?? '');
    final amountController = TextEditingController(text: existing?.amount.toString() ?? '');
    var date = existing?.date ?? DateTime.now();
    String type = existing?.type ?? 'recurring';
    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: Text(existing == null ? 'Add income' : 'Edit income'),
          content: SizedBox(
            width: 320,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: descController, decoration: const InputDecoration(labelText: 'Description')),
                const SizedBox(height: 12),
                TextField(
                  controller: amountController,
                  decoration: const InputDecoration(labelText: 'Amount'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: type,
                  items: ['recurring', 'one-time'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setDialogState(() => type = v ?? 'recurring'),
                ),
                ListTile(
                  title: Text('Date: ${date.toString().split(' ')[0]}'),
                  onTap: () async {
                    final p = await showDatePicker(context: context, initialDate: date, firstDate: DateTime(2000), lastDate: DateTime(2100));
                    if (p != null) setDialogState(() => date = p);
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            FilledButton(
              onPressed: () {
                final desc = descController.text.trim();
                final amount = double.tryParse(amountController.text.replaceAll(',', '.')) ?? 0;
                if (desc.isEmpty) return;
                final id = existing?.id ?? const Uuid().v4();
                Navigator.pop(ctx, IncomeEntry(id: id, description: desc, amount: amount, type: type, date: date));
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    ).then((e) {
      if (e is IncomeEntry && existing == null) state.addIncome(e);
    });
  }
}
