/// Recurring transaction template for rent, subscriptions, etc.
class RecurringTemplate {
  final String id;
  final String description;
  final double amount;
  final String category;
  final String account;
  final String frequency; // weekly, monthly, yearly
  final DateTime startDate;

  const RecurringTemplate({
    required this.id,
    required this.description,
    required this.amount,
    required this.category,
    required this.account,
    this.frequency = 'monthly',
    required this.startDate,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'description': description,
        'amount': amount,
        'category': category,
        'account': account,
        'frequency': frequency,
        'startDate': startDate.toIso8601String().split('T')[0],
      };

  static RecurringTemplate fromJson(Map<String, dynamic> json) {
    final dateStr = json['startDate'] as String? ?? '';
    final startDate = dateStr.isNotEmpty
        ? DateTime.tryParse(dateStr) ?? DateTime.now()
        : DateTime.now();
    return RecurringTemplate(
      id: json['id']?.toString() ?? '',
      description: json['description'] as String? ?? '',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0,
      category: json['category'] as String? ?? '',
      account: json['account'] as String? ?? 'Primary Checking',
      frequency: json['frequency'] as String? ?? 'monthly',
      startDate: startDate,
    );
  }

  /// Next due date from a given date (simplified: next occurrence).
  DateTime nextDueFrom(DateTime from) {
    final day = startDate.day.clamp(1, 28);
    if (frequency == 'weekly') {
      var d = DateTime(startDate.year, startDate.month, startDate.day);
      while (!d.isAfter(from)) {
        d = d.add(const Duration(days: 7));
      }
      return d;
    }
    if (frequency == 'monthly') {
      var d = DateTime(from.year, from.month, day);
      if (d.isBefore(from) || d.isAtSameMomentAs(from)) {
        d = DateTime(from.year, from.month + 1, day);
      }
      return d;
    }
    if (frequency == 'yearly') {
      var d = DateTime(from.year, startDate.month, day);
      if (!d.isAfter(from)) d = DateTime(from.year + 1, startDate.month, day);
      return d;
    }
    return from;
  }
}
