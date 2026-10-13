import 'package:flutter/material.dart';

import '../constants/app_assets.dart';

/// Full-size faint paw pattern. Put it first inside a `Stack`.
/// Renders nothing if the asset is missing, so screens never break.
class PawPatternBackground extends StatelessWidget {
  const PawPatternBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: Image.asset(
        AppAssets.splashPattern,
        fit: BoxFit.cover,
        excludeFromSemantics: true,
        errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
      ),
    );
  }
}
