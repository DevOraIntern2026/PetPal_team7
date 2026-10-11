import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/feature/onboarding/widgets/get_started_page.dart';
import 'package:petpal_flutter_app/feature/onboarding/widgets/onboarding_page.dart';
import 'package:petpal_flutter_app/feature/onboarding/widgets/page_dots.dart';

/// Swipeable flow: onboarding 1 -> onboarding 2 -> get started.
class OnboardingView extends StatefulWidget {
  const OnboardingView({super.key});

  @override
  State<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends State<OnboardingView> {
  static const int _pageCount = 3;

  final PageController _controller = PageController();
  int _page = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLastPage = _page == _pageCount - 1;

    return Scaffold(
      body: Stack(
        children: [
          PageView(
            controller: _controller,
            onPageChanged: (index) => setState(() => _page = index),
            children: const [
              OnboardingPage(
                title: 'For pets\nWith Love',
                image: AppAssets.onboardingPets,
              ),
              OnboardingPage(
                title: 'Connect With\nTrusted vets',
                image: AppAssets.onboardingVet,
              ),
              GetStartedPage(),
            ],
          ),
          if (!isLastPage)
            Positioned(
              left: 0,
              right: 0,
              bottom: MediaQuery.paddingOf(context).bottom + context.h(28),
              child: Center(
                child: PageDots(count: _pageCount, index: _page),
              ),
            ),
        ],
      ),
    );
  }
}
