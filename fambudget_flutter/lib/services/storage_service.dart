import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/transaction.dart';
import '../models/account.dart';
import '../models/goal.dart';
import '../models/income.dart';
import '../models/recurring_template.dart';

/// Local persistence matching desktop app keys (fambudget_*).
class StorageService {
  static const _keyTransactions = 'fambudget_transactions';
  static const _keyAccounts = 'fambudget_accounts';
  static const _keyGoals = 'fambudget_goals';
  static const _keyIncome = 'fambudget_income';
  static const _keyIncomeSources = 'fambudget_income_sources';
  static const _keyDarkTheme = 'fambudget_dark_theme';
  static const _keyCurrency = 'fambudget_currency';
  static const _keyDataCleared = 'fambudget_data_cleared';
  static const _keyProfileName = 'fambudget_user_name';
  static const _keyProfileEmail = 'fambudget_user_email';
  static const _keyProfileHousehold = 'fambudget_household_name';
  static const _keyProfilePhotoPath = 'fambudget_profile_photo_path';
  static const _keyLocale = 'fambudget_locale';
  static const _keyTourCompleted = 'fambudget_tour_completed';
  static const _keyCategoryBudgets = 'fambudget_category_budgets';
  static const _keyRecurring = 'fambudget_recurring';
  static const _keyLastBackupDate = 'fambudget_last_backup_date';
  static const _keyBackupRemindMonthly = 'fambudget_backup_remind_monthly';

  final SharedPreferences _prefs;

  StorageService(this._prefs);

  static Future<StorageService> create() async {
    final prefs = await SharedPreferences.getInstance();
    return StorageService(prefs);
  }

  // Transactions
  Future<List<Transaction>> getTransactions() async {
    final json = _prefs.getString(_keyTransactions);
    if (json == null) return [];
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => Transaction.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveTransactions(List<Transaction> list) async {
    await _prefs.setString(
      _keyTransactions,
      jsonEncode(list.map((e) => e.toJson()).toList()),
    );
  }

  // Accounts
  Future<List<Account>> getAccounts() async {
    final json = _prefs.getString(_keyAccounts);
    if (json == null) return [];
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => Account.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveAccounts(List<Account> list) async {
    await _prefs.setString(
      _keyAccounts,
      jsonEncode(list.map((e) => e.toJson()).toList()),
    );
  }

  // Goals
  Future<List<Goal>> getGoals() async {
    final json = _prefs.getString(_keyGoals);
    if (json == null) return [];
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => Goal.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveGoals(List<Goal> list) async {
    await _prefs.setString(
      _keyGoals,
      jsonEncode(list.map((e) => e.toJson()).toList()),
    );
  }

  // Income
  Future<List<IncomeEntry>> getIncome() async {
    final json = _prefs.getString(_keyIncome);
    if (json == null) return [];
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => IncomeEntry.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveIncome(List<IncomeEntry> list) async {
    await _prefs.setString(
      _keyIncome,
      jsonEncode(list.map((e) => e.toJson()).toList()),
    );
  }

  // Income sources
  Future<List<IncomeSource>> getIncomeSources() async {
    final json = _prefs.getString(_keyIncomeSources);
    if (json == null) return [];
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => IncomeSource.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveIncomeSources(List<IncomeSource> list) async {
    await _prefs.setString(
      _keyIncomeSources,
      jsonEncode(list.map((e) => e.toJson()).toList()),
    );
  }

  // Theme & currency
  bool get isDarkTheme => _prefs.getBool(_keyDarkTheme) ?? false;
  Future<void> setDarkTheme(bool value) => _prefs.setBool(_keyDarkTheme, value);

  String get currency => _prefs.getString(_keyCurrency) ?? 'USD';
  Future<void> setCurrency(String value) => _prefs.setString(_keyCurrency, value);

  bool get dataCleared => _prefs.getBool(_keyDataCleared) ?? false;
  Future<void> setDataCleared(bool value) => _prefs.setBool(_keyDataCleared, value);

  // Profile (local, matching desktop fambudget_user / fambudget_household)
  String get profileName => _prefs.getString(_keyProfileName) ?? 'User';
  Future<void> setProfileName(String value) => _prefs.setString(_keyProfileName, value);
  String get profileEmail => _prefs.getString(_keyProfileEmail) ?? '';
  Future<void> setProfileEmail(String value) => _prefs.setString(_keyProfileEmail, value);
  String get profileHousehold => _prefs.getString(_keyProfileHousehold) ?? '';
  Future<void> setProfileHousehold(String value) => _prefs.setString(_keyProfileHousehold, value);

  String? get profilePhotoPath => _prefs.getString(_keyProfilePhotoPath);
  Future<void> setProfilePhotoPath(String? value) async {
    if (value == null) {
      await _prefs.remove(_keyProfilePhotoPath);
    } else {
      await _prefs.setString(_keyProfilePhotoPath, value);
    }
  }

  String get locale => _prefs.getString(_keyLocale) ?? 'en';
  Future<void> setLocale(String value) => _prefs.setString(_keyLocale, value);

  bool get tourCompleted => _prefs.getBool(_keyTourCompleted) ?? false;
  Future<void> setTourCompleted(bool value) => _prefs.setBool(_keyTourCompleted, value);

  // Category budgets (category name -> limit)
  Future<Map<String, double>> getCategoryBudgets() async {
    final json = _prefs.getString(_keyCategoryBudgets);
    if (json == null) return {};
    try {
      final map = jsonDecode(json) as Map<String, dynamic>;
      return map.map((k, v) => MapEntry(k, (v is num) ? v.toDouble() : 0.0));
    } catch (_) {
      return {};
    }
  }

  Future<void> saveCategoryBudgets(Map<String, double> map) async {
    await _prefs.setString(_keyCategoryBudgets, jsonEncode(map));
  }

  // Recurring templates
  Future<List<RecurringTemplate>> getRecurring() async {
    final json = _prefs.getString(_keyRecurring);
    if (json == null) return [];
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => RecurringTemplate.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveRecurring(List<RecurringTemplate> list) async {
    await _prefs.setString(_keyRecurring, jsonEncode(list.map((e) => e.toJson()).toList()));
  }

  // Backup
  String? get lastBackupDate => _prefs.getString(_keyLastBackupDate);
  Future<void> setLastBackupDate(String? value) async {
    if (value == null) {
      await _prefs.remove(_keyLastBackupDate);
    } else {
      await _prefs.setString(_keyLastBackupDate, value);
    }
  }

  bool get backupRemindMonthly => _prefs.getBool(_keyBackupRemindMonthly) ?? false;
  Future<void> setBackupRemindMonthly(bool value) => _prefs.setBool(_keyBackupRemindMonthly, value);

  /// Export all app data as JSON string (backup).
  Future<String> exportAllDataJson(
    List<Map<String, dynamic>> transactions,
    List<Map<String, dynamic>> accounts,
    List<Map<String, dynamic>> goals,
    List<Map<String, dynamic>> income,
    List<Map<String, dynamic>> incomeSources,
  ) async {
    final map = {
      'version': 1,
      'exportedAt': DateTime.now().toIso8601String(),
      'transactions': transactions,
      'accounts': accounts,
      'goals': goals,
      'income': income,
      'incomeSources': incomeSources,
    };
    return const JsonEncoder.withIndent('  ').convert(map);
  }

  /// Import from JSON backup; returns null on error.
  Future<bool> importAllDataFromJson(String jsonString) async {
    try {
      final map = jsonDecode(jsonString) as Map<String, dynamic>;
      final tList = (map['transactions'] as List<dynamic>?)?.cast<Map<String, dynamic>>() ?? [];
      final aList = (map['accounts'] as List<dynamic>?)?.cast<Map<String, dynamic>>() ?? [];
      final gList = (map['goals'] as List<dynamic>?)?.cast<Map<String, dynamic>>() ?? [];
      final iList = (map['income'] as List<dynamic>?)?.cast<Map<String, dynamic>>() ?? [];
      final sList = (map['incomeSources'] as List<dynamic>?)?.cast<Map<String, dynamic>>() ?? [];
      await saveTransactions(tList.map((e) => Transaction.fromJson(e)).toList());
      await saveAccounts(aList.map((e) => Account.fromJson(e)).toList());
      await saveGoals(gList.map((e) => Goal.fromJson(e)).toList());
      await saveIncome(iList.map((e) => IncomeEntry.fromJson(e)).toList());
      await saveIncomeSources(sList.map((e) => IncomeSource.fromJson(e)).toList());
      return true;
    } catch (_) {
      return false;
    }
  }
}
