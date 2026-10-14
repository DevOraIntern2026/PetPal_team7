
import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/feature/favorites/views/favorites_view.dart';
import 'package:petpal_flutter_app/feature/home/views/home_view.dart';
import 'package:petpal_flutter_app/feature/pets/views/pets_view.dart';
import 'package:petpal_flutter_app/feature/profile/views/profile_view.dart';
import 'package:petpal_flutter_app/feature/root/custom_bottom_navbar.dart';
import 'package:petpal_flutter_app/feature/shop/views/shop_view.dart';


class RootView extends StatefulWidget {
  const RootView({super.key});

  @override
  State<RootView> createState() => _RootViewState();
}

class _RootViewState extends State<RootView> {
  int _current_index = 0;

  late final List<Widget> _pages = [
    const HomeView(),
    const FavoritesView(),
    const PetsView(),
    const ShopView(),
    const ProfileView(),
  ];

  void _on_navigation_tap(int index) {
    setState(() {
      _current_index = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    const Color primary_color = Color(0xFF27AEC5);

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _current_index,
        children: _pages,
      ),
      floatingActionButton: SizedBox(
        width: 66,
        height: 66,
        child: FloatingActionButton(
          onPressed: () => _on_navigation_tap(2),
          backgroundColor: primary_color,
          foregroundColor: Colors.white,
          elevation: 5,
          shape: const CircleBorder(),
          child: const Icon(
            Icons.pets_rounded,
            size: 32,
          ),
        ),
      ),
      floatingActionButtonLocation:
          FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(26),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.07),
              blurRadius: 18,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: CustomBottomNavigationBar(
          current_index: _current_index,
          on_tap: _on_navigation_tap,
        ),
      ),
    );
  }
}
