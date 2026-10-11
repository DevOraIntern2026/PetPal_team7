/// Spacing scale. Use with `context.w(...)` when the value should scale with
/// the screen, or as-is for small fixed gaps.
abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
}

/// Corner radii seen in the design.
abstract final class AppRadius {
  /// Text fields on auth screens.
  static const double sm = 8;

  /// Buttons, cards.
  static const double md = 12;

  /// Large containers (availability box, checkout sections).
  static const double lg = 20;

  /// Pills: search bars, time slots, filter chips.
  static const double pill = 100;
}

abstract final class AppDimens {
  static const double buttonHeight = 48;
}
