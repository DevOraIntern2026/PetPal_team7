import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';

class MoodCard extends StatelessWidget {
  const MoodCard({
    super.key,
    required this.petName,
    required this.description,
    required this.imagePath,
  });

  final String petName;
  final String description;
  final String imagePath;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 88,
      padding: const EdgeInsets.only(left: 10, top: 8, bottom: 8, right: 6),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(16),
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  petName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 3),
                Expanded(
                  child: Text(
                    description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.textSecondary,
                      height: 1.2,
                    ),
                  ),
                ),
                const MoodReactions(),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.asset(
              imagePath,
              width: 78,
              height: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 78,
                  color: AppColors.surface,
                  child: const Icon(Icons.pets),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class MoodReactions extends StatelessWidget {
  const MoodReactions({super.key});

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('😊', style: TextStyle(fontSize: 15)),
        SizedBox(width: 7),
        Text('😍', style: TextStyle(fontSize: 15)),
        SizedBox(width: 7),
        Text('😴', style: TextStyle(fontSize: 15)),
        SizedBox(width: 7),
        Text('🥰', style: TextStyle(fontSize: 15)),
      ],
    );
  }
}
