/// Saving goal model matching desktop app.
class Goal {
  final String id;
  final String name;
  final double targetAmount;
  final double currentAmount;
  final String priority; // high, medium, low

  const Goal({
    required this.id,
    required this.name,
    required this.targetAmount,
    this.currentAmount = 0,
    this.priority = 'medium',
  });

  double get progress =>
      targetAmount > 0 ? (currentAmount / targetAmount).clamp(0.0, 1.0) : 0;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'targetAmount': targetAmount,
        'currentAmount': currentAmount,
        'priority': priority,
      };

  static Goal fromJson(Map<String, dynamic> json) => Goal(
        id: json['id']?.toString() ?? '',
        name: json['name'] as String? ?? '',
        targetAmount: (json['targetAmount'] is num)
            ? (json['targetAmount'] as num).toDouble()
            : 0,
        currentAmount: (json['currentAmount'] is num)
            ? (json['currentAmount'] as num).toDouble()
            : 0,
        priority: json['priority'] as String? ?? 'medium',
      );

  Goal copyWith({
    String? id,
    String? name,
    double? targetAmount,
    double? currentAmount,
    String? priority,
  }) =>
      Goal(
        id: id ?? this.id,
        name: name ?? this.name,
        targetAmount: targetAmount ?? this.targetAmount,
        currentAmount: currentAmount ?? this.currentAmount,
        priority: priority ?? this.priority,
      );
}
