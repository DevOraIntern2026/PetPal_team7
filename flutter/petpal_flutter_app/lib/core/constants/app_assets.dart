/// Paths of every asset used by the app (names match the files in `assets/`).
abstract final class AppAssets {
  static const String _images = 'assets/images';

  // ── Splash ──────────────────────────────────────────────────────────────
  /// Logo with the "Pet Mate" wordmark.
  static const String splashLogoFull = '$_images/splash/petmate_logo_full.png';

  /// Faint paw/heart pattern behind splash, get-started and login.
  static const String splashPattern = '$_images/splash/splash_pattern.png';

  // ── Onboarding ──────────────────────────────────────────────────────────
  /// Onboarding 1: dog with a cat on its head.
  /// (If the two images are the other way round, swap these two lines.)
  static const String onboardingPets = '$_images/onboarding/image 4.png';

  /// Onboarding 2: vet examining a puppy.
  static const String onboardingVet = '$_images/onboarding/image 5.png';

  // ── Logo ────────────────────────────────────────────────────────────────
  /// Heart logo without text (get started, login, sign in, sign up).
  static const String logo = '$_images/logo/Splash.png';
}
