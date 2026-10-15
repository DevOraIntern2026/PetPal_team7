import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/pet_profile/data/pet_options.dart';
import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_field.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_flow_page.dart';

/// Last step: "Health" (vaccination, history, weight status, last vet visit).
/// Both Done and Skip finish the flow and return to the first route.
class HealthView extends StatefulWidget {
  const HealthView({super.key, required this.draft, required this.onFinished});

  final PetDraft draft;
  final ValueChanged<PetDraft> onFinished;

  @override
  State<HealthView> createState() => _HealthViewState();
}

class _HealthViewState extends State<HealthView> {
  final _historyController = TextEditingController();

  String? _vaccination;
  String? _weightStatus;
  DateTime? _lastVetVisit;

  @override
  void dispose() {
    _historyController.dispose();
    super.dispose();
  }

  void _finish() {
    // TODO: save the pet through a Cubit / repository once the API exists.
    widget.onFinished(
      widget.draft.copyWith(
        vaccination: _vaccination,
        history: _historyController.text.trim(),
        weightStatus: _weightStatus,
        lastVetVisit: _lastVetVisit,
      ),
    );
    Navigator.of(context).popUntil((route) => route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    const UnderlineInputBorder lineBorder = UnderlineInputBorder(
      borderSide: BorderSide(color: AppColors.line),
    );

    return PetFlowPage(
      title: 'Health',
      buttonLabel: 'Done',
      onButtonPressed: _finish,
      onSkip: _finish,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PetDropdownField(
            hint: 'Vaccination',
            items: PetOptions.vaccinations,
            outlined: true,
            onChanged: (value) => _vaccination = value,
          ),
          const SizedBox(height: 22),
          InputDecorator(
            decoration: petFieldDecoration(outlined: true),
            child: const Text('History', style: AppTextStyles.body),
          ),
          TextField(
            controller: _historyController,
            minLines: 3,
            maxLines: 5,
            style: AppTextStyles.body,
            decoration: InputDecoration(
              hintText: 'Type here',
              hintStyle: AppTextStyles.body.copyWith(color: AppColors.textHint),
              filled: false,
              border: lineBorder,
              enabledBorder: lineBorder,
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: AppColors.primary),
              ),
              contentPadding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            ),
          ),
          const SizedBox(height: 22),
          // "Weight" in Figma: treated here as the pet's weight status
          // because the exact weight is typed on the "Pet profile" step.
          PetDropdownField(
            hint: 'Weight',
            items: PetOptions.weightStatuses,
            outlined: true,
            onChanged: (value) => _weightStatus = value,
          ),
          const SizedBox(height: 22),
          PetDateField(
            hint: 'Last vet visit',
            value: _lastVetVisit,
            outlined: true,
            onChanged: (date) => setState(() => _lastVetVisit = date),
          ),
        ],
      ),
    );
  }
}
