import 'package:flutter/widgets.dart';

import 'breakpoints.dart';

/// Responsive helpers on [BuildContext].
///
/// They read [MediaQuery], so any widget using them rebuilds automatically
/// on rotation / window resize (no global state to initialise).
///
/// ```dart
/// SizedBox(height: context.h(24));
/// Text('Hi', style: TextStyle(fontSize: context.sp(14)));
/// final columns = context.responsive(mobile: 2, tablet: 3, desktop: 4);
/// ```
extension ResponsiveContext on BuildContext {
  Size get screenSize => MediaQuery.sizeOf(this);
  double get screenWidth => screenSize.width;
  double get screenHeight => screenSize.height;
  bool get isLandscape => MediaQuery.orientationOf(this) == Orientation.landscape;

  ScreenType get screenType {
    final width = screenWidth;
    if (width < Breakpoints.mobile) return ScreenType.mobile;
    if (width < Breakpoints.tablet) return ScreenType.tablet;
    return ScreenType.desktop;
  }

  bool get isMobile => screenType == ScreenType.mobile;
  bool get isTablet => screenType == ScreenType.tablet;
  bool get isDesktop => screenType == ScreenType.desktop;

  /// Based on the shortest side so rotating a phone doesn't blow up the UI.
  double get scaleFactor {
    final factor = screenSize.shortestSide / Breakpoints.designWidth;
    return factor.clamp(Breakpoints.minScale, Breakpoints.maxScale).toDouble();
  }

  double get _heightFactor {
    final factor = screenSize.longestSide / Breakpoints.designHeight;
    return factor.clamp(Breakpoints.minScale, Breakpoints.maxScale).toDouble();
  }

  /// Horizontal sizes (widths, horizontal padding/gaps).
  double w(double value) => value * scaleFactor;

  /// Vertical sizes (heights, vertical padding/gaps).
  double h(double value) => value * _heightFactor;

  /// Radii and icon sizes (uniform scale).
  double r(double value) => value * scaleFactor;

  /// Font sizes: scale less aggressively than layout.
  double sp(double value) {
    final factor = scaleFactor.clamp(0.9, 1.15).toDouble();
    return value * factor;
  }

  /// Pick a value per screen type. Missing values fall back to the smaller
  /// screen type.
  T responsive<T>({required T mobile, T? tablet, T? desktop}) {
    switch (screenType) {
      case ScreenType.mobile:
        return mobile;
      case ScreenType.tablet:
        return tablet ?? mobile;
      case ScreenType.desktop:
        return desktop ?? tablet ?? mobile;
    }
  }

  /// Default horizontal page padding.
  double get pagePadding =>
      responsive(mobile: w(20), tablet: w(32), desktop: w(48));
}
