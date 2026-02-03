import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/budget_category.dart';
import '../models/budget_warning.dart';
import '../services/app_state.dart';
import '../utils/currency_format.dart';
import '../widgets/summary_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  BudgetPeriod _period = BudgetPeriod.monthly;

  static const _chartColors = [
    Color(0xFF1976D2),
    Color(0xFF4CAF50),
    Color(0xFFFF9800),
    Color(0xFFE91E63),
    Color(0xFF9C27B0),
    Color(0xFF00BCD4),
    Color(0xFF795548),
    Color(0xFF607D8B),
    Color(0xFFF44336),
    Color(0xFF3F51B5),
  ];

  List<PieChartSectionData> _chartSections(List<BudgetCategory> budgetCats, BuildContext context) {
    final total = budgetCats.fold<double>(0, (s, c) => s + c.spent);
    if (total <= 0) {
      return [
        PieChartSectionData(
          value: 1,
          title: 'No data',
          color: Colors.grey.shade400,
          radius: 48,
          titleStyle: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ];
    }
    final withSpent = budgetCats.asMap().entries.where((e) => e.value.spent > 0).toList();
    if (withSpent.isEmpty) {
      return [
        PieChartSectionData(
          value: 1,
          title: 'No data',
          color: Colors.grey.shade400,
          radius: 48,
          titleStyle: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ];
    }
    return withSpent.map((e) {
      final i = e.key % _chartColors.length;
      final cat = e.value;
      final pct = ((cat.spent / total) * 100).round();
      return PieChartSectionData(
        value: cat.spent,
        title: '$pct%',
        color: _chartColors[i],
        radius: 48,
        titleStyle: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600),
      );
    }).toList();
  }

  FlTitlesData _barTitlesData(bool hasData) {
    return FlTitlesData(
      show: true,
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 28,
          getTitlesWidget: (value, meta) {
            const labels = ['Income', 'Expenses'];
            final i = value.toInt();
            if (i >= 0 && i < labels.length) {
              return Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(labels[i], style: const TextStyle(fontSize: 11)),
              );
            }
            return const SizedBox.shrink();
          },
        ),
      ),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 40,
          getTitlesWidget: (value, meta) {
            if (value <= 0) return const SizedBox.shrink();
            return Text(value.toInt().toString(), style: const TextStyle(fontSize: 10));
          },
        ),
      ),
      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        final period = state.periodTotals(_period);
        final recent = state.recentTransactions(limit: 10);
        final budgetCats = state.budgetCategoriesWithSpent();
        final periodLabel = _period == BudgetPeriod.daily ? 'Today' : (_period == BudgetPeriod.monthly ? 'This month' : (_period == BudgetPeriod.quarterly ? 'This quarter' : 'This year'));

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Dashboard',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                  SegmentedButton<BudgetPeriod>(
                    segments: const [
                      ButtonSegment(value: BudgetPeriod.daily, icon: Icon(Icons.today), label: Text('Daily')),
                      ButtonSegment(value: BudgetPeriod.monthly, icon: Icon(Icons.calendar_month), label: Text('Monthly')),
                      ButtonSegment(value: BudgetPeriod.quarterly, icon: Icon(Icons.view_week), label: Text('Quarter')),
                      ButtonSegment(value: BudgetPeriod.yearly, icon: Icon(Icons.event), label: Text('Yearly')),
                    ],
                    selected: {_period},
                    onSelectionChanged: (s) => setState(() => _period = s.first),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // Budget warnings
              Builder(
                builder: (context) {
                  final warnings = state.getBudgetWarnings();
                  if (warnings.isEmpty) return const SizedBox.shrink();
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: Card(
                      color: Theme.of(context).colorScheme.errorContainer.withValues(alpha: 0.3),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.warning_amber_rounded, color: Theme.of(context).colorScheme.error),
                                const SizedBox(width: 8),
                                Text('Budget warnings', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Theme.of(context).colorScheme.onErrorContainer)),
                              ],
                            ),
                            const SizedBox(height: 12),
                            ...warnings.take(5).map((w) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 4,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      color: w.severity == BudgetWarningSeverity.high ? Colors.red : (w.severity == BudgetWarningSeverity.medium ? Colors.orange : Theme.of(context).colorScheme.primary),
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(w.message, style: Theme.of(context).textTheme.bodyMedium),
                                        const SizedBox(height: 4),
                                        LinearProgressIndicator(
                                          value: (w.percentage / 100).clamp(0.0, 1.0),
                                          backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                                          valueColor: AlwaysStoppedAnimation<Color>(w.severity == BudgetWarningSeverity.high ? Colors.red : Colors.orange),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            )),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
              LayoutBuilder(
                builder: (context, constraints) {
                  final crossAxisCount = constraints.maxWidth > 900 ? 4 : (constraints.maxWidth > 600 ? 2 : 1);
                  return GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: crossAxisCount,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.4,
                    children: [
                      SummaryCard(
                        title: 'Total Income',
                        amount: formatCurrency(period.totalIncome, state.currency),
                        periodLabel: periodLabel,
                        icon: Icons.trending_up_rounded,
                        color: const Color(0xFF4CAF50),
                      ),
                      SummaryCard(
                        title: 'Total Expenses',
                        amount: formatCurrency(period.totalExpenses, state.currency),
                        periodLabel: periodLabel,
                        icon: Icons.trending_down_rounded,
                        color: const Color(0xFFF44336),
                      ),
                      SummaryCard(
                        title: 'Net Change',
                        amount: formatCurrency(period.netChange, state.currency),
                        periodLabel: periodLabel,
                        icon: Icons.savings_rounded,
                        color: const Color(0xFF2196F3),
                      ),
                      SummaryCard(
                        title: 'Savings Rate',
                        amount: '${period.savingsRate}%',
                        periodLabel: periodLabel,
                        icon: Icons.percent_rounded,
                        color: const Color(0xFFFF9800),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 32),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Income vs Expenses', style: Theme.of(context).textTheme.titleMedium),
                      Text(periodLabel, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 220,
                        child: BarChart(
                          BarChartData(
                            alignment: BarChartAlignment.spaceAround,
                            maxY: (period.totalIncome > 0 || period.totalExpenses > 0)
                                ? (period.totalIncome >= period.totalExpenses ? period.totalIncome * 1.1 : period.totalExpenses * 1.1)
                                : 100,
                            minY: 0,
                            barGroups: [
                              BarChartGroupData(
                                x: 0,
                                barRods: [
                                  BarChartRodData(
                                    toY: period.totalIncome > 0 ? period.totalIncome : 0,
                                    color: const Color(0xFF4CAF50),
                                    width: 32,
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                                  ),
                                ],
                                showingTooltipIndicators: [0],
                              ),
                              BarChartGroupData(
                                x: 1,
                                barRods: [
                                  BarChartRodData(
                                    toY: period.totalExpenses > 0 ? period.totalExpenses : 0,
                                    color: const Color(0xFFF44336),
                                    width: 32,
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                                  ),
                                ],
                                showingTooltipIndicators: [0],
                              ),
                            ],
                            titlesData: _barTitlesData(period.totalIncome > 0 || period.totalExpenses > 0),
                            gridData: FlGridData(show: true, drawVerticalLine: false),
                            borderData: FlBorderData(show: true),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Builder(
                builder: (context) {
                  final upcoming = state.getUpcomingRecurring();
                  if (upcoming.isEmpty) return const SizedBox.shrink();
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.repeat_rounded, color: Theme.of(context).colorScheme.primary),
                                const SizedBox(width: 8),
                                Text('Upcoming recurring', style: Theme.of(context).textTheme.titleMedium),
                              ],
                            ),
                            const SizedBox(height: 12),
                            ...upcoming.take(5).map((u) => ListTile(
                                  dense: true,
                                  leading: CircleAvatar(
                                    radius: 20,
                                    child: Text(
                                      u.dueDate.day.toString(),
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                  ),
                                  title: Text(u.template.description),
                                  subtitle: Text(
                                      '${u.template.category} • ${formatCurrency(u.template.amount, state.currency)} • ${u.dueDate.toString().split(' ')[0]}'),
                                )),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 2,
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Spending by Category', style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 16),
                            SizedBox(
                              height: 220,
                              child: PieChart(
                                PieChartData(
                                  sectionsSpace: 2,
                                  centerSpaceRadius: 40,
                                  sections: _chartSections(budgetCats, context),
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              height: 180,
                              child: budgetCats.isEmpty
                                  ? const SizedBox.shrink()
                                  : ListView.builder(
                                      itemCount: budgetCats.length,
                                      itemBuilder: (context, i) {
                                        final c = budgetCats[i];
                                        return Padding(
                                          padding: const EdgeInsets.symmetric(vertical: 6),
                                          child: Row(
                                            children: [
                                              SizedBox(
                                                width: 120,
                                                child: Text(c.name, overflow: TextOverflow.ellipsis),
                                              ),
                                              Expanded(
                                                child: LinearProgressIndicator(
                                                  value: c.progressPercent,
                                                  backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                                                  valueColor: AlwaysStoppedAnimation<Color>(
                                                    c.progressPercent > 1 ? Colors.red : Theme.of(context).colorScheme.primary,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                formatCurrency(c.spent, state.currency),
                                                style: Theme.of(context).textTheme.bodySmall,
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Recent Transactions', style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            recent.isEmpty
                                ? const Padding(
                                    padding: EdgeInsets.all(16),
                                    child: Center(child: Text('No transactions this month')),
                                  )
                                : ListView.separated(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemCount: recent.length,
                                    separatorBuilder: (_, _) => const Divider(height: 1),
                                    itemBuilder: (context, i) {
                                      final t = recent[i];
                                      return ListTile(
                                        dense: true,
                                        title: Text(t.description, maxLines: 1, overflow: TextOverflow.ellipsis),
                                        subtitle: Text(t.category),
                                        trailing: Text(
                                          formatCurrency(t.amount, state.currency),
                                          style: TextStyle(
                                            color: t.amount >= 0 ? Colors.green : Colors.red,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text('Budget Overview', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: budgetCats.map((c) {
                      return Chip(
                        avatar: CircleAvatar(
                          backgroundColor: c.progressPercent > 1 ? Colors.red : Theme.of(context).colorScheme.primaryContainer,
                          child: Text(
                            '${(c.progressPercent * 100).round()}%',
                            style: TextStyle(fontSize: 10, color: Theme.of(context).colorScheme.onPrimaryContainer),
                          ),
                        ),
                        label: Text('${c.name}: ${formatCurrency(c.spent, state.currency)} / ${formatCurrency(c.budget, state.currency)}'),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
