
import 'package:flutter/material.dart';
import 'mood_card.dart';

class MoodSection extends StatelessWidget {
  const MoodSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Mood',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 6),
        const MoodCard(
          pet_name: 'Rosie',
          description:
              'A happy and playful dog who loves spending time with people.',
          image_path: 'assets/images/animals/happy_dog.jpeg',
        ),
      ],
    );
  }
}
