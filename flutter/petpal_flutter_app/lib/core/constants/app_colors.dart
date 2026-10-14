import 'package:flutter/material.dart';

/// Pet Mate color palette.
///
/// Values were sampled from the Figma screens (DevOraa file), so they match
/// the design pixel for pixel. Never hard-code a `Color(...)` in a widget;
/// add it here first.
abstract final class AppColors {
  // ── Brand ───────────────────────────────────────────────────────────────
  /// Main teal: buttons, links, borders, active states.
  static const Color primary = Color(0xFF31A8C3);
  

  /// Light teal: search field on product details, disabled primary.
  static const Color primaryLight = Color(0xFFC1E5ED);

  /// Orange accent: "Sign up" outline, "Forget Password!" title.
  static const Color accent = Color(0xFFD16000);

  // ── Backgrounds ─────────────────────────────────────────────────────────
  /// Cream: splash, auth screens, shop, bottom bar.
  static const Color background = Color(0xFFF9FDE9);

  /// White: vet, adoption and account screens, cards.
  static const Color surface = Color(0xFFFFFFFF);

  /// Light grey: reminder cards, vaccination cards.
  static const Color surfaceVariant = Color(0xFFEBEBEB);

  /// Pale green: tags such as "FRIENDLY" and "Adoption fee".
  static const Color chip = Color(0xFFF1F8D9);

  // ── Text ────────────────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF000000);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textHint = Color(0xFFACA8A8);
  static const Color onPrimary = Color(0xFFFFFFFF);

  // ── Lines ───────────────────────────────────────────────────────────────
  static const Color divider = Color(0xFFD9D9D9);

  // ── Status ──────────────────────────────────────────────────────────────
  /// Rating star.
  static const Color rating = Color(0xFFFFDC64);

  /// "-50%" badge (approximate values sampled from the design).
  static const Color discountBackground = Color(0xFFFC9090);
  static const Color discountText = Color(0xFFFC0707);

  /// "Your account successfully verified" badge (approximate).
  static const Color verifiedBlue = Color(0xFF2E6BE6);

  /// NOT in the design yet. Placeholder for validation errors until the
  /// designer picks one.
  static const Color error = Color(0xFFD32F2F);
}
