import 'dart:async';

import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/navigation/fade_route.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_page.dart';
import 'package:petpal_flutter_app/feature/home/views/home_view.dart';

/// Success screen. Continues to Home by itself after a moment.
class VerifiedView extends StatefulWidget {
  const VerifiedView({super.key});

  @override
  State<VerifiedView> createState() => _VerifiedViewState();
}

class _VerifiedViewState extends State<VerifiedView> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(const Duration(milliseconds: 2500), _goHome);
  }

  void _goHome() {
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      fadeRoute(HomeView()),
      (route) => false,
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AuthPage(
      child: SizedBox(
        // Fill the visible area so the content sits in the vertical middle.
        height: context.screenHeight * 0.7,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.verified,
              size: context.r(140),
              color: AppColors.verifiedBlue,
            ),
            SizedBox(height: context.h(16)),
            Text(
              'Your account successfully verified',
              textAlign: TextAlign.center,
              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
