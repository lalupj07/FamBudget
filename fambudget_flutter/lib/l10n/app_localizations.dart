import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_de.dart';
import 'app_localizations_en.dart';
import 'app_localizations_es.dart';
import 'app_localizations_fr.dart';
import 'app_localizations_hi.dart';
import 'app_localizations_ja.dart';
import 'app_localizations_ko.dart';
import 'app_localizations_ml.dart';
import 'app_localizations_pt.dart';
import 'app_localizations_ta.dart';
import 'app_localizations_te.dart';
import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('de'),
    Locale('en'),
    Locale('es'),
    Locale('fr'),
    Locale('hi'),
    Locale('ja'),
    Locale('ko'),
    Locale('ml'),
    Locale('pt'),
    Locale('ta'),
    Locale('te'),
    Locale('zh'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'FamBudget'**
  String get appTitle;

  /// No description provided for @settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// No description provided for @profile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profile;

  /// No description provided for @editProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit profile'**
  String get editProfile;

  /// No description provided for @addProfilePhoto.
  ///
  /// In en, this message translates to:
  /// **'Add profile photo'**
  String get addProfilePhoto;

  /// No description provided for @changeProfilePhoto.
  ///
  /// In en, this message translates to:
  /// **'Change photo'**
  String get changeProfilePhoto;

  /// No description provided for @removeProfilePhoto.
  ///
  /// In en, this message translates to:
  /// **'Remove photo'**
  String get removeProfilePhoto;

  /// No description provided for @name.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get name;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @householdName.
  ///
  /// In en, this message translates to:
  /// **'Household name'**
  String get householdName;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @appearance.
  ///
  /// In en, this message translates to:
  /// **'Appearance'**
  String get appearance;

  /// No description provided for @darkMode.
  ///
  /// In en, this message translates to:
  /// **'Dark mode'**
  String get darkMode;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @quickTour.
  ///
  /// In en, this message translates to:
  /// **'Quick tour'**
  String get quickTour;

  /// No description provided for @showTour.
  ///
  /// In en, this message translates to:
  /// **'Show tour'**
  String get showTour;

  /// No description provided for @showIntroTourAgain.
  ///
  /// In en, this message translates to:
  /// **'Show the intro tour again'**
  String get showIntroTourAgain;

  /// No description provided for @categoryBudgets.
  ///
  /// In en, this message translates to:
  /// **'Category budgets'**
  String get categoryBudgets;

  /// No description provided for @categoryBudgetsHint.
  ///
  /// In en, this message translates to:
  /// **'Monthly limit per category (used for dashboard alerts).'**
  String get categoryBudgetsHint;

  /// No description provided for @editCategoryBudgets.
  ///
  /// In en, this message translates to:
  /// **'Edit category budgets'**
  String get editCategoryBudgets;

  /// No description provided for @backup.
  ///
  /// In en, this message translates to:
  /// **'Backup'**
  String get backup;

  /// No description provided for @remindBackupMonthly.
  ///
  /// In en, this message translates to:
  /// **'Remind me to backup monthly'**
  String get remindBackupMonthly;

  /// No description provided for @backupNowToFolder.
  ///
  /// In en, this message translates to:
  /// **'Backup now to folder'**
  String get backupNowToFolder;

  /// No description provided for @backupNowToFolderHint.
  ///
  /// In en, this message translates to:
  /// **'Save a JSON backup file to a folder you choose'**
  String get backupNowToFolderHint;

  /// No description provided for @backupNow.
  ///
  /// In en, this message translates to:
  /// **'Backup now'**
  String get backupNow;

  /// No description provided for @security.
  ///
  /// In en, this message translates to:
  /// **'Security'**
  String get security;

  /// No description provided for @disablePasscode.
  ///
  /// In en, this message translates to:
  /// **'Disable app passcode'**
  String get disablePasscode;

  /// No description provided for @disablePasscodeHint.
  ///
  /// In en, this message translates to:
  /// **'Remove passcode lock; you will not be asked for it on next launch'**
  String get disablePasscodeHint;

  /// No description provided for @disable.
  ///
  /// In en, this message translates to:
  /// **'Disable'**
  String get disable;

  /// No description provided for @currency.
  ///
  /// In en, this message translates to:
  /// **'Currency'**
  String get currency;

  /// No description provided for @displayCurrency.
  ///
  /// In en, this message translates to:
  /// **'Display currency'**
  String get displayCurrency;

  /// No description provided for @data.
  ///
  /// In en, this message translates to:
  /// **'Data'**
  String get data;

  /// No description provided for @exportTransactionsCsv.
  ///
  /// In en, this message translates to:
  /// **'Export transactions to CSV'**
  String get exportTransactionsCsv;

  /// No description provided for @exportTransactionsCsvSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Copy all transactions to clipboard as CSV'**
  String get exportTransactionsCsvSubtitle;

  /// No description provided for @exportCsv.
  ///
  /// In en, this message translates to:
  /// **'Export CSV'**
  String get exportCsv;

  /// No description provided for @exportFullBackup.
  ///
  /// In en, this message translates to:
  /// **'Export full backup (JSON)'**
  String get exportFullBackup;

  /// No description provided for @exportFullBackupSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Copy all data to clipboard as JSON backup'**
  String get exportFullBackupSubtitle;

  /// No description provided for @exportJson.
  ///
  /// In en, this message translates to:
  /// **'Export JSON'**
  String get exportJson;

  /// No description provided for @importFromBackup.
  ///
  /// In en, this message translates to:
  /// **'Import from backup (JSON)'**
  String get importFromBackup;

  /// No description provided for @importFromBackupSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Restore from a pasted JSON backup'**
  String get importFromBackupSubtitle;

  /// No description provided for @importJson.
  ///
  /// In en, this message translates to:
  /// **'Import JSON'**
  String get importJson;

  /// No description provided for @loadSampleData.
  ///
  /// In en, this message translates to:
  /// **'Load sample data'**
  String get loadSampleData;

  /// No description provided for @loadSampleDataHint.
  ///
  /// In en, this message translates to:
  /// **'Fill app with dummy data to test dashboard, transactions, goals, income, reports'**
  String get loadSampleDataHint;

  /// No description provided for @loadSample.
  ///
  /// In en, this message translates to:
  /// **'Load sample'**
  String get loadSample;

  /// No description provided for @clearAllData.
  ///
  /// In en, this message translates to:
  /// **'Clear all data'**
  String get clearAllData;

  /// No description provided for @clearAllDataHint.
  ///
  /// In en, this message translates to:
  /// **'Remove all transactions, accounts, goals, and income. Cannot be undone.'**
  String get clearAllDataHint;

  /// No description provided for @clear.
  ///
  /// In en, this message translates to:
  /// **'Clear'**
  String get clear;

  /// No description provided for @about.
  ///
  /// In en, this message translates to:
  /// **'About'**
  String get about;

  /// No description provided for @fambudgetDesktop.
  ///
  /// In en, this message translates to:
  /// **'FamBudget Desktop'**
  String get fambudgetDesktop;

  /// No description provided for @version.
  ///
  /// In en, this message translates to:
  /// **'Version'**
  String get version;

  /// No description provided for @tagline.
  ///
  /// In en, this message translates to:
  /// **'Advanced Family Budgeting Made Simple.'**
  String get tagline;

  /// No description provided for @license.
  ///
  /// In en, this message translates to:
  /// **'License'**
  String get license;

  /// No description provided for @viewLicense.
  ///
  /// In en, this message translates to:
  /// **'View license'**
  String get viewLicense;

  /// No description provided for @close.
  ///
  /// In en, this message translates to:
  /// **'Close'**
  String get close;

  /// No description provided for @restore.
  ///
  /// In en, this message translates to:
  /// **'Restore'**
  String get restore;

  /// No description provided for @disablePasscodeConfirm.
  ///
  /// In en, this message translates to:
  /// **'Disable passcode?'**
  String get disablePasscodeConfirm;

  /// No description provided for @disablePasscodeMessage.
  ///
  /// In en, this message translates to:
  /// **'The app will no longer ask for a passcode when opening.'**
  String get disablePasscodeMessage;

  /// No description provided for @loadSampleDataConfirm.
  ///
  /// In en, this message translates to:
  /// **'Load sample data?'**
  String get loadSampleDataConfirm;

  /// No description provided for @loadSampleDataConfirmMessage.
  ///
  /// In en, this message translates to:
  /// **'This will replace your current data with sample accounts, transactions, goals, and income. Use this to try all features.'**
  String get loadSampleDataConfirmMessage;

  /// No description provided for @clearAllDataConfirm.
  ///
  /// In en, this message translates to:
  /// **'Clear all data?'**
  String get clearAllDataConfirm;

  /// No description provided for @clearAllDataConfirmMessage.
  ///
  /// In en, this message translates to:
  /// **'This will remove all your data. This cannot be undone.'**
  String get clearAllDataConfirmMessage;

  /// No description provided for @categoryBudgetsLimitHint.
  ///
  /// In en, this message translates to:
  /// **'Monthly limit per category (0 = no limit).'**
  String get categoryBudgetsLimitHint;

  /// No description provided for @dashboard.
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get dashboard;

  /// No description provided for @transactions.
  ///
  /// In en, this message translates to:
  /// **'Transactions'**
  String get transactions;

  /// No description provided for @accounts.
  ///
  /// In en, this message translates to:
  /// **'Accounts'**
  String get accounts;

  /// No description provided for @goals.
  ///
  /// In en, this message translates to:
  /// **'Goals'**
  String get goals;

  /// No description provided for @income.
  ///
  /// In en, this message translates to:
  /// **'Income'**
  String get income;

  /// No description provided for @reports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get reports;

  /// No description provided for @search.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get search;

  /// No description provided for @quickAdd.
  ///
  /// In en, this message translates to:
  /// **'Quick add'**
  String get quickAdd;

  /// No description provided for @addTransactionFull.
  ///
  /// In en, this message translates to:
  /// **'Add transaction (full form)'**
  String get addTransactionFull;

  /// No description provided for @english.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// No description provided for @spanish.
  ///
  /// In en, this message translates to:
  /// **'Spanish'**
  String get spanish;

  /// No description provided for @french.
  ///
  /// In en, this message translates to:
  /// **'French'**
  String get french;

  /// No description provided for @languageEnglish.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get languageEnglish;

  /// No description provided for @languageSpanish.
  ///
  /// In en, this message translates to:
  /// **'Español'**
  String get languageSpanish;

  /// No description provided for @languageFrench.
  ///
  /// In en, this message translates to:
  /// **'Français'**
  String get languageFrench;

  /// No description provided for @languageHindi.
  ///
  /// In en, this message translates to:
  /// **'हिन्दी'**
  String get languageHindi;

  /// No description provided for @languageMalayalam.
  ///
  /// In en, this message translates to:
  /// **'മലയാളം'**
  String get languageMalayalam;

  /// No description provided for @languageArabic.
  ///
  /// In en, this message translates to:
  /// **'العربية'**
  String get languageArabic;

  /// No description provided for @languageChinese.
  ///
  /// In en, this message translates to:
  /// **'中文'**
  String get languageChinese;

  /// No description provided for @languageGerman.
  ///
  /// In en, this message translates to:
  /// **'Deutsch'**
  String get languageGerman;

  /// No description provided for @languagePortuguese.
  ///
  /// In en, this message translates to:
  /// **'Português'**
  String get languagePortuguese;

  /// No description provided for @languageTamil.
  ///
  /// In en, this message translates to:
  /// **'தமிழ்'**
  String get languageTamil;

  /// No description provided for @languageJapanese.
  ///
  /// In en, this message translates to:
  /// **'日本語'**
  String get languageJapanese;

  /// No description provided for @languageTelugu.
  ///
  /// In en, this message translates to:
  /// **'తెలుగు'**
  String get languageTelugu;

  /// No description provided for @languageKorean.
  ///
  /// In en, this message translates to:
  /// **'한국어'**
  String get languageKorean;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>[
    'ar',
    'de',
    'en',
    'es',
    'fr',
    'hi',
    'ja',
    'ko',
    'ml',
    'pt',
    'ta',
    'te',
    'zh',
  ].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'de':
      return AppLocalizationsDe();
    case 'en':
      return AppLocalizationsEn();
    case 'es':
      return AppLocalizationsEs();
    case 'fr':
      return AppLocalizationsFr();
    case 'hi':
      return AppLocalizationsHi();
    case 'ja':
      return AppLocalizationsJa();
    case 'ko':
      return AppLocalizationsKo();
    case 'ml':
      return AppLocalizationsMl();
    case 'pt':
      return AppLocalizationsPt();
    case 'ta':
      return AppLocalizationsTa();
    case 'te':
      return AppLocalizationsTe();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
