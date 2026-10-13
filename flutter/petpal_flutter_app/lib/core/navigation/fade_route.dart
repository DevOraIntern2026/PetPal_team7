import 'package:flutter/material.dart';

/// Page route with a cross-fade, used for splash -> onboarding -> auth.
///
/// ```dart
/// Navigator.of(context).pushReplacement(fadeRoute(const OnboardingView()));
/// ```
Route<T> fadeRoute<T>(Widget page) {
  return PageRouteBuilder<T>(
    transitionDuration: const Duration(milliseconds: 500),
    reverseTransitionDuration: const Duration(milliseconds: 300),
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  );
}
