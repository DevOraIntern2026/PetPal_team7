/// Paths of every asset used by the app (names match the files in `assets/`).
///
/// Never write an asset path as a string inside a widget; add it here.
abstract final class AppAssets {
  static const String _assets = 'assets';
  static const String _images = 'assets/images';

  // ── Splash ──────────────────────────────────────────────────────────────
  /// Logo with the "Pet Mate" wordmark.
  static const String splashLogoFull = '$_images/splash/petmate_logo_full.png';

  /// Faint paw/heart pattern behind splash, get-started, login and pet flow.
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

  // ── Home ────────────────────────────────────────────────────────────────
  static const String aiIcon = '$_assets/Icons/ai_Icon.png';
  static const String serviceShop = '$_assets/Services/store.png';
  static const String serviceAdoption = '$_assets/Services/paw-print.png';
  static const String serviceVets = '$_assets/Services/stethoscope.png';
  static const String serviceCommunity = '$_assets/Services/users-round.png';

  static const String adoptionDog = '$_images/animals/adoption_dog.png';
  static const String animalOwner = '$_images/animals/animal_owner.jpg';
  static const String happyDog = '$_images/animals/happy_dog.jpeg';
  static const String popularShop = '$_images/animals/popular.jpeg';
  static const String cat = '$_images/animals/cat.jpeg';

  // ── Pet profile: "Choose your pet" line-art icons ───────────────────────
  // Not exported from Figma yet. Until the files exist, the tiles show an
  // emoji instead.
  static const String petDog = '$_images/pet_types/dog.png';
  static const String petCat = '$_images/pet_types/cat.png';
  static const String petBunny = '$_images/pet_types/bunny.png';
  static const String petBird = '$_images/pet_types/bird.png';
}
