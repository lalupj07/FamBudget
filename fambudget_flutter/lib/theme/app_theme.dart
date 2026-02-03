import 'package:flutter/material.dart';

/// Material Design 3 theme – full MD3 color, typography, and shape system.
class AppTheme {
  // Light – primary & containers
  static const Color primaryLight = Color(0xFF1976D2);
  static const Color onPrimaryLight = Color(0xFFFFFFFF);
  static const Color primaryContainerLight = Color(0xFFE3F2FD);
  static const Color onPrimaryContainerLight = Color(0xFF0D47A1);
  static const Color secondaryLight = Color(0xFF03DAC6);
  static const Color onSecondaryLight = Color(0xFF000000);
  static const Color secondaryContainerLight = Color(0xFFB2DFDB);
  static const Color onSecondaryContainerLight = Color(0xFF004D40);
  // Surface & background
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color onSurfaceLight = Color(0xFF1C1B1F);
  static const Color surfaceVariantLight = Color(0xFFF5F5F5);
  static const Color onSurfaceVariantLight = Color(0xFF49454F);
  static const Color outlineLight = Color(0xFF79747E);
  static const Color outlineVariantLight = Color(0xFFCAC4D0);
  static const Color errorLight = Color(0xFFBA1A1A);
  static const Color onErrorLight = Color(0xFFFFFFFF);
  static const Color errorContainerLight = Color(0xFFFFDAD6);
  static const Color onErrorContainerLight = Color(0xFF410002);

  // Dark
  static const Color primaryDark = Color(0xFF1565C0);
  static const Color primaryContainerDark = Color(0xFF0D47A1);
  static const Color onPrimaryContainerDark = Color(0xFFBBDEFB);
  static const Color secondaryDark = Color(0xFF4DD0E1);
  static const Color secondaryContainerDark = Color(0xFF006064);
  static const Color onSecondaryContainerDark = Color(0xFFB2EBF2);
  static const Color surfaceDark = Color(0xFF151A21);
  static const Color onSurfaceDark = Color(0xFFE8EAED);
  static const Color surfaceVariantDark = Color(0xFF1E252D);
  static const Color onSurfaceVariantDark = Color(0xFF9AA0A6);
  static const Color outlineDark = Color(0xFF5F6368);
  static const Color outlineVariantDark = Color(0xFF3C4043);
  static const Color errorDark = Color(0xFFF28B82);
  static const Color errorContainerDark = Color(0xFF93000A);
  static const Color onErrorContainerDark = Color(0xFFFFDAD6);

  // MD3 shape tokens (radius)
  static const double shapeSmall = 8;
  static const double shapeMedium = 12;
  static const double shapeLarge = 16;
  static const double shapeExtraLarge = 28;

  static ThemeData lightTheme() {
    final colorScheme = ColorScheme.light(
      primary: primaryLight,
      onPrimary: onPrimaryLight,
      primaryContainer: primaryContainerLight,
      onPrimaryContainer: onPrimaryContainerLight,
      secondary: secondaryLight,
      onSecondary: onSecondaryLight,
      secondaryContainer: secondaryContainerLight,
      onSecondaryContainer: onSecondaryContainerLight,
      surface: surfaceLight,
      onSurface: onSurfaceLight,
      surfaceContainerHighest: surfaceVariantLight,
      onSurfaceVariant: onSurfaceVariantLight,
      outline: outlineLight,
      outlineVariant: outlineVariantLight,
      error: errorLight,
      onError: onErrorLight,
      errorContainer: errorContainerLight,
      onErrorContainer: onErrorContainerLight,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: colorScheme,
      typography: Typography.material2021(colorScheme: colorScheme),
      appBarTheme: AppBarTheme(
        backgroundColor: primaryLight,
        foregroundColor: onPrimaryLight,
        elevation: 0,
        scrolledUnderElevation: 2,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: onPrimaryLight,
          fontSize: 22,
          fontWeight: FontWeight.w600,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 1,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeLarge)),
        color: surfaceLight,
        clipBehavior: Clip.antiAlias,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        filled: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: surfaceVariantLight,
        selectedIconTheme: IconThemeData(color: primaryLight, size: 24),
        unselectedIconTheme: IconThemeData(color: onSurfaceVariantLight, size: 24),
        labelType: NavigationRailLabelType.none,
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: primaryLight,
        foregroundColor: onPrimaryLight,
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeExtraLarge)),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        contentTextStyle: const TextStyle(fontSize: 14, color: Colors.white),
      ),
      dialogTheme: DialogThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeLarge)),
        titleTextStyle: TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: colorScheme.onSurface),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeSmall)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      dividerTheme: const DividerThemeData(space: 1, thickness: 1),
    );
  }

  static ThemeData darkTheme() {
    final colorScheme = ColorScheme.dark(
      primary: primaryDark,
      onPrimary: onPrimaryLight,
      primaryContainer: primaryContainerDark,
      onPrimaryContainer: onPrimaryContainerDark,
      secondary: secondaryDark,
      onSecondary: onSecondaryLight,
      secondaryContainer: secondaryContainerDark,
      onSecondaryContainer: onSecondaryContainerDark,
      surface: surfaceDark,
      onSurface: onSurfaceDark,
      surfaceContainerHighest: surfaceVariantDark,
      onSurfaceVariant: onSurfaceVariantDark,
      outline: outlineDark,
      outlineVariant: outlineVariantDark,
      error: errorDark,
      onError: onErrorLight,
      errorContainer: errorContainerDark,
      onErrorContainer: onErrorContainerDark,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: colorScheme,
      typography: Typography.material2021(colorScheme: colorScheme),
      appBarTheme: AppBarTheme(
        backgroundColor: primaryDark,
        foregroundColor: onPrimaryLight,
        elevation: 0,
        scrolledUnderElevation: 2,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: onPrimaryLight,
          fontSize: 22,
          fontWeight: FontWeight.w600,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 1,
        shadowColor: Colors.black45,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeLarge)),
        color: surfaceDark,
        clipBehavior: Clip.antiAlias,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        filled: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: surfaceVariantDark,
        selectedIconTheme: IconThemeData(color: primaryDark, size: 24),
        unselectedIconTheme: IconThemeData(color: onSurfaceVariantDark, size: 24),
        labelType: NavigationRailLabelType.none,
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: primaryDark,
        foregroundColor: onPrimaryLight,
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeExtraLarge)),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeMedium)),
        contentTextStyle: const TextStyle(fontSize: 14, color: Colors.white),
      ),
      dialogTheme: DialogThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeLarge)),
        titleTextStyle: TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: colorScheme.onSurface),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(shapeSmall)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      dividerTheme: const DividerThemeData(space: 1, thickness: 1),
    );
  }
}
