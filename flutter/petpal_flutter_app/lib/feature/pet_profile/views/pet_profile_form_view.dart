import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/pet_profile/data/pet_options.dart';
import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';
import 'package:petpal_flutter_app/feature/pet_profile/views/pet_summary_view.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_field.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_flow_page.dart';

/// Step 2: "Pet profile" form (name, age, weight, gender, breed, blood type).
///
/// Only the name is required. In Figma every field has a chevron; here the
/// name and weight are typed, the rest are dropdowns.
class PetProfileFormView extends StatefulWidget {
  const PetProfileFormView({
    super.key,
    required this.draft,
    required this.onFinished,
  });

  final PetDraft draft;
  final ValueChanged<PetDraft> onFinished;

  @override
  State<PetProfileFormView> createState() => _PetProfileFormViewState();
}

class _PetProfileFormViewState extends State<PetProfileFormView> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _weightController = TextEditingController();

  String? _age;
  String? _gender;
  String? _breed;
  String? _bloodType;

  @override
  void dispose() {
    _nameController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  void _next() {
    if (!_formKey.currentState!.validate()) return;

    final double? weight =
        double.tryParse(_weightController.text.trim().replaceAll(',', '.'));
    final PetDraft draft = widget.draft.copyWith(
      name: _nameController.text.trim(),
      age: _age,
      weightKg: weight,
      gender: _gender,
      breed: _breed,
      bloodType: _bloodType,
    );

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) =>
            PetSummaryView(draft: draft, onFinished: widget.onFinished),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PetFlowPage(
      title: 'Pet profile',
      buttonLabel: 'Next',
      onButtonPressed: _next,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: _nameController,
              textInputAction: TextInputAction.next,
              textCapitalization: TextCapitalization.words,
              style: AppTextStyles.body,
              decoration: petFieldDecoration(hint: 'Name'),
              validator: (value) => (value == null || value.trim().isEmpty)
                  ? 'Please enter your pet\'s name'
                  : null,
            ),
            const SizedBox(height: 26),
            PetDropdownField(
              hint: 'Age',
              items: PetOptions.ages,
              onChanged: (value) => _age = value,
            ),
            const SizedBox(height: 26),
            TextFormField(
              controller: _weightController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              textInputAction: TextInputAction.done,
              style: AppTextStyles.body,
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[0-9.,]')),
                LengthLimitingTextInputFormatter(5),
              ],
              decoration: petFieldDecoration(hint: 'Weight', suffixText: 'KG'),
            ),
            const SizedBox(height: 26),
            PetDropdownField(
              hint: 'Gender',
              items: PetOptions.genders,
              onChanged: (value) => _gender = value,
            ),
            const SizedBox(height: 26),
            PetDropdownField(
              hint: 'Breed',
              items: PetOptions.breedsFor(widget.draft.type),
              onChanged: (value) => _breed = value,
            ),
            const SizedBox(height: 26),
            PetDropdownField(
              hint: 'Blood type',
              items: PetOptions.bloodTypes,
              onChanged: (value) => _bloodType = value,
            ),
          ],
        ),
      ),
    );
  }
}
