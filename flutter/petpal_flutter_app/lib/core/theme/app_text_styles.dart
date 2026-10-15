import 'package:flutter/material.dart';

/// Typography. The design uses Inter (bundled in `assets/fonts`).
///
/// Styles carry no color on purpose: the color comes from the theme
/// (`AppTheme`), so use `.copyWith(color: ...)` only for exceptions such as
/// secondary text.
abstract final class AppTextStyles {
  static const String fontFamily = 'Inter';

  /// Screen titles: "Veterinarians Near You", "Settings".
  static const TextStyle h1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.25,
  );

  /// Section titles: "Delivery Address", "Order Summary".
  static const TextStyle h2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.3,
  );

  /// Card titles: "Dr. Muhammed", "Rabies".
  static const TextStyle title = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  static const TextStyle body = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.45,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );

  /// "4 years experience", helper texts.
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: 10,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );

  /// Text inside primary / outlined buttons.
  static const TextStyle button = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.25,
  );

  /// Small tappable text: "Forgot password?", "change".
  static const TextStyle link = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w600,
    height: 1.3,
  );

  /// Serif display style used by "Choose your pet" and its tiles.
  /// Placeholder: the Figma font for it is not identified yet, so it falls
  /// back to the first serif found on the device. Replace `fontFamily` once
  /// the real font file is added.
  static const TextStyle display = TextStyle(
    fontFamily: 'Georgia',
    fontFamilyFallback: ['Cambria', 'Times New Roman', 'serif'],
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 1.2,
  );

  /// Maps the styles above onto Material's [TextTheme] so default widgets
  /// (`Text`, `ListTile`, `AppBar`...) pick them up.
  static const TextTheme textTheme = TextTheme(
    headlineLarge: h1,
    headlineMedium: h2,
    titleLarge: h2,
    titleMedium: title,
    titleSmall: title,
    bodyLarge: body,
    bodyMedium: body,
    bodySmall: bodySmall,
    labelLarge: button,
    labelMedium: link,
    labelSmall: caption,
  );
}
