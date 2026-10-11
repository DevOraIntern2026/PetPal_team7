import 'package:flutter/widgets.dart';

/// Form validators. Each returns an error message, or `null` when valid.
abstract final class Validators {
  static final RegExp _emailRegex = RegExp(r'^[\w.+-]+@[\w-]+(\.[\w-]+)+$');

  static String? email(String? value) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) return 'Email is required';
    if (!_emailRegex.hasMatch(text)) return 'Enter a valid email';
    return null;
  }

  static String? password(String? value) {
    final text = value ?? '';
    if (text.isEmpty) return 'Password is required';
    if (text.length < 6) return 'At least 6 characters';
    return null;
  }

  /// Usage: `validator: Validators.confirmPassword(_passwordController)`.
  static String? Function(String?) confirmPassword(
    TextEditingController original,
  ) {
    return (value) {
      if ((value ?? '').isEmpty) return 'Please confirm your password';
      if (value != original.text) return 'Passwords do not match';
      return null;
    };
  }
}
