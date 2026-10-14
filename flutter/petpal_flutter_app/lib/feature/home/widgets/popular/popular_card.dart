
import 'package:flutter/material.dart';

class PopularCard extends StatelessWidget {
  final String image_path;
  final String name;
  final String subtitle;

  const PopularCard({
    super.key,
    required this.image_path,
    required this.name,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 260,
      child: Row(
        children: [
          ClipOval(
            child: Image.asset(
              image_path,
              width: 60,
              height: 60,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stack_trace) {
                return Container(
                  width: 60,
                  height: 60,
                  color: const Color(0xFFF3F3F3),
                  child: const Icon(
                    Icons.pets,
                    color: Colors.grey,
                  ),
                );
              },
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
