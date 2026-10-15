import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/feature/home/widgets/popular/popular_card.dart';

class PopularList extends StatelessWidget {
  const PopularList({super.key});

  // TODO: replace with real data once the shops API exists.
  static const List<({String image, String name, String subtitle})>
      _popularItems = [
    (
      image: AppAssets.popularShop,
      name: 'Madeline',
      subtitle: 'Little pet shop',
    ),
    (
      image: AppAssets.cat,
      name: 'Fluffy',
      subtitle: 'Cute pet store',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 70,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.zero,
        itemCount: _popularItems.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final item = _popularItems[index];

          return PopularCard(
            imagePath: item.image,
            name: item.name,
            subtitle: item.subtitle,
          );
        },
      ),
    );
  }
}
