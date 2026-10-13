import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';

/// Page indicator: the active page is a long pill, the others are dots.
class PageDots extends StatelessWidget {
  const PageDots({super.key, required this.count, required this.index});

  final int count;
  final int index;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < count; i++)
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOut,
            margin: const EdgeInsets.symmetric(horizontal: 3),
            width: i == index ? 28 : 7,
            height: 7,
            decoration: BoxDecoration(
              color: i == index
                  ? AppColors.onPrimary
                  : AppColors.onPrimary.withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
      ],
    );
  }
}
