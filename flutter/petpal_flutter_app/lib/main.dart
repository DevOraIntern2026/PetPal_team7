import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/theme/app_theme.dart';
import 'package:petpal_flutter_app/feature/root/root_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pet Mate',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      // While developing the app opens straight on the tabs. For the real
      // flow use `const SplashView()` (import
      // 'package:petpal_flutter_app/feature/splash/views/splash_view.dart').
      home: const RootView(),
    );
  }
}
