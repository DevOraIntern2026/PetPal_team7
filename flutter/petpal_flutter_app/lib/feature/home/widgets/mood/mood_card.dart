
import 'package:flutter/material.dart';

class MoodCard extends StatelessWidget {
  final String pet_name;
  final String description;
  final String image_path;

  const MoodCard({
    super.key,
    required this.pet_name,
    required this.description,
    required this.image_path,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 88,
      padding: const EdgeInsets.only(
        left: 10,
        top: 8,
        bottom: 8,
        right: 6,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F9E8),
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
                  pet_name,
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
                      color: Colors.black54,
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
              image_path,
              width: 78,
              height: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stack_trace) {
                return Container(
                  width: 78,
                  color: Colors.white,
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
