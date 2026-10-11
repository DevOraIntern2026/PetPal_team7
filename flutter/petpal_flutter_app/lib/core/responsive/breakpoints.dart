enum ScreenType { mobile, tablet, desktop }

abstract final class Breakpoints {
  /// Width below this is a phone.
  static const double mobile = 600;

  /// Width below this (and >= [mobile]) is a tablet; above is desktop/web.
  static const double tablet = 1024;

  /// Size of the Figma frames (iPhone 15). All design numbers are relative
  /// to this.
  static const double designWidth = 393;
  static const double designHeight = 852;

  /// Scaling is clamped so tablets don't get absurdly large UI and tiny
  /// phones don't get unreadable UI.
  static const double minScale = 0.85;
  static const double maxScale = 1.3;

  /// Content stops growing past this width and is centered instead.
  static const double maxContentWidth = 640;
}
