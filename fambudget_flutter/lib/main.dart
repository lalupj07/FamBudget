// FamBudget - Flutter Windows Desktop
// Copyright (c) 2025 GenXis Innovation. Licensed under the Apache License, Version 2.0.
// See the LICENSE file in the project root or https://www.apache.org/licenses/LICENSE-2.0

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/storage_service.dart';
import 'services/app_state.dart';
import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';
import 'package:fambudget_flutter/l10n/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final storage = await StorageService.create();
  final appState = AppState(storage);
  await appState.loadAll();

  runApp(
    ChangeNotifierProvider<AppState>.value(
      value: appState,
      child: const FamBudgetApp(),
    ),
  );
}

class FamBudgetApp extends StatelessWidget {
  const FamBudgetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, _) {
        return MaterialApp(
          title: 'FamBudget',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme(),
          darkTheme: AppTheme.darkTheme(),
          themeMode: state.isDarkTheme ? ThemeMode.dark : ThemeMode.light,
          locale: Locale(state.locale),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: const SplashScreen(),
        );
      },
    );
  }
}
