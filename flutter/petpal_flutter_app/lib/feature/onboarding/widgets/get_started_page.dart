import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/navigation/fade_route.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';
import 'package:petpal_flutter_app/core/widgets/paw_pattern_background.dart';
import 'package:petpal_flutter_app/feature/auth/views/login_options_view.dart';

/// Last onboarding page: cream background, logo and the GET STARTED button.
class GetStartedPage extends StatelessWidget {
  const GetStartedPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.background,
      child: Stack(
        fit: StackFit.expand,
        children: [
          const PawPatternBackground(),
          SafeArea(
            child: ResponsiveCenter(
              maxWidth: 480,
              padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
              child: Column(
                children: [
                  const Spacer(flex: 5),
                  AppImage(
                    AppAssets.logo,
                    width: context.w(150),
                    fit: BoxFit.contain,
                  ),
                  const Spacer(flex: 6),
                  ElevatedButton(
                    onPressed: () => Navigator.of(context).pushReplacement(
                      fadeRoute(const LoginOptionsView()),
                    ),
                    child: const Text('GET STARTED'),
                  ),
                  SizedBox(height: context.h(24)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
