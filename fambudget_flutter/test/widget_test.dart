import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fambudget_flutter/main.dart';
import 'package:fambudget_flutter/services/storage_service.dart';
import 'package:fambudget_flutter/services/app_state.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('App shows FamBudget title', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});
    final storage = await StorageService.create();
    final appState = AppState(storage);
    await appState.loadAll();

    await tester.pumpWidget(
      ChangeNotifierProvider<AppState>.value(
        value: appState,
        child: const FamBudgetApp(),
      ),
    );
    expect(find.text('FamBudget'), findsOneWidget);
  });
}
