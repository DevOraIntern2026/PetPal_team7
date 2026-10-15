import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';
import 'package:petpal_flutter_app/feature/pet_profile/views/choose_pet_view.dart';

/// Pets tab (center button). Entry point of the pet profile flow.
///
/// The list lives in memory only (it resets when the app restarts) until a
/// repository / API is added.
class PetsView extends StatefulWidget {
  const PetsView({super.key});

  @override
  State<PetsView> createState() => _PetsViewState();
}

class _PetsViewState extends State<PetsView> {
  final List<PetDraft> _pets = [];

  void _addPet(PetDraft pet) {
    setState(() => _pets.add(pet));
  }

  void _startFlow() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ChoosePetView(onFinished: _addPet),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // The root Scaffold reports the bottom bar height in the padding.
    final double bottomInset = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'My pets',
          style: AppTextStyles.h1.copyWith(color: AppColors.textPrimary),
        ),
      ),
      body: Padding(
        padding: EdgeInsets.fromLTRB(20, 8, 20, bottomInset + 16),
        child: Column(
          children: [
            Expanded(
              child: _pets.isEmpty
                  ? const Center(
                      child: Text(
                        'No pets yet.\nAdd your first pet to get started.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    )
                  : ListView.separated(
                      itemCount: _pets.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(height: 12),
                      itemBuilder: (context, index) =>
                          _PetTile(pet: _pets[index]),
                    ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _startFlow,
              child: const Text('Add pet'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PetTile extends StatelessWidget {
  const _PetTile({required this.pet});

  final PetDraft pet;

  @override
  Widget build(BuildContext context) {
    final List<String> details = [
      if (pet.breed != null) pet.breed!,
      if (pet.gender != null) pet.gender!,
      if (pet.age != null) pet.age!,
    ];

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.primary),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppColors.primaryLight,
          child: Text(
            pet.type?.emoji ?? '🐾',
            style: const TextStyle(fontSize: 22),
          ),
        ),
        title: Text(pet.name.isEmpty ? 'Unnamed' : pet.name),
        subtitle: details.isEmpty ? null : Text(details.join(' · ')),
      ),
    );
  }
}
