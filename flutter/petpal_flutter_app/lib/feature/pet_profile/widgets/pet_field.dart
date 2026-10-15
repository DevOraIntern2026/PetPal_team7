import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/pet_profile/data/pet_options.dart';

const Icon _chevron = Icon(
  Icons.keyboard_arrow_down_rounded,
  color: AppColors.primary,
  size: 28,
);

/// Shared look of the pet flow fields.
///
/// - filled (default): white box without border ("Pet profile" screen).
/// - outlined: teal border ("Health" screen).
InputDecoration petFieldDecoration({
  String? hint,
  bool outlined = false,
  Widget? suffixIcon,
  String? suffixText,
}) {
  final OutlineInputBorder border = OutlineInputBorder(
    borderRadius: BorderRadius.circular(outlined ? 12 : 10),
    borderSide: outlined
        ? const BorderSide(color: AppColors.primary)
        : BorderSide.none,
  );
  final OutlineInputBorder focusedBorder = OutlineInputBorder(
    borderRadius: BorderRadius.circular(outlined ? 12 : 10),
    borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
  );

  return InputDecoration(
    hintText: hint,
    hintStyle: AppTextStyles.body.copyWith(color: AppColors.textPrimary),
    suffixIcon: suffixIcon,
    suffixText: suffixText,
    suffixStyle: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
    filled: true,
    fillColor: AppColors.surface,
    isDense: true,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: border,
    enabledBorder: border,
    focusedBorder: focusedBorder,
  );
}

/// Dropdown with the teal chevron. The chosen value is kept by the widget, so
/// only [onChanged] is needed.
class PetDropdownField extends StatelessWidget {
  const PetDropdownField({
    super.key,
    required this.hint,
    required this.items,
    required this.onChanged,
    this.outlined = false,
  });

  final String hint;
  final List<String> items;
  final ValueChanged<String?> onChanged;
  final bool outlined;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      isExpanded: true,
      icon: _chevron,
      decoration: petFieldDecoration(outlined: outlined),
      hint: Text(hint, style: AppTextStyles.body),
      dropdownColor: AppColors.surface,
      borderRadius: BorderRadius.circular(12),
      style: AppTextStyles.body.copyWith(color: AppColors.textPrimary),
      items: [
        for (final item in items)
          DropdownMenuItem<String>(value: item, child: Text(item)),
      ],
      onChanged: onChanged,
    );
  }
}

/// Looks like a dropdown but opens a date picker ("Last vet visit").
class PetDateField extends StatelessWidget {
  const PetDateField({
    super.key,
    required this.hint,
    required this.value,
    required this.onChanged,
    this.outlined = false,
  });

  final String hint;
  final DateTime? value;
  final ValueChanged<DateTime> onChanged;
  final bool outlined;

  Future<void> _pick(BuildContext context) async {
    final DateTime now = DateTime.now();
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: value ?? now,
      firstDate: DateTime(now.year - 30),
      lastDate: now,
    );
    if (picked != null) onChanged(picked);
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _pick(context),
      borderRadius: BorderRadius.circular(12),
      child: InputDecorator(
        decoration: petFieldDecoration(outlined: outlined, suffixIcon: _chevron),
        child: Text(
          value == null ? hint : PetFormat.fullDate(value!),
          style: AppTextStyles.body.copyWith(color: AppColors.textPrimary),
        ),
      ),
    );
  }
}
