import 'package:intl/intl.dart';

/// Currency formatting matching desktop app (symbol position, decimals).
const Map<String, Map<String, dynamic>> currencyConfig = {
  'USD': {'symbol': '\$', 'position': 'before', 'decimals': 2},
  'EUR': {'symbol': '€', 'position': 'after', 'decimals': 2},
  'GBP': {'symbol': '£', 'position': 'before', 'decimals': 2},
  'JPY': {'symbol': '¥', 'position': 'before', 'decimals': 0},
  'CAD': {'symbol': 'C\$', 'position': 'before', 'decimals': 2},
  'AUD': {'symbol': 'A\$', 'position': 'before', 'decimals': 2},
  'CHF': {'symbol': 'CHF', 'position': 'after', 'decimals': 2},
  'CNY': {'symbol': '¥', 'position': 'before', 'decimals': 2},
  'INR': {'symbol': '₹', 'position': 'before', 'decimals': 2},
  'BRL': {'symbol': 'R\$', 'position': 'before', 'decimals': 2},
};

String formatCurrency(double amount, String currencyCode) {
  final config = currencyConfig[currencyCode] ?? currencyConfig['USD']!;
  final decimals = config['decimals'] as int;
  final symbol = config['symbol'] as String;
  final position = config['position'] as String;
  final formatted = NumberFormat.currency(
    symbol: '',
    decimalDigits: decimals,
  ).format(amount.abs());
  if (position == 'before') {
    return '${amount < 0 ? '-' : ''}$symbol$formatted';
  } else {
    return '${amount < 0 ? '-' : ''}$formatted $symbol';
  }
}
