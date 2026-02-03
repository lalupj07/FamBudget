import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../models/goal.dart';
import '../services/app_state.dart';
import '../utils/currency_format.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        final goals = state.goals;
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Goals', style: Theme.of(context).textTheme.headlineSmall),
                  FilledButton.icon(
                    onPressed: () => _showGoalDialog(context, state, null),
                    icon: const Icon(Icons.add),
                    label: const Text('Add Goal'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              _GoalCalculatorCard(currency: state.currency),
              const SizedBox(height: 24),
              if (goals.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(48),
                    child: Column(
                      children: [
                        Icon(Icons.flag, size: 64, color: Theme.of(context).colorScheme.outline),
                        const SizedBox(height: 16),
                        Text('No saving goals yet', style: Theme.of(context).textTheme.titleMedium),
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
                        childAspectRatio: 1.1,
                      ),
                      itemCount: goals.length,
                      itemBuilder: (context, i) {
                        final g = goals[i];
                        return Card(
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(child: Text(g.name, style: Theme.of(context).textTheme.titleMedium)),
                                    Row(
                                      children: [
                                        IconButton(icon: const Icon(Icons.edit), onPressed: () => _showGoalDialog(context, state, g)),
                                        IconButton(icon: const Icon(Icons.delete), onPressed: () => _confirmDeleteGoalWithUndo(context, state, g)),
                                      ],
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Chip(
                                  label: Text(g.priority),
                                  backgroundColor: g.priority == 'high' ? Colors.red.shade100 : (g.priority == 'medium' ? Colors.orange.shade100 : Colors.green.shade100),
                                ),
                                const SizedBox(height: 12),
                                LinearProgressIndicator(
                                  value: g.progress,
                                  backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                                  valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).colorScheme.primary),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  '${formatCurrency(g.currentAmount, state.currency)} / ${formatCurrency(g.targetAmount, state.currency)}',
                                  style: Theme.of(context).textTheme.bodySmall,
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

  Future<void> _showGoalDialog(BuildContext context, AppState state, Goal? existing) async {
    final nameController = TextEditingController(text: existing?.name ?? '');
    final targetController = TextEditingController(text: existing?.targetAmount.toString() ?? '');
    final currentController = TextEditingController(text: existing?.currentAmount.toString() ?? '0');
    String priority = existing?.priority ?? 'medium';
    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: Text(existing == null ? 'Add Goal' : 'Edit Goal'),
          content: SizedBox(
            width: 320,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Goal name')),
                const SizedBox(height: 12),
                TextField(
                  controller: targetController,
                  decoration: const InputDecoration(labelText: 'Target amount'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: currentController,
                  decoration: const InputDecoration(labelText: 'Current amount'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: priority,
                  items: ['high', 'medium', 'low'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (v) => setDialogState(() => priority = v ?? 'medium'),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            FilledButton(
              onPressed: () {
                final name = nameController.text.trim();
                final target = double.tryParse(targetController.text.replaceAll(',', '.')) ?? 0;
                final current = double.tryParse(currentController.text.replaceAll(',', '.')) ?? 0;
                if (name.isEmpty) return;
                final id = existing?.id ?? const Uuid().v4();
                Navigator.pop(ctx, Goal(id: id, name: name, targetAmount: target, currentAmount: current, priority: priority));
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    ).then((g) {
      if (g is Goal) {
        if (existing == null) {
          state.addGoal(g);
        } else {
          state.updateGoal(g);
        }
      }
    });
  }

  void _confirmDeleteGoalWithUndo(BuildContext context, AppState state, Goal g) {
    state.deleteGoalWithUndo(g.id);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Goal deleted'),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () => state.undoLastGoalDelete(),
        ),
      ),
    );
  }
}

class _GoalCalculatorCard extends StatefulWidget {
  const _GoalCalculatorCard({required this.currency});

  final String currency;

  @override
  State<_GoalCalculatorCard> createState() => _GoalCalculatorCardState();
}

class _GoalCalculatorCardState extends State<_GoalCalculatorCard> {
  final _targetController = TextEditingController();
  final _currentController = TextEditingController(text: '0');
  DateTime _targetDate = DateTime.now().add(const Duration(days: 365));

  @override
  void dispose() {
    _targetController.dispose();
    _currentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final target = double.tryParse(_targetController.text.replaceAll(',', '.')) ?? 0;
    final current = double.tryParse(_currentController.text.replaceAll(',', '.')) ?? 0;
    final months = _targetDate.month - DateTime.now().month + (_targetDate.year - DateTime.now().year) * 12;
    final monthly = (months > 0 && target > current)
        ? (target - current) / months
        : 0.0;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.calculate_rounded, color: Theme.of(context).colorScheme.primary),
                const SizedBox(width: 8),
                Text('Goal calculator', style: Theme.of(context).textTheme.titleMedium),
              ],
            ),
            const SizedBox(height: 16),
            Text('How much to save per month to reach your target?', style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 12),
            TextField(
              controller: _targetController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Target amount'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _currentController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Current amount saved'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Target date'),
              subtitle: Text('${_targetDate.year}-${_targetDate.month.toString().padLeft(2, '0')}-${_targetDate.day.toString().padLeft(2, '0')}'),
              trailing: TextButton(
                onPressed: () async {
                  final d = await showDatePicker(
                    context: context,
                    initialDate: _targetDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365 * 10)),
                  );
                  if (d != null) setState(() => _targetDate = d);
                },
                child: const Text('Pick date'),
              ),
            ),
            const SizedBox(height: 12),
            if (monthly > 0)
              Text(
                'Save ${formatCurrency(monthly, widget.currency)} per month',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
              ),
          ],
        ),
      ),
    );
  }
}
