/// Transaction model matching desktop app structure.
class Transaction {
  final String id;
  final String description;
  final double amount;
  final String category;
  final DateTime date;
  final String account;

  const Transaction({
    required this.id,
    required this.description,
    required this.amount,
    required this.category,
    required this.date,
    this.account = 'Primary Checking',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'description': description,
        'amount': amount,
        'category': category,
        'date': date.toIso8601String().split('T')[0],
        'account': account,
      };

  static Transaction fromJson(Map<String, dynamic> json) {
    final dateStr = json['date'] as String? ?? '';
    final date = dateStr.isNotEmpty
        ? DateTime.tryParse(dateStr) ?? DateTime.now()
        : DateTime.now();
    return Transaction(
      id: json['id']?.toString() ?? '',
      description: json['description'] as String? ?? '',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0,
      category: json['category'] as String? ?? '',
      date: date,
      account: json['account'] as String? ?? 'Primary Checking',
    );
  }

  Transaction copyWith({
    String? id,
    String? description,
    double? amount,
    String? category,
    DateTime? date,
    String? account,
  }) =>
      Transaction(
        id: id ?? this.id,
        description: description ?? this.description,
        amount: amount ?? this.amount,
        category: category ?? this.category,
        date: date ?? this.date,
        account: account ?? this.account,
      );
}
