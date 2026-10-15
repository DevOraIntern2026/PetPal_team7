import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/feature/favorites/views/favorites_view.dart';
import 'package:petpal_flutter_app/feature/home/views/home_view.dart';
import 'package:petpal_flutter_app/feature/pets/views/pets_view.dart';
import 'package:petpal_flutter_app/feature/profile/views/profile_view.dart';
import 'package:petpal_flutter_app/feature/root/custom_bottom_navbar.dart';
import 'package:petpal_flutter_app/feature/shop/views/shop_view.dart';

/// Tab indexes. The center button (paw) is the Pets tab.
abstract final class RootTab {
  static const int home = 0;
  static const int favorites = 1;
  static const int pets = 2;
  static const int shop = 3;
  static const int profile = 4;
}

class RootView extends StatefulWidget {
  const RootView({super.key});

  @override
  State<RootView> createState() => _RootViewState();
}

class _RootViewState extends State<RootView> {
  int _currentIndex = RootTab.home;

  final List<Widget> _pages = const [
    HomeView(),
    FavoritesView(),
    PetsView(),
    ShopView(),
    ProfileView(),
  ];

  void _onNavigationTap(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      floatingActionButton: SizedBox(
        width: 66,
        height: 66,
        child: FloatingActionButton(
          onPressed: () => _onNavigationTap(RootTab.pets),
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.onPrimary,
          elevation: 5,
          shape: const CircleBorder(),
          child: const Icon(Icons.pets_rounded, size: 32),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(26)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.07),
              blurRadius: 18,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: CustomBottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onNavigationTap,
        ),
      ),
    );
  }
}
