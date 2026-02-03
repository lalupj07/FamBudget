import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../models/account.dart';
import '../services/app_state.dart';
import '../utils/currency_format.dart';

class AccountsScreen extends StatelessWidget {
  const AccountsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        final accounts = state.accounts;
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Accounts', style: Theme.of(context).textTheme.headlineSmall),
                  FilledButton.icon(
                    onPressed: () => _showAccountDialog(context, state, null),
                    icon: const Icon(Icons.add),
                    label: const Text('Add Account'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              if (accounts.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(48),
                    child: Column(
                      children: [
                        Icon(Icons.account_balance, size: 64, color: Theme.of(context).colorScheme.outline),
                        const SizedBox(height: 16),
                        Text('No accounts yet', style: Theme.of(context).textTheme.titleMedium),
                      ],
                    ),
                  ),
                )
              else
                LayoutBuilder(
                  builder: (context, constraints) {
                    final crossAxisCount = constraints.maxWidth > 700 ? 3 : (constraints.maxWidth > 450 ? 2 : 1);
                    return GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: crossAxisCount,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 16,
                        childAspectRatio: 1.2,
                      ),
                      itemCount: accounts.length,
                      itemBuilder: (context, i) {
                        final a = accounts[i];
                        return Card(
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(a.name, style: Theme.of(context).textTheme.titleMedium),
                                    Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.edit),
                                          onPressed: () => _showAccountDialog(context, state, a),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete),
                                          onPressed: () => _deleteAccountWithUndo(context, state, a),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Chip(label: Text(a.type)),
                                const Spacer(),
                                Text(
                                  formatCurrency(a.balance, state.currency),
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: a.balance >= 0 ? Colors.green : Colors.red,
                                      ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _showAccountDialog(BuildContext context, AppState state, Account? existing) async {
    final nameController = TextEditingController(text: existing?.name ?? '');
    final balanceController = TextEditingController(text: existing?.balance.toString() ?? '0');
    String type = existing?.type ?? 'Checking';
    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: Text(existing == null ? 'Add Account' : 'Edit Account'),
          content: SizedBox(
            width: 320,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Account Name'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: type,
                  decoration: const InputDecoration(labelText: 'Type'),
                  items: ['Checking', 'Savings', 'Credit', 'Cash'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setDialogState(() => type = v ?? 'Checking'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: balanceController,
                  decoration: const InputDecoration(labelText: 'Balance'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            FilledButton(
              onPressed: () {
                final name = nameController.text.trim();
                final balance = double.tryParse(balanceController.text.replaceAll(',', '.')) ?? 0;
                if (name.isEmpty) return;
                final id = existing?.id ?? const Uuid().v4();
                final a = Account(id: id, name: name, type: type, balance: balance);
                Navigator.pop(ctx, a);
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    ).then((a) {
      if (a is Account) {
        if (existing == null) {
          state.addAccount(a);
        } else {
          state.updateAccount(a);
        }
      }
    });
  }

  void _deleteAccountWithUndo(BuildContext context, AppState state, Account a) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete account?'),
        content: Text('Delete "${a.name}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
        ],
      ),
    );
    if (ok == true && context.mounted) {
      state.deleteAccountWithUndo(a.id);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Account deleted'),
          behavior: SnackBarBehavior.floating,
          action: SnackBarAction(
            label: 'Undo',
            onPressed: () => state.undoLastAccountDelete(),
          ),
        ),
      );
    }
  }
}
