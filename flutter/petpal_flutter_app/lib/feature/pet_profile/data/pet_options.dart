import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';

/// Choices for the dropdowns of the pet profile flow.
/// TODO: replace with data from the API when it exists.
abstract final class PetOptions {
  static const List<String> ages = [
    'Under 1 year',
    '1 year',
    '2 years',
    '3 years',
    '4 years',
    '5 years',
    '6 years',
    '7 years',
    '8 years',
    '9 years',
    '10 years',
    '11 years',
    '12 years',
    '13 years',
    '14 years',
    '15+ years',
  ];

  static const List<String> genders = ['Male', 'Female'];

  static const List<String> bloodTypes = ['A', 'B', 'AB', 'Unknown'];

  static const List<String> vaccinations = [
    'Fully vaccinated',
    'Partially vaccinated',
    'Not vaccinated',
    'Unknown',
  ];

  static const List<String> weightStatuses = [
    'Underweight',
    'Healthy weight',
    'Overweight',
  ];

  static List<String> breedsFor(PetType? type) {
    switch (type) {
      case PetType.dog:
        return const [
          'Golden Retriever',
          'German Shepherd',
          'Labrador Retriever',
          'Bulldog',
          'Poodle',
          'Husky',
          'Shih Tzu',
          'Mixed / Other',
        ];
      case PetType.cat:
        return const [
          'Persian',
          'Siamese',
          'Maine Coon',
          'British Shorthair',
          'Ragdoll',
          'Domestic Shorthair',
          'Mixed / Other',
        ];
      case PetType.bunny:
        return const [
          'Holland Lop',
          'Mini Rex',
          'Netherland Dwarf',
          'Lionhead',
          'Mixed / Other',
        ];
      case PetType.bird:
        return const [
          'Budgerigar',
          'Cockatiel',
          'Canary',
          'Lovebird',
          'Parrot',
          'Mixed / Other',
        ];
      case PetType.other:
      case null:
        return const ['Other'];
    }
  }
}

/// Small formatting helpers for the pet screens.
abstract final class PetFormat {
  static const List<String> _months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /// `24.Sep` (stat chip).
  static String shortDate(DateTime date) =>
      '${date.day}.${_months[date.month - 1]}';

  /// `24 Sep 2026` (form field).
  static String fullDate(DateTime date) =>
      '${date.day} ${_months[date.month - 1]} ${date.year}';

  /// `27.4`, or `27` when there is no decimal part.
  static String number(double value) {
    return value == value.roundToDouble()
        ? value.toStringAsFixed(0)
        : value.toStringAsFixed(1);
  }
}
