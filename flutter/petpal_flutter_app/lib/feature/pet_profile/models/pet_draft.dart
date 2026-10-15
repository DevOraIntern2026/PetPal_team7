import 'package:petpal_flutter_app/core/constants/app_assets.dart';

enum PetType { dog, cat, bunny, bird, other }

extension PetTypeX on PetType {
  String get label {
    switch (this) {
      case PetType.dog:
        return 'Dog';
      case PetType.cat:
        return 'Cat';
      case PetType.bunny:
        return 'Bunny';
      case PetType.bird:
        return 'Bird';
      case PetType.other:
        return 'Other';
    }
  }

  /// Line-art icon from the design. `null` for "Other" (text only).
  String? get asset {
    switch (this) {
      case PetType.dog:
        return AppAssets.petDog;
      case PetType.cat:
        return AppAssets.petCat;
      case PetType.bunny:
        return AppAssets.petBunny;
      case PetType.bird:
        return AppAssets.petBird;
      case PetType.other:
        return null;
    }
  }

  /// Shown while the line-art asset has not been exported yet.
  String get emoji {
    switch (this) {
      case PetType.dog:
        return '🐶';
      case PetType.cat:
        return '🐱';
      case PetType.bunny:
        return '🐰';
      case PetType.bird:
        return '🐦';
      case PetType.other:
        return '🐾';
    }
  }
}

/// Everything collected by the pet profile flow. It is passed from screen to
/// screen and handed to `onFinished` at the end (no storage yet).
class PetDraft {
  const PetDraft({
    this.type,
    this.name = '',
    this.age,
    this.weightKg,
    this.heightCm,
    this.gender,
    this.breed,
    this.bloodType,
    this.photoUrl,
    this.personality = '',
    this.vaccination,
    this.history = '',
    this.weightStatus,
    this.lastVetVisit,
  });

  final PetType? type;
  final String name;
  final String? age;
  final double? weightKg;
  final double? heightCm;
  final String? gender;
  final String? breed;
  final String? bloodType;

  /// Photo shown on the summary page. Picking a photo needs `image_picker`,
  /// which is not set up yet.
  final String? photoUrl;
  final String personality;
  final String? vaccination;
  final String history;
  final String? weightStatus;
  final DateTime? lastVetVisit;

  PetDraft copyWith({
    PetType? type,
    String? name,
    String? age,
    double? weightKg,
    double? heightCm,
    String? gender,
    String? breed,
    String? bloodType,
    String? photoUrl,
    String? personality,
    String? vaccination,
    String? history,
    String? weightStatus,
    DateTime? lastVetVisit,
  }) {
    return PetDraft(
      type: type ?? this.type,
      name: name ?? this.name,
      age: age ?? this.age,
      weightKg: weightKg ?? this.weightKg,
      heightCm: heightCm ?? this.heightCm,
      gender: gender ?? this.gender,
      breed: breed ?? this.breed,
      bloodType: bloodType ?? this.bloodType,
      photoUrl: photoUrl ?? this.photoUrl,
      personality: personality ?? this.personality,
      vaccination: vaccination ?? this.vaccination,
      history: history ?? this.history,
      weightStatus: weightStatus ?? this.weightStatus,
      lastVetVisit: lastVetVisit ?? this.lastVetVisit,
    );
  }
}
