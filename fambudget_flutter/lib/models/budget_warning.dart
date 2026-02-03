/// Single budget warning for dashboard (over / near / approaching).
enum BudgetWarningSeverity { high, medium, low }

class BudgetWarning {
  final String category;
  final String message;
  final double percentage;
  final BudgetWarningSeverity severity;

  const BudgetWarning({
    required this.category,
    required this.message,
    required this.percentage,
    required this.severity,
  });
}
