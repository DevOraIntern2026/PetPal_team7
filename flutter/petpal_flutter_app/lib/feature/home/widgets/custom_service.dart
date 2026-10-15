import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';

class CustomService extends StatelessWidget {
  const CustomService({super.key, required this.text, required this.image});

  final String text;
  final String image;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(
        children: [
          Container(
            width: 70,
            height: 70,
            decoration: const BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.all(Radius.circular(30)),
            ),
            child: Image.asset(image),
          ),
          const Gap(5),
          Text(text, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
