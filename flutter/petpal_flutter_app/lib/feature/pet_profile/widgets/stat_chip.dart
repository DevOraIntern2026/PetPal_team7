import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';

/// White rounded square with a teal border: "27.4 / KG", "24.Sep".
class StatChip extends StatelessWidget {
  const StatChip({super.key, required this.lines});

  /// One or two short lines, e.g. `['27.4', 'KG']`.
  final List<String> lines;

  @override
  Widget build(BuildContext context) {
    final double size = context.w(84);

    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.primary),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        lines.join('\n'),
        textAlign: TextAlign.center,
        style: AppTextStyles.title.copyWith(
          fontWeight: FontWeight.w400,
          fontSize: context.sp(18),
          height: 1.25,
        ),
      ),
    );
  }
}
