
import 'package:flutter/material.dart';
import 'popular_card.dart';

class PopularList extends StatelessWidget {
  const PopularList({super.key});

  @override
  Widget build(BuildContext context) {
    final popular_items = [
      {
        'image': 'assets/images/animals/popular.jpeg',
        'name': 'Madeline',
        'subtitle': 'Little pet shop',
      },
      {
        'image': 'assets/images/animals/cat.jpeg',
        'name': 'Fluffy',
        'subtitle': 'Cute pet store',
      },
    ];

    return SizedBox(
      height: 70,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.zero,
        itemCount: popular_items.length,
        separatorBuilder: (context, index) {
          return const SizedBox(width: 12);
        },
        itemBuilder: (context, index) {
          final item = popular_items[index];

          return PopularCard(
            image_path: item['image']!,
            name: item['name']!,
            subtitle: item['subtitle']!,
          );
        },
      ),
    );
  }
}
