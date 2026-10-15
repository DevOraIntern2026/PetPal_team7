import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/feature/home/widgets/adoption_banner.dart';
import 'package:petpal_flutter_app/feature/home/widgets/article/articles_section.dart';
import 'package:petpal_flutter_app/feature/home/widgets/custom_service.dart';
import 'package:petpal_flutter_app/feature/home/widgets/mood/mood_section.dart';
import 'package:petpal_flutter_app/feature/home/widgets/popular/popular_section.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  static const OutlineInputBorder _searchBorder = OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(20)),
    borderSide: BorderSide(color: AppColors.primary),
  );

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: AppColors.surface,
        appBar: AppBar(
          title: Row(
            children: [
              const Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: 'Pet ',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    TextSpan(text: 'Mate'),
                  ],
                ),
                style: TextStyle(color: AppColors.primary, fontSize: 24),
              ),
              const Spacer(),
              Image.asset(
                AppAssets.aiIcon,
                color: AppColors.textPrimary,
                width: 30,
              ),
              const Gap(5),
              const Icon(
                Icons.notifications,
                size: 30,
                color: AppColors.textPrimary,
              ),
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: SingleChildScrollView(
            child: Column(
              children: [
                const Row(
                  children: [
                    CircleAvatar(radius: 30),
                    Gap(10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hi, Nadeen',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text('Egypt'),
                      ],
                    ),
                  ],
                ),
                const Gap(20),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 5),
                  child: TextField(
                    decoration: InputDecoration(
                      prefixIcon: Icon(Icons.search),
                      hintText: 'search for pets,vets,products....',
                      border: _searchBorder,
                      enabledBorder: _searchBorder,
                      focusedBorder: _searchBorder,
                    ),
                  ),
                ),
                const Gap(15),
                const SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      CustomService(
                        image: AppAssets.serviceShop,
                        text: 'Pet Shop',
                      ),
                      CustomService(
                        image: AppAssets.serviceAdoption,
                        text: 'Adoption',
                      ),
                      CustomService(
                        image: AppAssets.serviceVets,
                        text: 'Vets',
                      ),
                      CustomService(
                        image: AppAssets.serviceCommunity,
                        text: 'Community',
                      ),
                    ],
                  ),
                ),
                const Gap(20),
                const AdoptionBanner(),
                const Gap(20),
                const ArticlesSection(),
                const PopularSection(),
                const Gap(20),
                const MoodSection(),
                // Keeps the last card clear of the bottom navigation bar
                // (the root Scaffold reports its height in the padding).
                SizedBox(height: MediaQuery.paddingOf(context).bottom + 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
