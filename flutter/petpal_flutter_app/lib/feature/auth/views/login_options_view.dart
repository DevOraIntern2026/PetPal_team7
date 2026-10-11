import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';
import 'package:petpal_flutter_app/core/widgets/paw_pattern_background.dart';
import 'package:petpal_flutter_app/feature/auth/views/sign_in_view.dart';
import 'package:petpal_flutter_app/feature/auth/views/sign_up_view.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/social_buttons.dart';

/// "Login" landing screen: Sign in / Sign up / social shortcuts.
class LoginOptionsView extends StatelessWidget {
  const LoginOptionsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          const PawPatternBackground(),
          SafeArea(
            child: ResponsiveCenter(
              maxWidth: 480,
              padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
              child: Column(
                children: [
                  const Spacer(flex: 3),
                  AppImage(
                    AppAssets.logo,
                    width: context.w(130),
                    fit: BoxFit.contain,
                  ),
                  const Spacer(flex: 3),
                  ElevatedButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const SignInView(),
                      ),
                    ),
                    child: const Text('Sign in'),
                  ),
                  SizedBox(height: context.h(16)),
                  OutlinedButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const SignUpView(),
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.accent,
                      side: const BorderSide(color: AppColors.accent),
                    ),
                    child: const Text('Sign up'),
                  ),
                  const Spacer(flex: 4),
                  const SocialWideButton(
                    provider: SocialProvider.google,
                    label: 'Continue with google',
                  ),
                  SizedBox(height: context.h(12)),
                  const SocialWideButton(
                    provider: SocialProvider.facebook,
                    label: 'Continue with facebook',
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
