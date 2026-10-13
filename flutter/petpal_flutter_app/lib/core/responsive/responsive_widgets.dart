import 'package:flutter/widgets.dart';

import 'breakpoints.dart';
import 'responsive_extensions.dart';

/// Builds a different layout per screen type.
///
/// ```dart
/// ResponsiveBuilder(
///   mobile: (_) => const VetListMobile(),
///   tablet: (_) => const VetListTablet(), // optional
/// )
/// ```
class ResponsiveBuilder extends StatelessWidget {
  const ResponsiveBuilder({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  final WidgetBuilder mobile;
  final WidgetBuilder? tablet;
  final WidgetBuilder? desktop;

  @override
  Widget build(BuildContext context) {
    final builder = context.responsive<WidgetBuilder>(
      mobile: mobile,
      tablet: tablet,
      desktop: desktop,
    );
    return builder(context);
  }
}

/// Centers [child] and limits its width so phone layouts don't stretch
/// across a tablet or browser window.
class ResponsiveCenter extends StatelessWidget {
  const ResponsiveCenter({
    super.key,
    required this.child,
    this.maxWidth = Breakpoints.maxContentWidth,
    this.padding,
  });

  final Widget child;
  final double maxWidth;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final content = padding == null
        ? child
        : Padding(padding: padding!, child: child);
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: content,
      ),
    );
  }
}
