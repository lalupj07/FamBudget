// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Korean (`ko`).
class AppLocalizationsKo extends AppLocalizations {
  AppLocalizationsKo([String locale = 'ko']) : super(locale);

  @override
  String get appTitle => 'FamBudget';

  @override
  String get settings => '설정';

  @override
  String get profile => '프로필';

  @override
  String get editProfile => '프로필 편집';

  @override
  String get addProfilePhoto => '프로필 사진 추가';

  @override
  String get changeProfilePhoto => '사진 변경';

  @override
  String get removeProfilePhoto => '사진 제거';

  @override
  String get name => '이름';

  @override
  String get email => '이메일';

  @override
  String get householdName => '가구명';

  @override
  String get save => '저장';

  @override
  String get cancel => '취소';

  @override
  String get appearance => '모양';

  @override
  String get darkMode => '다크 모드';

  @override
  String get language => '언어';

  @override
  String get quickTour => '빠른 둘러보기';

  @override
  String get showTour => '둘러보기 표시';

  @override
  String get showIntroTourAgain => '소개 둘러보기 다시 표시';

  @override
  String get categoryBudgets => '카테고리 예산';

  @override
  String get categoryBudgetsHint => '카테고리별 월 한도(대시보드 알림용).';

  @override
  String get editCategoryBudgets => '카테고리 예산 편집';

  @override
  String get backup => '백업';

  @override
  String get remindBackupMonthly => '매월 백업 알림';

  @override
  String get backupNowToFolder => '지금 폴더에 백업';

  @override
  String get backupNowToFolderHint => '선택한 폴더에 JSON 백업 파일 저장';

  @override
  String get backupNow => '지금 백업';

  @override
  String get security => '보안';

  @override
  String get disablePasscode => '앱 비밀번호 비활성화';

  @override
  String get disablePasscodeHint => '비밀번호 잠금 제거; 다음에 열 때 묻지 않습니다.';

  @override
  String get disable => '비활성화';

  @override
  String get currency => '통화';

  @override
  String get displayCurrency => '표시 통화';

  @override
  String get data => '데이터';

  @override
  String get exportTransactionsCsv => '거래를 CSV로 내보내기';

  @override
  String get exportTransactionsCsvSubtitle => '모든 거래를 클립보드에 CSV로 복사';

  @override
  String get exportCsv => 'CSV 내보내기';

  @override
  String get exportFullBackup => '전체 백업 내보내기 (JSON)';

  @override
  String get exportFullBackupSubtitle => '모든 데이터를 클립보드에 JSON 백업으로 복사';

  @override
  String get exportJson => 'JSON 내보내기';

  @override
  String get importFromBackup => '백업에서 가져오기 (JSON)';

  @override
  String get importFromBackupSubtitle => '붙여넣은 JSON 백업에서 복원';

  @override
  String get importJson => 'JSON 가져오기';

  @override
  String get loadSampleData => '샘플 데이터 로드';

  @override
  String get loadSampleDataHint => '대시보드, 거래, 목표, 수입, 보고서 테스트용 더미 데이터로 채우기';

  @override
  String get loadSample => '샘플 로드';

  @override
  String get clearAllData => '모든 데이터 지우기';

  @override
  String get clearAllDataHint => '모든 거래, 계정, 목표, 수입 제거. 실행 취소할 수 없습니다.';

  @override
  String get clear => '지우기';

  @override
  String get about => '정보';

  @override
  String get fambudgetDesktop => 'FamBudget 데스크톱';

  @override
  String get version => '버전';

  @override
  String get tagline => '고급 가족 예산을 간단하게.';

  @override
  String get license => '라이선스';

  @override
  String get viewLicense => '라이선스 보기';

  @override
  String get close => '닫기';

  @override
  String get restore => '복원';

  @override
  String get disablePasscodeConfirm => '비밀번호를 비활성화하시겠습니까?';

  @override
  String get disablePasscodeMessage => '앱을 열 때 더 이상 비밀번호를 묻지 않습니다.';

  @override
  String get loadSampleDataConfirm => '샘플 데이터를 로드하시겠습니까?';

  @override
  String get loadSampleDataConfirmMessage =>
      '현재 데이터가 샘플 계정, 거래, 목표, 수입으로 대체됩니다. 모든 기능을 시도하려면 사용하세요.';

  @override
  String get clearAllDataConfirm => '모든 데이터를 지우시겠습니까?';

  @override
  String get clearAllDataConfirmMessage => '모든 데이터가 제거됩니다. 실행 취소할 수 없습니다.';

  @override
  String get categoryBudgetsLimitHint => '카테고리별 월 한도 (0 = 제한 없음).';

  @override
  String get dashboard => '대시보드';

  @override
  String get transactions => '거래';

  @override
  String get accounts => '계정';

  @override
  String get goals => '목표';

  @override
  String get income => '수입';

  @override
  String get reports => '보고서';

  @override
  String get search => '검색';

  @override
  String get quickAdd => '빠른 추가';

  @override
  String get addTransactionFull => '거래 추가 (전체 양식)';

  @override
  String get english => '영어';

  @override
  String get spanish => '스페인어';

  @override
  String get french => '프랑스어';

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
