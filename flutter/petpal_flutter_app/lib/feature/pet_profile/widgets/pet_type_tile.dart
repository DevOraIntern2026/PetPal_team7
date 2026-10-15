import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';

/// Outlined square with the pet icon and its name ("Choose your pet").
class PetTypeTile extends StatelessWidget {
  const PetTypeTile({super.key, required this.type, required this.onTap});

  final PetType type;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final String? asset = type.asset;
    final double size = context.w(86);

    return Material(
      color: Colors.transparent,
      child: Ink(
        width: size,
        height: size,
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.primary),
          borderRadius: BorderRadius.circular(14),
        ),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (asset != null) ...[
                Image.asset(
                  asset,
                  width: context.w(38),
                  height: context.w(38),
                  fit: BoxFit.contain,
                  // Asset not exported yet: show an emoji instead.
                  errorBuilder: (context, error, stackTrace) =>
                      Text(type.emoji, style: const TextStyle(fontSize: 30)),
                ),
                const SizedBox(height: 2),
              ],
              Text(
                type.label,
                style: AppTextStyles.display.copyWith(
                  fontSize: context.sp(16),
                  fontWeight: FontWeight.w400,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
