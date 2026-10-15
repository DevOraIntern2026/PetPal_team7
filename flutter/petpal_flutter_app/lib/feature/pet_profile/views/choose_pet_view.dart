import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/core/widgets/paw_pattern_background.dart';
import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';
import 'package:petpal_flutter_app/feature/pet_profile/views/pet_profile_form_view.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_flow_page.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_type_tile.dart';

/// Step 1 of the pet flow: pick the kind of pet.
///
/// The whole flow (choose -> profile -> summary -> health) calls [onFinished]
/// with the collected [PetDraft] when the user taps Done, then returns to the
/// first route.
class ChoosePetView extends StatelessWidget {
  const ChoosePetView({super.key, required this.onFinished});

  final ValueChanged<PetDraft> onFinished;

  void _select(BuildContext context, PetType type) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => PetProfileFormView(
          draft: PetDraft(type: type),
          onFinished: onFinished,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          const PawPatternBackground(),
          const SafeArea(
            child: Align(
              alignment: Alignment.topLeft,
              child: PetBackButton(),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: FractionallySizedBox(
              heightFactor: 0.72,
              widthFactor: 1,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: AppColors.sheet,
                  border: Border.all(color: AppColors.primary),
                  borderRadius: BorderRadius.vertical(
                    top: Radius.circular(context.r(48)),
                  ),
                ),
                child: SafeArea(
                  top: false,
                  child: Center(
                    child: SingleChildScrollView(
                      padding: EdgeInsets.symmetric(vertical: context.h(24)),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Choose your pet',
                            style: AppTextStyles.display.copyWith(
                              fontSize: context.sp(34),
                              color: AppColors.primary,
                            ),
                          ),
                          SizedBox(height: context.h(20)),
                          for (final type in PetType.values) ...[
                            PetTypeTile(
                              type: type,
                              onTap: () => _select(context, type),
                            ),
                            SizedBox(height: context.h(16)),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
