/// Income entry and income source models.
class IncomeEntry {
  final String id;
  final String description;
  final double amount;
  final String type; // recurring, one-time
  final DateTime date;
  final String? sourceId;

  const IncomeEntry({
    required this.id,
    required this.description,
    required this.amount,
    this.type = 'recurring',
    required this.date,
    this.sourceId,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'description': description,
        'amount': amount,
        'type': type,
        'date': date.toIso8601String().split('T')[0],
        'sourceId': sourceId,
      };

  static IncomeEntry fromJson(Map<String, dynamic> json) {
    final dateStr = json['date'] as String? ?? '';
    final date = dateStr.isNotEmpty
        ? DateTime.tryParse(dateStr) ?? DateTime.now()
        : DateTime.now();
    return IncomeEntry(
      id: json['id']?.toString() ?? '',
      description: json['description'] as String? ?? '',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0,
      type: json['type'] as String? ?? 'recurring',
      date: date,
      sourceId: json['sourceId'] as String?,
    );
  }
}

class IncomeSource {
  final String id;
  final String name;
  final double amount;
  final String type; // recurring, one-time

  const IncomeSource({
    required this.id,
    required this.name,
    this.amount = 0,
    this.type = 'recurring',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'amount': amount,
        'type': type,
      };

  static IncomeSource fromJson(Map<String, dynamic> json) => IncomeSource(
        id: json['id']?.toString() ?? '',
        name: json['name'] as String? ?? '',
        amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0,
        type: json['type'] as String? ?? 'recurring',
      );
}
