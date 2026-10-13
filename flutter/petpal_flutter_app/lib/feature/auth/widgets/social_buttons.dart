import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';

enum SocialProvider { google, facebook, apple }

void showSocialComingSoon(BuildContext context) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(const SnackBar(content: Text('Coming soon')));
}

/// Brand glyph for a provider. Drawn with built-in icons for now; swap the
/// body for `AppImage(...)` once the real icons are exported from Figma.
class SocialIcon extends StatelessWidget {
  const SocialIcon(this.provider, {super.key, this.size = 28});

  final SocialProvider provider;
  final double size;

  @override
  Widget build(BuildContext context) {
    switch (provider) {
      case SocialProvider.google:
        return SizedBox(
          width: size,
          height: size,
          child: Center(
            child: Text(
              'G',
              style: TextStyle(
                fontSize: size,
                height: 1,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF4285F4),
              ),
            ),
          ),
        );
      case SocialProvider.facebook:
        return Icon(Icons.facebook, size: size, color: const Color(0xFF1877F2));
      case SocialProvider.apple:
        return Icon(Icons.apple, size: size, color: Colors.black);
    }
  }
}

/// Row of Google / Facebook / Apple icons ("-Or sign in with-").
class SocialIconRow extends StatelessWidget {
  const SocialIconRow({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        for (final provider in SocialProvider.values)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: InkResponse(
              radius: 28,
              onTap: () => showSocialComingSoon(context),
              child: SocialIcon(provider),
            ),
          ),
      ],
    );
  }
}

/// Wide outlined button: "Continue with google".
class SocialWideButton extends StatelessWidget {
  const SocialWideButton({
    super.key,
    required this.provider,
    required this.label,
  });

  final SocialProvider provider;
  final String label;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: () => showSocialComingSoon(context),
      style: OutlinedButton.styleFrom(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textSecondary,
        textStyle: AppTextStyles.body,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SocialIcon(provider, size: 20),
          const SizedBox(width: 10),
          Text(label),
        ],
      ),
    );
  }
}
