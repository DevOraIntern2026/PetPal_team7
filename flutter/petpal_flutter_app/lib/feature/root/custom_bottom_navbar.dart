
import 'package:flutter/material.dart';

class CustomBottomNavigationBar extends StatelessWidget {
  final int current_index;
  final ValueChanged<int> on_tap;

  const CustomBottomNavigationBar({
    super.key,
    required this.current_index,
    required this.on_tap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      color: Colors.white,
      elevation: 0,
      shape: const CircularNotchedRectangle(),
      notchMargin: 8,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: SizedBox(
        height: 66,
        child: Row(
          children: [
            Expanded(
              child: _build_item(
                icon: Icons.home_outlined,
                active_icon: Icons.home_rounded,
                label: 'Home',
                index: 0,
              ),
            ),
            Expanded(
              child: _build_item(
                icon: Icons.favorite_border_rounded,
                active_icon: Icons.favorite_rounded,
                label: 'Favorites',
                index: 1,
              ),
            ),
            const SizedBox(width: 56),
            Expanded(
              child: _build_item(
                icon: Icons.storefront_outlined,
                active_icon: Icons.storefront_rounded,
                label: 'Shop',
                index: 3,
              ),
            ),
            Expanded(
              child: _build_item(
                icon: Icons.person_outline_rounded,
                active_icon: Icons.person_rounded,
                label: 'Profile',
                index: 4,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _build_item({
    required IconData icon,
    required IconData active_icon,
    required String label,
    required int index,
  }) {
    final bool is_selected = current_index == index;
    const Color primary_color = Color(0xFF27AEC5);

    return InkWell(
      onTap: () => on_tap(index),
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 7),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              is_selected ? active_icon : icon,
              size: 25,
              color: is_selected ? primary_color : const Color(0xFF536071),
            ),
            const SizedBox(height: 3),
            Text(
              label,
              maxLines: 1,
              style: TextStyle(
                fontSize: 10,
                color: is_selected ? primary_color : const Color(0xFF536071),
                fontWeight: is_selected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
