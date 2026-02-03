// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'FamBudget';

  @override
  String get settings => 'الإعدادات';

  @override
  String get profile => 'الملف الشخصي';

  @override
  String get editProfile => 'تعديل الملف الشخصي';

  @override
  String get addProfilePhoto => 'إضافة صورة الملف الشخصي';

  @override
  String get changeProfilePhoto => 'تغيير الصورة';

  @override
  String get removeProfilePhoto => 'إزالة الصورة';

  @override
  String get name => 'الاسم';

  @override
  String get email => 'البريد الإلكتروني';

  @override
  String get householdName => 'اسم الأسرة';

  @override
  String get save => 'حفظ';

  @override
  String get cancel => 'إلغاء';

  @override
  String get appearance => 'المظهر';

  @override
  String get darkMode => 'الوضع الداكن';

  @override
  String get language => 'اللغة';

  @override
  String get quickTour => 'جولة سريعة';

  @override
  String get showTour => 'عرض الجولة';

  @override
  String get showIntroTourAgain => 'إظهار جولة التعريف مرة أخرى';

  @override
  String get categoryBudgets => 'ميزانيات الفئات';

  @override
  String get categoryBudgetsHint =>
      'الحد الشهري لكل فئة (لتنبيهات لوحة المعلومات).';

  @override
  String get editCategoryBudgets => 'تعديل ميزانيات الفئات';

  @override
  String get backup => 'النسخ الاحتياطي';

  @override
  String get remindBackupMonthly => 'تذكيرني بالنسخ الاحتياطي شهرياً';

  @override
  String get backupNowToFolder => 'نسخ احتياطي الآن إلى مجلد';

  @override
  String get backupNowToFolderHint =>
      'حفظ ملف JSON للنسخ الاحتياطي في المجلد الذي تختاره';

  @override
  String get backupNow => 'نسخ احتياطي الآن';

  @override
  String get security => 'الأمان';

  @override
  String get disablePasscode => 'تعطيل رمز التطبيق';

  @override
  String get disablePasscodeHint =>
      'إزالة قفل الرمز؛ لن يُطلب عند الفتح التالي.';

  @override
  String get disable => 'تعطيل';

  @override
  String get currency => 'العملة';

  @override
  String get displayCurrency => 'عملة العرض';

  @override
  String get data => 'البيانات';

  @override
  String get exportTransactionsCsv => 'تصدير المعاملات إلى CSV';

  @override
  String get exportTransactionsCsvSubtitle =>
      'نسخ جميع المعاملات إلى الحافظة كـ CSV';

  @override
  String get exportCsv => 'تصدير CSV';

  @override
  String get exportFullBackup => 'تصدير النسخ الاحتياطي الكامل (JSON)';

  @override
  String get exportFullBackupSubtitle =>
      'نسخ جميع البيانات إلى الحافظة كنسخ احتياطي JSON';

  @override
  String get exportJson => 'تصدير JSON';

  @override
  String get importFromBackup => 'استيراد من النسخ الاحتياطي (JSON)';

  @override
  String get importFromBackupSubtitle => 'استعادة من نسخ احتياطي JSON منسوخ';

  @override
  String get importJson => 'استيراد JSON';

  @override
  String get loadSampleData => 'تحميل بيانات نموذجية';

  @override
  String get loadSampleDataHint =>
      'ملء التطبيق ببيانات وهمية لاختبار لوحة المعلومات والمعاملات والأهداف والدخل والتقارير';

  @override
  String get loadSample => 'تحميل النموذج';

  @override
  String get clearAllData => 'مسح جميع البيانات';

  @override
  String get clearAllDataHint =>
      'إزالة جميع المعاملات والحسابات والأهداف والدخل. لا يمكن التراجع.';

  @override
  String get clear => 'مسح';

  @override
  String get about => 'حول';

  @override
  String get fambudgetDesktop => 'FamBudget سطح المكتب';

  @override
  String get version => 'الإصدار';

  @override
  String get tagline => 'ميزانية الأسرة المتقدمة ببساطة.';

  @override
  String get license => 'الترخيص';

  @override
  String get viewLicense => 'عرض الترخيص';

  @override
  String get close => 'إغلاق';

  @override
  String get restore => 'استعادة';

  @override
  String get disablePasscodeConfirm => 'تعطيل الرمز؟';

  @override
  String get disablePasscodeMessage => 'لن يطلب التطبيق الرمز عند الفتح.';

  @override
  String get loadSampleDataConfirm => 'تحميل بيانات نموذجية؟';

  @override
  String get loadSampleDataConfirmMessage =>
      'سيستبدل هذا بياناتك الحالية بحسابات ومعاملات وأهداف ودخل نموذجية. استخدمه لتجربة جميع الميزات.';

  @override
  String get clearAllDataConfirm => 'مسح جميع البيانات؟';

  @override
  String get clearAllDataConfirmMessage =>
      'سيتم إزالة جميع بياناتك. لا يمكن التراجع عن ذلك.';

  @override
  String get categoryBudgetsLimitHint => 'الحد الشهري لكل فئة (0 = بلا حد).';

  @override
  String get dashboard => 'لوحة المعلومات';

  @override
  String get transactions => 'المعاملات';

  @override
  String get accounts => 'الحسابات';

  @override
  String get goals => 'الأهداف';

  @override
  String get income => 'الدخل';

  @override
  String get reports => 'التقارير';

  @override
  String get search => 'بحث';

  @override
  String get quickAdd => 'إضافة سريعة';

  @override
  String get addTransactionFull => 'إضافة معاملة (نموذج كامل)';

  @override
  String get english => 'الإنجليزية';

  @override
  String get spanish => 'الإسبانية';

  @override
  String get french => 'الفرنسية';

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
