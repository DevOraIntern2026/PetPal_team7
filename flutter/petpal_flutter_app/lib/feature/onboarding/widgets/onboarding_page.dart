import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';

/// One teal onboarding slide: big white title on top, illustration at the
/// bottom.
class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key, required this.title, required this.image});

  final String title;
  final String image;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.primary,
      child: SafeArea(
        child: Column(
          children: [
            SizedBox(height: context.h(72)),
            Text(
              title,
              textAlign: TextAlign.center,
              style: AppTextStyles.h1.copyWith(
                color: AppColors.onPrimary,
                fontSize: context.sp(30),
                fontWeight: FontWeight.w700,
              ),
            ),
            Expanded(
              child: Padding(
                // Leaves room for the page dots overlaid by OnboardingView.
                padding: EdgeInsets.only(bottom: context.h(56)),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 420),
                    child: AppImage(
                      image,
                      width: double.infinity,
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
