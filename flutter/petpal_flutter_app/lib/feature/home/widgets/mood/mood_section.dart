import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/feature/home/widgets/mood/mood_card.dart';

class MoodSection extends StatelessWidget {
  const MoodSection({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Mood',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 6),
        MoodCard(
          petName: 'Rosie',
          description:
              'A happy and playful dog who loves spending time with people.',
          imagePath: AppAssets.happyDog,
        ),
      ],
    );
  }
}
