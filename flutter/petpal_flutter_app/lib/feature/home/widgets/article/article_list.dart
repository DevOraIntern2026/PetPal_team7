
import 'package:flutter/material.dart';
import 'article_card.dart';

class ArticleList extends StatelessWidget {
  const ArticleList({super.key});

  @override
  Widget build(BuildContext context) {
    final articles = [
      {
        'image': 'assets/images/animals/animal_owner.jpg',
        'title': 'Listen to your pet',
        'description': 'Learn what to say to express love to each other.',
      },
      {
        'image': 'assets/images/animals/animal_owner.jpg',
        'title': 'How to care for your pet',
        'description': 'Simple tips for a happy and healthy pet.',
      },
    ];

    return SizedBox(
      height: 70,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: articles.length,
        padding: EdgeInsets.zero,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final article = articles[index];

          return ArticleCard(
            image_path: article['image']!,
            title: article['title']!,
            description: article['description']!,
          );
        },
      ),
    );
  }
}
