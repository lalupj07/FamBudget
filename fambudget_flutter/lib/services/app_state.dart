import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import '../models/account.dart';
import '../models/budget_category.dart';
import '../models/budget_warning.dart';
import '../models/goal.dart';
import '../models/income.dart';
import '../models/transaction.dart';
import '../models/recurring_template.dart';
import 'storage_service.dart';

enum BudgetPeriod { daily, monthly, quarterly, yearly }

/// Central app state (replaces FamBudgetApp class from desktop).
class AppState extends ChangeNotifier {
  AppState(this._storage);

  final StorageService _storage;

  List<Transaction> _transactions = [];
  List<Account> _accounts = [];
  List<Goal> _goals = [];
  List<IncomeEntry> _income = [];
  List<IncomeSource> _incomeSources = [];
  List<RecurringTemplate> _recurring = [];
  Map<String, double> _categoryBudgets = {};
  Transaction? _lastDeletedTransaction;
  Account? _lastDeletedAccount;
  Goal? _lastDeletedGoal;
  Timer? _undoTimer;
  bool _isDarkTheme = false;
  String _currency = 'USD';
  String _profileName = 'User';
  String _profileEmail = '';
  String _profileHousehold = '';
  String? _profilePhotoPath;
  String _locale = 'en';

  List<Transaction> get transactions => List.unmodifiable(_transactions);
  List<Account> get accounts => List.unmodifiable(_accounts);
  List<Goal> get goals => List.unmodifiable(_goals);
  List<IncomeEntry> get income => List.unmodifiable(_income);
  List<IncomeSource> get incomeSources => List.unmodifiable(_incomeSources);
  List<RecurringTemplate> get recurring => List.unmodifiable(_recurring);
  Transaction? get lastDeletedTransaction => _lastDeletedTransaction;
  Account? get lastDeletedAccount => _lastDeletedAccount;
  Goal? get lastDeletedGoal => _lastDeletedGoal;
  bool get isDarkTheme => _isDarkTheme;
  String get currency => _currency;
  String get profileName => _profileName;
  String get profileEmail => _profileEmail;
  String get profileHousehold => _profileHousehold;
  String? get profilePhotoPath => _profilePhotoPath;
  String get locale => _locale;
  bool get tourCompleted => _storage.tourCompleted;

  static const List<String> expenseCategories = [
    'Food & Dining', 'Utilities', 'Transportation', 'Entertainment',
    'Shopping', 'Health & Fitness', 'Education', 'Travel',
    'Home & Garden', 'Personal Care',
  ];

  static const List<String> incomeCategories = [
    'Salary', 'Freelance', 'Investments', 'Rental', 'Side business', 'Other',
  ];

  static const List<BudgetCategory> defaultBudgetCategories = [
    BudgetCategory(name: 'Food & Dining', budget: 800),
    BudgetCategory(name: 'Utilities', budget: 400),
    BudgetCategory(name: 'Transportation', budget: 500),
    BudgetCategory(name: 'Entertainment', budget: 300),
    BudgetCategory(name: 'Shopping', budget: 250),
    BudgetCategory(name: 'Health & Fitness', budget: 200),
    BudgetCategory(name: 'Education', budget: 150),
    BudgetCategory(name: 'Travel', budget: 400),
    BudgetCategory(name: 'Home & Garden', budget: 300),
    BudgetCategory(name: 'Personal Care', budget: 150),
  ];

  Future<void> loadAll() async {
    _transactions = await _storage.getTransactions();
    _accounts = await _storage.getAccounts();
    _goals = await _storage.getGoals();
    _income = await _storage.getIncome();
    _incomeSources = await _storage.getIncomeSources();
    _isDarkTheme = _storage.isDarkTheme;
    _currency = _storage.currency;
    _profileName = _storage.profileName;
    _profileEmail = _storage.profileEmail;
    _profileHousehold = _storage.profileHousehold;
    _profilePhotoPath = _storage.profilePhotoPath;
    _locale = _storage.locale;
    _categoryBudgets = await _storage.getCategoryBudgets();
    _recurring = await _storage.getRecurring();
    if (_accounts.isEmpty && !_storage.dataCleared) {
      _accounts = [const Account(id: '1', name: 'Primary Checking', type: 'Checking', balance: 0)];
      await _storage.saveAccounts(_accounts);
    }
    notifyListeners();
  }

  double getCategoryBudget(String categoryName) {
    if (_categoryBudgets.containsKey(categoryName)) return _categoryBudgets[categoryName]!;
    for (final c in defaultBudgetCategories) {
      if (c.name == categoryName) return c.budget;
    }
    return 0;
  }

  Future<void> setCategoryBudget(String categoryName, double value) async {
    _categoryBudgets[categoryName] = value;
    await _storage.saveCategoryBudgets(_categoryBudgets);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkTheme = !_isDarkTheme;
    await _storage.setDarkTheme(_isDarkTheme);
    notifyListeners();
  }

  Future<void> setCurrency(String value) async {
    _currency = value;
    await _storage.setCurrency(value);
    notifyListeners();
  }

  Future<void> updateProfile({String? name, String? email, String? household}) async {
    if (name != null) {
      _profileName = name;
      await _storage.setProfileName(name);
    }
    if (email != null) {
      _profileEmail = email;
      await _storage.setProfileEmail(email);
    }
    if (household != null) {
      _profileHousehold = household;
      await _storage.setProfileHousehold(household);
    }
    notifyListeners();
  }

  Future<void> setProfilePhoto(String path) async {
    _profilePhotoPath = path;
    await _storage.setProfilePhotoPath(path);
    notifyListeners();
  }

  Future<void> clearProfilePhoto() async {
    _profilePhotoPath = null;
    await _storage.setProfilePhotoPath(null);
    notifyListeners();
  }

  Future<void> setLocale(String localeCode) async {
    _locale = localeCode;
    await _storage.setLocale(localeCode);
    notifyListeners();
  }

  Future<void> setTourCompleted(bool value) async {
    await _storage.setTourCompleted(value);
    notifyListeners();
  }

  // Transactions
  Future<void> addTransaction(Transaction t) async {
    _transactions.add(t);
    _transactions.sort((a, b) => b.date.compareTo(a.date));
    await _storage.saveTransactions(_transactions);
    notifyListeners();
  }

  Future<void> updateTransaction(Transaction t) async {
    final i = _transactions.indexWhere((x) => x.id == t.id);
    if (i >= 0) {
      _transactions[i] = t;
      _transactions.sort((a, b) => b.date.compareTo(a.date));
      await _storage.saveTransactions(_transactions);
      notifyListeners();
    }
  }

  Future<void> deleteTransaction(String id) async {
    _transactions.removeWhere((x) => x.id == id);
    await _storage.saveTransactions(_transactions);
    notifyListeners();
  }

  void deleteTransactionWithUndo(String id) {
    final t = _transactions.where((x) => x.id == id).firstOrNull;
    if (t == null) return;
    _transactions.removeWhere((x) => x.id == id);
    _storage.saveTransactions(_transactions);
    _undoTimer?.cancel();
    _lastDeletedTransaction = t;
    _lastDeletedAccount = null;
    _lastDeletedGoal = null;
    _undoTimer = Timer(const Duration(seconds: 5), () {
      _lastDeletedTransaction = null;
      notifyListeners();
    });
    notifyListeners();
  }

  void undoLastTransactionDelete() {
    _undoTimer?.cancel();
    _undoTimer = null;
    if (_lastDeletedTransaction != null) {
      _transactions.add(_lastDeletedTransaction!);
      _transactions.sort((a, b) => b.date.compareTo(a.date));
      _storage.saveTransactions(_transactions);
      _lastDeletedTransaction = null;
      notifyListeners();
    }
  }

  // Accounts
  Future<void> addAccount(Account a) async {
    _accounts.add(a);
    await _storage.saveAccounts(_accounts);
    notifyListeners();
  }

  Future<void> updateAccount(Account a) async {
    final i = _accounts.indexWhere((x) => x.id == a.id);
    if (i >= 0) {
      _accounts[i] = a;
      await _storage.saveAccounts(_accounts);
      notifyListeners();
    }
  }

  Future<void> deleteAccount(String id) async {
    _accounts.removeWhere((x) => x.id == id);
    await _storage.saveAccounts(_accounts);
    notifyListeners();
  }

  void deleteAccountWithUndo(String id) {
    final a = _accounts.where((x) => x.id == id).firstOrNull;
    if (a == null) return;
    _accounts.removeWhere((x) => x.id == id);
    _storage.saveAccounts(_accounts);
    _undoTimer?.cancel();
    _lastDeletedAccount = a;
    _lastDeletedTransaction = null;
    _lastDeletedGoal = null;
    _undoTimer = Timer(const Duration(seconds: 5), () {
      _lastDeletedAccount = null;
      notifyListeners();
    });
    notifyListeners();
  }

  void undoLastAccountDelete() {
    _undoTimer?.cancel();
    _undoTimer = null;
    if (_lastDeletedAccount != null) {
      _accounts.add(_lastDeletedAccount!);
      _storage.saveAccounts(_accounts);
      _lastDeletedAccount = null;
      notifyListeners();
    }
  }

  // Goals
  Future<void> addGoal(Goal g) async {
    _goals.add(g);
    await _storage.saveGoals(_goals);
    notifyListeners();
  }

  Future<void> updateGoal(Goal g) async {
    final i = _goals.indexWhere((x) => x.id == g.id);
    if (i >= 0) {
      _goals[i] = g;
      await _storage.saveGoals(_goals);
      notifyListeners();
    }
  }

  Future<void> deleteGoal(String id) async {
    _goals.removeWhere((x) => x.id == id);
    await _storage.saveGoals(_goals);
    notifyListeners();
  }

  void deleteGoalWithUndo(String id) {
    final g = _goals.where((x) => x.id == id).firstOrNull;
    if (g == null) return;
    _goals.removeWhere((x) => x.id == id);
    _storage.saveGoals(_goals);
    _undoTimer?.cancel();
    _lastDeletedGoal = g;
    _lastDeletedTransaction = null;
    _lastDeletedAccount = null;
    _undoTimer = Timer(const Duration(seconds: 5), () {
      _lastDeletedGoal = null;
      notifyListeners();
    });
    notifyListeners();
  }

  void undoLastGoalDelete() {
    _undoTimer?.cancel();
    _undoTimer = null;
    if (_lastDeletedGoal != null) {
      _goals.add(_lastDeletedGoal!);
      _storage.saveGoals(_goals);
      _lastDeletedGoal = null;
      notifyListeners();
    }
  }

  // Recurring
  Future<void> addRecurring(RecurringTemplate r) async {
    _recurring.add(r);
    await _storage.saveRecurring(_recurring);
    notifyListeners();
  }

  Future<void> updateRecurring(RecurringTemplate r) async {
    final i = _recurring.indexWhere((x) => x.id == r.id);
    if (i >= 0) {
      _recurring[i] = r;
      await _storage.saveRecurring(_recurring);
      notifyListeners();
    }
  }

  Future<void> deleteRecurring(String id) async {
    _recurring.removeWhere((x) => x.id == id);
    await _storage.saveRecurring(_recurring);
    notifyListeners();
  }

  /// Upcoming recurring in the next 7 days.
  List<({RecurringTemplate template, DateTime dueDate})> getUpcomingRecurring() {
    final now = DateTime.now();
    final end = now.add(const Duration(days: 7));
    final list = <({RecurringTemplate template, DateTime dueDate})>[];
    for (final r in _recurring) {
      var due = r.nextDueFrom(now);
      while (due.isBefore(now)) {
        due = r.nextDueFrom(due.add(const Duration(days: 1)));
      }
      if (!due.isAfter(end)) list.add((template: r, dueDate: due));
    }
    list.sort((a, b) => a.dueDate.compareTo(b.dueDate));
    return list;
  }

  // Income
  Future<void> addIncome(IncomeEntry e) async {
    _income.add(e);
    await _storage.saveIncome(_income);
    notifyListeners();
  }

  Future<void> deleteIncome(String id) async {
    _income.removeWhere((x) => x.id == id);
    await _storage.saveIncome(_income);
    notifyListeners();
  }

  Future<void> addIncomeSource(IncomeSource s) async {
    _incomeSources.add(s);
    await _storage.saveIncomeSources(_incomeSources);
    notifyListeners();
  }

  Future<void> updateIncomeSource(IncomeSource s) async {
    final i = _incomeSources.indexWhere((x) => x.id == s.id);
    if (i >= 0) {
      _incomeSources[i] = s;
      await _storage.saveIncomeSources(_incomeSources);
      notifyListeners();
    }
  }

  Future<void> deleteIncomeSource(String id) async {
    _incomeSources.removeWhere((x) => x.id == id);
    await _storage.saveIncomeSources(_incomeSources);
    notifyListeners();
  }

  // Dashboard calculations
  ({double totalIncome, double totalExpenses, double netChange, int savingsRate}) periodTotals(BudgetPeriod period) {
    final now = DateTime.now();
    late final DateTime start;
    late final DateTime end;
    switch (period) {
      case BudgetPeriod.daily:
        start = DateTime(now.year, now.month, now.day);
        end = start.add(const Duration(days: 1)).subtract(const Duration(milliseconds: 1));
        break;
      case BudgetPeriod.monthly:
        start = DateTime(now.year, now.month, 1);
        end = DateTime(now.year, now.month + 1, 0, 23, 59, 59);
        break;
      case BudgetPeriod.quarterly:
        final quarterMonth = ((now.month - 1) ~/ 3) * 3 + 1;
        start = DateTime(now.year, quarterMonth, 1);
        end = DateTime(now.year, quarterMonth + 3, 0, 23, 59, 59);
        break;
      case BudgetPeriod.yearly:
        start = DateTime(now.year, 1, 1);
        end = DateTime(now.year, 12, 31, 23, 59, 59);
        break;
    }
    final filtered = _transactions.where((t) {
      final d = t.date;
      return !d.isBefore(start) && !d.isAfter(end);
    }).toList();
    final totalIncome = filtered.where((t) => t.amount > 0).fold<double>(0, (s, t) => s + t.amount);
    final totalExpenses = filtered.where((t) => t.amount < 0).fold<double>(0, (s, t) => s + t.amount.abs());
    final netChange = totalIncome - totalExpenses;
    final savingsRate = totalIncome > 0 ? ((netChange / totalIncome) * 100).round() : 0;
    return (totalIncome: totalIncome, totalExpenses: totalExpenses, netChange: netChange, savingsRate: savingsRate);
  }

  List<Transaction> recentTransactions({int limit = 10}) {
    final now = DateTime.now();
    final start = DateTime(now.year, now.month, 1);
    final end = DateTime(now.year, now.month + 1, 0, 23, 59, 59);
    return _transactions
        .where((t) => !t.date.isBefore(start) && !t.date.isAfter(end))
        .take(limit)
        .toList();
  }

  List<BudgetCategory> budgetCategoriesWithSpent() {
    final now = DateTime.now();
    final start = DateTime(now.year, now.month, 1);
    final end = DateTime(now.year, now.month + 1, 0, 23, 59, 59);
    final monthly = _transactions.where((t) {
      final d = t.date;
      return !d.isBefore(start) && !d.isAfter(end) && t.amount < 0;
    });
    final categorySpent = <String, double>{};
    for (final t in monthly) {
      if (t.category.isNotEmpty) {
        categorySpent[t.category] = (categorySpent[t.category] ?? 0) + t.amount.abs();
      }
    }
    return defaultBudgetCategories.map((c) {
      final spent = categorySpent[c.name] ?? 0;
      final budget = getCategoryBudget(c.name);
      return BudgetCategory(name: c.name, budget: budget, spent: spent, remaining: budget - spent);
    }).toList();
  }

  /// Budget warnings (over / near / approaching) for dashboard.
  List<BudgetWarning> getBudgetWarnings() {
    final cats = budgetCategoriesWithSpent();
    final warnings = <BudgetWarning>[];
    for (final c in cats) {
      if (c.budget <= 0) continue;
      final pct = (c.spent / c.budget) * 100;
      if (pct >= 100) {
        warnings.add(BudgetWarning(
          category: c.name,
          message: '${c.name} is over budget by ${_formatCurrency(c.spent - c.budget)}',
          percentage: pct,
          severity: BudgetWarningSeverity.high,
        ));
      } else if (pct >= 90) {
        warnings.add(BudgetWarning(
          category: c.name,
          message: '${c.name} at ${pct.round()}% of budget (${_formatCurrency(c.remaining)} remaining)',
          percentage: pct,
          severity: BudgetWarningSeverity.medium,
        ));
      } else if (pct >= 75) {
        warnings.add(BudgetWarning(
          category: c.name,
          message: '${c.name} at ${pct.round()}% of budget (${_formatCurrency(c.remaining)} remaining)',
          percentage: pct,
          severity: BudgetWarningSeverity.low,
        ));
      }
    }
    warnings.sort((a, b) => b.severity.index.compareTo(a.severity.index));
    return warnings;
  }

  String _formatCurrency(double amount) {
    final sym = _currency == 'USD' ? '\$' : _currency;
    return '$sym${amount.abs().toStringAsFixed(2)}';
  }

  /// Export all data as JSON string (backup).
  Future<String> exportAllDataJson() async {
    return _storage.exportAllDataJson(
      _transactions.map((e) => e.toJson()).toList(),
      _accounts.map((e) => e.toJson()).toList(),
      _goals.map((e) => e.toJson()).toList(),
      _income.map((e) => e.toJson()).toList(),
      _incomeSources.map((e) => e.toJson()).toList(),
    );
  }

  /// Import from JSON backup. Returns true on success.
  Future<bool> importAllDataFromJson(String jsonString) async {
    final ok = await _storage.importAllDataFromJson(jsonString);
    if (ok) {
      _transactions = await _storage.getTransactions();
      _accounts = await _storage.getAccounts();
      _goals = await _storage.getGoals();
      _income = await _storage.getIncome();
      _incomeSources = await _storage.getIncomeSources();
      notifyListeners();
    }
    return ok;
  }

  /// Import transactions from CSV string. Returns count of imported rows.
  Future<int> importTransactionsFromCsv(String csv) async {
    final lines = csv.split('\n').map((s) => s.trim()).where((s) => s.isNotEmpty).toList();
    if (lines.isEmpty) return 0;
    int count = 0;
    for (var i = 1; i < lines.length; i++) {
      final row = _parseCsvLine(lines[i]);
      if (row.length < 4) continue;
      final dateStr = row.isNotEmpty ? row[0] : '';
      final desc = row.length > 1 ? row[1].replaceAll('"', '') : '';
      final category = row.length > 2 ? row[2] : '';
      final amountStr = row.length > 3 ? row[3].replaceAll(RegExp(r'[^\d.-]'), '') : '0';
      final account = row.length > 4 ? row[4] : (_accounts.isNotEmpty ? _accounts.first.name : 'Primary Checking');
      final date = DateTime.tryParse(dateStr) ?? DateTime.now();
      final amount = double.tryParse(amountStr) ?? 0;
      if (desc.isEmpty) continue;
      _transactions.add(Transaction(
        id: 'import_${DateTime.now().millisecondsSinceEpoch}_$i',
        description: desc,
        amount: amount,
        category: category,
        date: date,
        account: account,
      ));
      count++;
    }
    if (count > 0) {
      _transactions.sort((a, b) => b.date.compareTo(a.date));
      await _storage.saveTransactions(_transactions);
      notifyListeners();
    }
    return count;
  }

  static List<String> _parseCsvLine(String line) {
    final result = <String>[];
    var current = StringBuffer();
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      final c = line[i];
      if (c == '"') {
        inQuotes = !inQuotes;
      } else if ((c == ',' && !inQuotes) || c == '\n') {
        result.add(current.toString());
        current = StringBuffer();
      } else {
        current.write(c);
      }
    }
    result.add(current.toString());
    return result;
  }

  /// Export transactions to CSV string.
  String exportTransactionsCsv() {
    final sb = StringBuffer();
    sb.writeln('Date,Description,Category,Amount,Account');
    for (final t in _transactions) {
      sb.writeln('${t.date.toIso8601String().split('T')[0]},"${t.description.replaceAll('"', '""')}",${t.category},${t.amount},${t.account}');
    }
    return sb.toString();
  }

  /// Returns a hint if the transaction might be duplicate or unusual; null otherwise.
  String? getDuplicateHint(Transaction t) {
    final dayStart = DateTime(t.date.year, t.date.month, t.date.day);
    final dayEnd = dayStart.add(const Duration(days: 1));
    final sameDay = _transactions.where((x) =>
        x.id != t.id &&
        !x.date.isBefore(dayStart) &&
        x.date.isBefore(dayEnd) &&
        x.category == t.category);
    final amountAbs = t.amount.abs();
    for (final x in sameDay) {
      final otherAbs = x.amount.abs();
      if (amountAbs > 0 && otherAbs > 0) {
        final ratio = amountAbs / otherAbs;
        if (ratio >= 0.9 && ratio <= 1.1) {
          return 'Similar transaction already added today: "${x.description}" (${_formatCurrency(x.amount)}). Add anyway?';
        }
      }
    }
    if (t.amount < 0 && t.category.isNotEmpty) {
      final threeMonthsAgo = DateTime(t.date.year, t.date.month - 3, t.date.day);
      final categoryAvg = _transactions
          .where((x) => x.amount < 0 && x.category == t.category && x.date.isAfter(threeMonthsAgo))
          .map((x) => x.amount.abs())
          .toList();
      if (categoryAvg.length >= 3) {
        final avg = categoryAvg.reduce((a, b) => a + b) / categoryAvg.length;
        if (amountAbs > avg * 2) {
          return 'This amount is much higher than usual for "${t.category}" (avg ${_formatCurrency(-avg)}). Add anyway?';
        }
      }
    }
    return null;
  }

  /// Global search: transactions, accounts, goals.
  ({List<Transaction> transactions, List<Account> accounts, List<Goal> goals}) search(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return (transactions: [], accounts: [], goals: []);
    final tx = _transactions.where((t) =>
        t.description.toLowerCase().contains(q) ||
        t.category.toLowerCase().contains(q) ||
        t.account.toLowerCase().contains(q) ||
        t.amount.toString().contains(q)).toList();
    final ac = _accounts.where((a) => a.name.toLowerCase().contains(q)).toList();
    final gl = _goals.where((g) => g.name.toLowerCase().contains(q)).toList();
    return (transactions: tx, accounts: ac, goals: gl);
  }

  /// Spending by category per month for the last [months].
  List<({int year, int month, String category, double amount})> getSpendingTrends(int months) {
    final now = DateTime.now();
    final result = <({int year, int month, String category, double amount})>[];
    final start = DateTime(now.year, now.month - months, 1);
    for (final t in _transactions) {
      if (t.amount >= 0 || t.date.isBefore(start)) continue;
      if (t.category.isEmpty) continue;
      result.add((year: t.date.year, month: t.date.month, category: t.category, amount: t.amount.abs()));
    }
    return result;
  }

  bool get backupRemindMonthly => _storage.backupRemindMonthly;
  Future<void> setBackupRemindMonthly(bool value) async {
    await _storage.setBackupRemindMonthly(value);
    notifyListeners();
  }

  bool get shouldShowBackupReminder {
    if (!_storage.backupRemindMonthly) return false;
    final last = _storage.lastBackupDate;
    if (last == null) return true;
    final d = DateTime.tryParse(last);
    if (d == null) return true;
    return DateTime.now().difference(d).inDays >= 30;
  }

  Future<void> dismissBackupReminder() async {
    await _storage.setLastBackupDate(DateTime.now().toIso8601String());
    notifyListeners();
  }

  /// Backup to a file path. Writes JSON and updates last backup date. Returns path on success.
  Future<String?> backupNowToFile(String filePath) async {
    try {
      final json = await exportAllDataJson();
      await File(filePath).writeAsString(json);
      await _storage.setLastBackupDate(DateTime.now().toIso8601String());
      notifyListeners();
      return filePath;
    } catch (_) {
      return null;
    }
  }

  Future<void> clearAllData() async {
    _transactions = [];
    _accounts = [const Account(id: '1', name: 'Primary Checking', type: 'Checking', balance: 0)];
    _goals = [];
    _income = [];
    _incomeSources = [];
    _recurring = [];
    _categoryBudgets = {};
    _lastDeletedTransaction = null;
    _lastDeletedAccount = null;
    _lastDeletedGoal = null;
    _undoTimer?.cancel();
    await _storage.saveTransactions(_transactions);
    await _storage.saveAccounts(_accounts);
    await _storage.saveGoals(_goals);
    await _storage.saveIncome(_income);
    await _storage.saveIncomeSources(_incomeSources);
    await _storage.saveRecurring(_recurring);
    await _storage.saveCategoryBudgets(_categoryBudgets);
    await _storage.setDataCleared(true);
    notifyListeners();
  }

  /// Loads dummy data for testing: accounts, transactions, goals, income. Replaces current data.
  Future<void> loadSampleData() async {
    final now = DateTime.now();
    final thisMonth = DateTime(now.year, now.month, 1);
    final lastMonth = DateTime(now.year, now.month - 1, 1);

    _accounts = [
      const Account(id: 'acc1', name: 'Primary Checking', type: 'Checking', balance: 2450),
      const Account(id: 'acc2', name: 'Savings', type: 'Savings', balance: 5200),
      const Account(id: 'acc3', name: 'Cash', type: 'Cash', balance: 120),
    ];

    final accountNames = _accounts.map((a) => a.name).toList();

    final txList = <Transaction>[
      Transaction(id: 'tx1', description: 'Salary', amount: 3500, category: 'Salary', date: DateTime(thisMonth.year, thisMonth.month, 5), account: accountNames[0]),
      Transaction(id: 'tx2', description: 'Freelance project', amount: 450, category: 'Freelance', date: DateTime(thisMonth.year, thisMonth.month, 12), account: accountNames[0]),
      Transaction(id: 'tx3', description: 'Grocery store', amount: -125.50, category: 'Food & Dining', date: DateTime(thisMonth.year, thisMonth.month, 2), account: accountNames[0]),
      Transaction(id: 'tx4', description: 'Electric bill', amount: -89, category: 'Utilities', date: DateTime(thisMonth.year, thisMonth.month, 3), account: accountNames[0]),
      Transaction(id: 'tx5', description: 'Gas station', amount: -55, category: 'Transportation', date: DateTime(thisMonth.year, thisMonth.month, 4), account: accountNames[0]),
      Transaction(id: 'tx6', description: 'Netflix', amount: -15.99, category: 'Entertainment', date: DateTime(thisMonth.year, thisMonth.month, 6), account: accountNames[0]),
      Transaction(id: 'tx7', description: 'Supermarket', amount: -78.30, category: 'Food & Dining', date: DateTime(thisMonth.year, thisMonth.month, 8), account: accountNames[0]),
      Transaction(id: 'tx8', description: 'Coffee shop', amount: -12, category: 'Food & Dining', date: DateTime(thisMonth.year, thisMonth.month, 9), account: accountNames[0]),
      Transaction(id: 'tx9', description: 'Pharmacy', amount: -34, category: 'Health & Fitness', date: DateTime(thisMonth.year, thisMonth.month, 10), account: accountNames[0]),
      Transaction(id: 'tx10', description: 'Online shopping', amount: -67, category: 'Shopping', date: DateTime(thisMonth.year, thisMonth.month, 11), account: accountNames[0]),
      Transaction(id: 'tx11', description: 'Restaurant', amount: -45, category: 'Food & Dining', date: DateTime(thisMonth.year, thisMonth.month, 14), account: accountNames[0]),
      Transaction(id: 'tx12', description: 'Water bill', amount: -42, category: 'Utilities', date: DateTime(thisMonth.year, thisMonth.month, 15), account: accountNames[0]),
      Transaction(id: 'tx13', description: 'Bus pass', amount: -60, category: 'Transportation', date: DateTime(thisMonth.year, thisMonth.month, 16), account: accountNames[0]),
      Transaction(id: 'tx14', description: 'Movie tickets', amount: -28, category: 'Entertainment', date: DateTime(thisMonth.year, thisMonth.month, 18), account: accountNames[0]),
      Transaction(id: 'tx15', description: 'Book store', amount: -22, category: 'Education', date: DateTime(thisMonth.year, thisMonth.month, 20), account: accountNames[0]),
      Transaction(id: 'tx16', description: 'Transfer to savings', amount: -200, category: 'Other', date: DateTime(thisMonth.year, thisMonth.month, 5), account: accountNames[0]),
      Transaction(id: 'tx17', description: 'Salary', amount: 3500, category: 'Salary', date: DateTime(lastMonth.year, lastMonth.month, 5), account: accountNames[0]),
      Transaction(id: 'tx18', description: 'Rent', amount: -1200, category: 'Home & Garden', date: DateTime(lastMonth.year, lastMonth.month, 1), account: accountNames[0]),
      Transaction(id: 'tx19', description: 'Internet', amount: -65, category: 'Utilities', date: DateTime(lastMonth.year, lastMonth.month, 2), account: accountNames[0]),
      Transaction(id: 'tx20', description: 'Gym', amount: -35, category: 'Health & Fitness', date: DateTime(lastMonth.year, lastMonth.month, 10), account: accountNames[0]),
    ];
    txList.sort((a, b) => b.date.compareTo(a.date));

    _transactions = txList;

    _goals = [
      const Goal(id: 'g1', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1200, priority: 'high'),
      const Goal(id: 'g2', name: 'Vacation', targetAmount: 2000, currentAmount: 450, priority: 'medium'),
      const Goal(id: 'g3', name: 'New Laptop', targetAmount: 1200, currentAmount: 0, priority: 'low'),
      const Goal(id: 'g4', name: 'Car Maintenance', targetAmount: 800, currentAmount: 320, priority: 'medium'),
    ];

    _incomeSources = [
      const IncomeSource(id: 'src1', name: 'Main job', amount: 3500, type: 'recurring'),
      const IncomeSource(id: 'src2', name: 'Side gig', amount: 500, type: 'recurring'),
    ];

    _income = [
      IncomeEntry(id: 'ie1', description: 'Monthly salary', amount: 3500, type: 'recurring', date: DateTime(thisMonth.year, thisMonth.month, 5), sourceId: 'src1'),
      IncomeEntry(id: 'ie2', description: 'Freelance payment', amount: 450, type: 'one-time', date: DateTime(thisMonth.year, thisMonth.month, 12), sourceId: 'src2'),
      IncomeEntry(id: 'ie3', description: 'Monthly salary', amount: 3500, type: 'recurring', date: DateTime(lastMonth.year, lastMonth.month, 5), sourceId: 'src1'),
    ];

    _recurring = [
      RecurringTemplate(id: 'rec1', description: 'Rent', amount: 1200, category: 'Home & Garden', account: accountNames[0], frequency: 'monthly', startDate: DateTime(now.year, now.month, 1)),
      RecurringTemplate(id: 'rec2', description: 'Netflix', amount: 15.99, category: 'Entertainment', account: accountNames[0], frequency: 'monthly', startDate: DateTime(now.year, now.month, 6)),
    ];

    await _storage.saveTransactions(_transactions);
    await _storage.saveAccounts(_accounts);
    await _storage.saveGoals(_goals);
    await _storage.saveIncome(_income);
    await _storage.saveIncomeSources(_incomeSources);
    await _storage.saveRecurring(_recurring);
    notifyListeners();
  }
}
