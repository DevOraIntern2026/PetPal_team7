import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';

/// Back arrow used by every screen of the pet flow (orange in the design).
class PetBackButton extends StatelessWidget {
  const PetBackButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(
        Icons.arrow_back_ios_new_rounded,
        size: 20,
        color: AppColors.accent,
      ),
      onPressed: () => Navigator.of(context).maybePop(),
    );
  }
}

/// Layout shared by "Pet profile" and "Health": orange back arrow, optional
/// Skip, a big centered title, scrollable fields and a full-width button
/// pinned to the bottom.
class PetFlowPage extends StatelessWidget {
  const PetFlowPage({
    super.key,
    required this.title,
    required this.child,
    required this.buttonLabel,
    required this.onButtonPressed,
    this.onSkip,
  });

  final String title;
  final Widget child;
  final String buttonLabel;
  final VoidCallback onButtonPressed;
  final VoidCallback? onSkip;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const PetBackButton(),
        actions: [
          if (onSkip != null)
            TextButton(
              onPressed: onSkip,
              style: TextButton.styleFrom(
                foregroundColor: AppColors.textSecondary,
                textStyle: AppTextStyles.body,
              ),
              child: const Text('Skip'),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: ResponsiveCenter(
          maxWidth: 480,
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  keyboardDismissBehavior:
                      ScrollViewKeyboardDismissBehavior.onDrag,
                  padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      SizedBox(height: context.h(32)),
                      Text(
                        title,
                        textAlign: TextAlign.center,
                        style: AppTextStyles.h1.copyWith(
                          fontSize: context.sp(30),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: context.h(40)),
                      child,
                      SizedBox(height: context.h(24)),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.fromLTRB(
                  context.pagePadding,
                  context.h(8),
                  context.pagePadding,
                  context.h(16),
                ),
                child: ElevatedButton(
                  onPressed: onButtonPressed,
                  child: Text(buttonLabel),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
