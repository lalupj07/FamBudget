import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/app_state.dart' show AppState, BudgetPeriod;
import '../utils/currency_format.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  int _trendMonths = 6;

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        final monthly = state.periodTotals(BudgetPeriod.monthly);
        final yearly = state.periodTotals(BudgetPeriod.yearly);
        final categories = state.budgetCategoriesWithSpent();
        final trends = state.getSpendingTrends(_trendMonths);
        final byMonth = <String, double>{};
        for (final t in trends) {
          final key = '${t.year}-${t.month.toString().padLeft(2, '0')}';
          byMonth[key] = (byMonth[key] ?? 0) + t.amount;
        }
        final sortedKeys = byMonth.keys.toList()..sort();
        final maxY = byMonth.values.isEmpty ? 100.0 : (byMonth.values.reduce((a, b) => a > b ? a : b) * 1.1);

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Reports & Analytics', style: Theme.of(context).textTheme.headlineSmall),
                  FilledButton.tonalIcon(
                    onPressed: () {
                      final csv = state.exportTransactionsCsv();
                      Clipboard.setData(ClipboardData(text: csv));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Exported ${state.transactions.length} transactions. CSV copied to clipboard.'), behavior: SnackBarBehavior.floating),
                      );
                    },
                    icon: const Icon(Icons.download_rounded),
                    label: const Text('Export'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('This month', style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            Text('Income: ${formatCurrency(monthly.totalIncome, state.currency)}', style: Theme.of(context).textTheme.bodyLarge),
                            Text('Expenses: ${formatCurrency(monthly.totalExpenses, state.currency)}', style: Theme.of(context).textTheme.bodyLarge),
                            Text('Net: ${formatCurrency(monthly.netChange, state.currency)}', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600)),
                            Text('Savings rate: ${monthly.savingsRate}%', style: Theme.of(context).textTheme.bodyLarge),
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
                            Text('This year', style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 12),
                            Text('Income: ${formatCurrency(yearly.totalIncome, state.currency)}', style: Theme.of(context).textTheme.bodyLarge),
                            Text('Expenses: ${formatCurrency(yearly.totalExpenses, state.currency)}', style: Theme.of(context).textTheme.bodyLarge),
                            Text('Net: ${formatCurrency(yearly.netChange, state.currency)}', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600)),
                            Text('Savings rate: ${yearly.savingsRate}%', style: Theme.of(context).textTheme.bodyLarge),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Text('Spending trends', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(width: 16),
                  SegmentedButton<int>(
                    segments: const [
                      ButtonSegment(value: 6, label: Text('6 months')),
                      ButtonSegment(value: 12, label: Text('12 months')),
                    ],
                    selected: {_trendMonths},
                    onSelectionChanged: (s) => setState(() => _trendMonths = s.first),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: SizedBox(
                    height: 220,
                    child: sortedKeys.isEmpty
                        ? Center(child: Text('No spending data for the last $_trendMonths months', style: Theme.of(context).textTheme.bodyMedium))
                        : BarChart(
                            BarChartData(
                              alignment: BarChartAlignment.spaceAround,
                              maxY: maxY,
                              minY: 0,
                              barGroups: sortedKeys.asMap().entries.map((e) {
                                final i = e.key;
                                final key = e.value;
                                final val = byMonth[key] ?? 0;
                                return BarChartGroupData(
                                  x: i,
                                  barRods: [
                                    BarChartRodData(
                                      toY: val,
                                      color: Theme.of(context).colorScheme.primary,
                                      width: 20,
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                                    ),
                                  ],
                                );
                              }).toList(),
                              titlesData: FlTitlesData(
                                show: true,
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 28,
                                    getTitlesWidget: (v, meta) {
                                      final i = v.toInt();
                                      if (i >= 0 && i < sortedKeys.length) {
                                        return Padding(
                                          padding: const EdgeInsets.only(top: 8),
                                          child: Text(sortedKeys[i], style: const TextStyle(fontSize: 10)),
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
                                    getTitlesWidget: (v, meta) => Text(v.toInt().toString(), style: const TextStyle(fontSize: 10)),
                                  ),
                                ),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              ),
                              gridData: FlGridData(show: true, drawVerticalLine: false),
                              borderData: FlBorderData(show: true),
                            ),
                          ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text('Spending by category (this month)', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: categories.isEmpty
                      ? const Center(child: Padding(padding: EdgeInsets.all(24), child: Text('No data')))
                      : Table(
                          columnWidths: const {0: FlexColumnWidth(2), 1: FlexColumnWidth(2), 2: FlexColumnWidth(1)},
                          children: [
                            const TableRow(
                              children: [
                                Padding(padding: EdgeInsets.only(bottom: 8), child: Text('Category', style: TextStyle(fontWeight: FontWeight.w600))),
                                Padding(padding: EdgeInsets.only(bottom: 8), child: Text('Spent', style: TextStyle(fontWeight: FontWeight.w600))),
                                Padding(padding: EdgeInsets.only(bottom: 8), child: Text('Budget', style: TextStyle(fontWeight: FontWeight.w600))),
                              ],
                            ),
                            ...categories.map((c) => TableRow(
                                  children: [
                                    Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Text(c.name)),
                                    Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Text(formatCurrency(c.spent, state.currency))),
                                    Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Text(formatCurrency(c.budget, state.currency))),
                                  ],
                                )),
                          ],
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
