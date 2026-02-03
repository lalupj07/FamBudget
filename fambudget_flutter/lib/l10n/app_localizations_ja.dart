// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Japanese (`ja`).
class AppLocalizationsJa extends AppLocalizations {
  AppLocalizationsJa([String locale = 'ja']) : super(locale);

  @override
  String get appTitle => 'FamBudget';

  @override
  String get settings => '設定';

  @override
  String get profile => 'プロフィール';

  @override
  String get editProfile => 'プロフィールを編集';

  @override
  String get addProfilePhoto => 'プロフィール写真を追加';

  @override
  String get changeProfilePhoto => '写真を変更';

  @override
  String get removeProfilePhoto => '写真を削除';

  @override
  String get name => '名前';

  @override
  String get email => 'メール';

  @override
  String get householdName => '世帯名';

  @override
  String get save => '保存';

  @override
  String get cancel => 'キャンセル';

  @override
  String get appearance => '外観';

  @override
  String get darkMode => 'ダークモード';

  @override
  String get language => '言語';

  @override
  String get quickTour => 'クイックツアー';

  @override
  String get showTour => 'ツアーを表示';

  @override
  String get showIntroTourAgain => '紹介ツアーを再度表示';

  @override
  String get categoryBudgets => 'カテゴリ予算';

  @override
  String get categoryBudgetsHint => 'カテゴリごとの月間上限（ダッシュボードの警告用）。';

  @override
  String get editCategoryBudgets => 'カテゴリ予算を編集';

  @override
  String get backup => 'バックアップ';

  @override
  String get remindBackupMonthly => '月に1回バックアップをリマインド';

  @override
  String get backupNowToFolder => '今すぐフォルダにバックアップ';

  @override
  String get backupNowToFolderHint => '選択したフォルダにJSONバックアップファイルを保存';

  @override
  String get backupNow => '今すぐバックアップ';

  @override
  String get security => 'セキュリティ';

  @override
  String get disablePasscode => 'アプリのパスコードを無効にする';

  @override
  String get disablePasscodeHint => 'パスコードロックを解除；次回起動時には求められません。';

  @override
  String get disable => '無効にする';

  @override
  String get currency => '通貨';

  @override
  String get displayCurrency => '表示通貨';

  @override
  String get data => 'データ';

  @override
  String get exportTransactionsCsv => '取引をCSVでエクスポート';

  @override
  String get exportTransactionsCsvSubtitle => 'すべての取引をクリップボードにCSVとしてコピー';

  @override
  String get exportCsv => 'CSVエクスポート';

  @override
  String get exportFullBackup => '完全バックアップをエクスポート (JSON)';

  @override
  String get exportFullBackupSubtitle => 'すべてのデータをクリップボードにJSONバックアップとしてコピー';

  @override
  String get exportJson => 'JSONエクスポート';

  @override
  String get importFromBackup => 'バックアップからインポート (JSON)';

  @override
  String get importFromBackupSubtitle => '貼り付けたJSONバックアップから復元';

  @override
  String get importJson => 'JSONインポート';

  @override
  String get loadSampleData => 'サンプルデータを読み込む';

  @override
  String get loadSampleDataHint => 'ダッシュボード、取引、目標、収入、レポートをテストするダミーデータで埋める';

  @override
  String get loadSample => 'サンプルを読み込む';

  @override
  String get clearAllData => 'すべてのデータをクリア';

  @override
  String get clearAllDataHint => 'すべての取引、口座、目標、収入を削除。元に戻せません。';

  @override
  String get clear => 'クリア';

  @override
  String get about => 'について';

  @override
  String get fambudgetDesktop => 'FamBudget デスクトップ';

  @override
  String get version => 'バージョン';

  @override
  String get tagline => '高度な家族予算をシンプルに。';

  @override
  String get license => 'ライセンス';

  @override
  String get viewLicense => 'ライセンスを表示';

  @override
  String get close => '閉じる';

  @override
  String get restore => '復元';

  @override
  String get disablePasscodeConfirm => 'パスコードを無効にしますか？';

  @override
  String get disablePasscodeMessage => 'アプリを開くときにパスコードは求められなくなります。';

  @override
  String get loadSampleDataConfirm => 'サンプルデータを読み込みますか？';

  @override
  String get loadSampleDataConfirmMessage =>
      '現在のデータがサンプルの口座、取引、目標、収入に置き換わります。すべての機能を試すために使用してください。';

  @override
  String get clearAllDataConfirm => 'すべてのデータをクリアしますか？';

  @override
  String get clearAllDataConfirmMessage => 'すべてのデータが削除されます。元に戻せません。';

  @override
  String get categoryBudgetsLimitHint => 'カテゴリごとの月間上限（0 = 制限なし）。';

  @override
  String get dashboard => 'ダッシュボード';

  @override
  String get transactions => '取引';

  @override
  String get accounts => '口座';

  @override
  String get goals => '目標';

  @override
  String get income => '収入';

  @override
  String get reports => 'レポート';

  @override
  String get search => '検索';

  @override
  String get quickAdd => 'クイック追加';

  @override
  String get addTransactionFull => '取引を追加（完全フォーム）';

  @override
  String get english => '英語';

  @override
  String get spanish => 'スペイン語';

  @override
  String get french => 'フランス語';

  @override
  String get languageEnglish => 'English';

  @override
  String get languageSpanish => 'Español';

  @override
  String get languageFrench => 'Français';

  @override
  String get languageHindi => 'हिन्दी';

  @override
  String get languageMalayalam => 'മലയാളം';

  @override
  String get languageArabic => 'العربية';

  @override
  String get languageChinese => '中文';

  @override
  String get languageGerman => 'Deutsch';

  @override
  String get languagePortuguese => 'Português';

  @override
  String get languageTamil => 'தமிழ்';

  @override
  String get languageJapanese => '日本語';

  @override
  String get languageTelugu => 'తెలుగు';

  @override
  String get languageKorean => '한국어';
}
