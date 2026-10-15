import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';

class AdoptionBanner extends StatelessWidget {
  const AdoptionBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(20),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Positioned(
            right: -5,
            bottom: 0,
            top: 0,
            width: 125,
            child: Image.asset(
              AppAssets.adoptionDog,
              fit: BoxFit.cover,
              alignment: Alignment.center,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(15),
            child: SizedBox(
              width: 175,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Find Your\nNew Friend',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 3),
                  const Text(
                    'Many pets are waiting for a loving home',
                    style: TextStyle(
                      fontSize: 9,
                      height: 1,
                      color: AppColors.textSecondary,
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 6),
                  SizedBox(
                    height: 26,
                    child: ElevatedButton(
                      onPressed: () {
                        // TODO: navigate to the adoption screen.
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: const StadiumBorder(),
                      ),
                      child: const Text(
                        'Browse Adoptions',
                        style: TextStyle(fontSize: 10),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
