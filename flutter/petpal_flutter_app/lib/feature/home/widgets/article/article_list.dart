import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/feature/home/widgets/article/article_card.dart';

class ArticleList extends StatelessWidget {
  const ArticleList({super.key});

  // TODO: replace with real data once the articles API exists.
  static const List<({String image, String title, String description})>
      _articles = [
    (
      image: AppAssets.animalOwner,
      title: 'Listen to your pet',
      description: 'Learn what to say to express love to each other.',
    ),
    (
      image: AppAssets.animalOwner,
      title: 'How to care for your pet',
      description: 'Simple tips for a happy and healthy pet.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 70,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _articles.length,
        padding: EdgeInsets.zero,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final article = _articles[index];

          return ArticleCard(
            imagePath: article.image,
            title: article.title,
            description: article.description,
          );
        },
      ),
    );
  }
}
