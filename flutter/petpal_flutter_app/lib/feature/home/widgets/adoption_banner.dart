
import 'package:flutter/material.dart';

class AdoptionBanner extends StatelessWidget {
  const AdoptionBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFFF7F9E8),
        borderRadius: BorderRadius.circular(20),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Positioned(
            right: -5,
            bottom: 0,
            top: 0,
            width: 125,
            child: Image.asset(
              'assets/images/animals/adoption_dog.png',
              fit: BoxFit.cover,
              alignment: Alignment.center,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(15),
            child: SizedBox(
              width: 175,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Find Your\nNew Friend',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 3),
                  const Text(
                    'Many pets are waiting for a loving home',
                    style: TextStyle(
                      fontSize: 9,
                      height: 1,
                      color: Colors.grey,
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 6),
                  SizedBox(
                    height: 26,
                    child: ElevatedButton(
                      onPressed: () {
                        // Navigate to the adoption screen.
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2BAAC0),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                        ),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: const StadiumBorder(),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Browse Adoptions',
                        style: TextStyle(fontSize: 10),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
