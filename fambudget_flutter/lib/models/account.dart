/// Account model matching desktop app.
class Account {
  final String id;
  final String name;
  final String type;
  final double balance;

  const Account({
    required this.id,
    required this.name,
    this.type = 'Checking',
    this.balance = 0,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'type': type,
        'balance': balance,
      };

  static Account fromJson(Map<String, dynamic> json) => Account(
        id: json['id']?.toString() ?? '',
        name: json['name'] as String? ?? '',
        type: json['type'] as String? ?? 'Checking',
        balance: (json['balance'] is num) ? (json['balance'] as num).toDouble() : 0,
      );

  Account copyWith({String? id, String? name, String? type, double? balance}) =>
      Account(
        id: id ?? this.id,
        name: name ?? this.name,
        type: type ?? this.type,
        balance: balance ?? this.balance,
      );
}
