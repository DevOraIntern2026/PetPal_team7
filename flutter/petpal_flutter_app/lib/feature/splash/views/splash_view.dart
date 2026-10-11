import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/navigation/fade_route.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';
import 'package:petpal_flutter_app/core/widgets/paw_pattern_background.dart';
import 'package:petpal_flutter_app/feature/onboarding/views/onboarding_view.dart';

/// Cream screen with the paw pattern and the full logo fading in.
/// Moves to onboarding on its own after a short delay.
class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView>
    with SingleTickerProviderStateMixin {
  static const Duration _displayTime = Duration(milliseconds: 2800);

  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  );
  late final Animation<double> _fade = CurvedAnimation(
    parent: _controller,
    curve: Curves.easeOut,
  );
  late final Animation<double> _scale = Tween<double>(begin: 0.85, end: 1)
      .animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));

  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _controller.forward();
    _timer = Timer(_displayTime, _goNext);
  }

  void _goNext() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(fadeRoute(const OnboardingView()));
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final logoWidth = math.min(MediaQuery.sizeOf(context).width * 0.6, 320.0);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const PawPatternBackground(),
          Center(
            child: FadeTransition(
              opacity: _fade,
              child: ScaleTransition(
                scale: _scale,
                child: AppImage(
                  AppAssets.splashLogoFull,
                  width: logoWidth,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
