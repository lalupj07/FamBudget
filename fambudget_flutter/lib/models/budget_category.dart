/// Budget category for dashboard overview.
class BudgetCategory {
  final String name;
  final double budget;
  final double spent;
  final double remaining;

  const BudgetCategory({
    required this.name,
    required this.budget,
    this.spent = 0,
    this.remaining = 0,
  });

  double get progressPercent => budget > 0 ? (spent / budget).clamp(0.0, 1.0) : 0;
}
