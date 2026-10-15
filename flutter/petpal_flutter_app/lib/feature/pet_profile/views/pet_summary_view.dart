import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';
import 'package:petpal_flutter_app/feature/pet_profile/data/pet_options.dart';
import 'package:petpal_flutter_app/feature/pet_profile/models/pet_draft.dart';
import 'package:petpal_flutter_app/feature/pet_profile/views/health_view.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/pet_flow_page.dart';
import 'package:petpal_flutter_app/feature/pet_profile/widgets/stat_chip.dart';

/// Step 3: the pet card ("Rosy"): photo, basic info, stat chips and the
/// personality text. Values that were not filled in show "—".
///
/// Figma has no button on this screen, so a Continue button was added next to
/// Skip; both go to the Health step.
class PetSummaryView extends StatefulWidget {
  const PetSummaryView({
    super.key,
    required this.draft,
    required this.onFinished,
  });

  final PetDraft draft;
  final ValueChanged<PetDraft> onFinished;

  @override
  State<PetSummaryView> createState() => _PetSummaryViewState();
}

class _PetSummaryViewState extends State<PetSummaryView> {
  static const double _sheetOverlap = 28;

  final _personalityController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _personalityController.text = widget.draft.personality;
  }

  @override
  void dispose() {
    _personalityController.dispose();
    super.dispose();
  }

  void _goToHealth() {
    final PetDraft draft = widget.draft.copyWith(
      personality: _personalityController.text.trim(),
    );
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => HealthView(draft: draft, onFinished: widget.onFinished),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final PetDraft draft = widget.draft;
    final double photoHeight =
        (context.screenHeight * 0.42).clamp(260.0, 420.0).toDouble();

    final List<String> details = [
      if (draft.breed != null) draft.breed!,
      if (draft.gender != null) draft.gender!,
      if (draft.age != null) draft.age!,
    ];

    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Stack(
            children: [
              // Photo (placeholder until the user can pick one).
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: photoHeight,
                child: draft.photoUrl != null
                    ? AppImage(draft.photoUrl!, fit: BoxFit.cover)
                    : const ColoredBox(
                        color: AppColors.primaryLight,
                        child: Center(
                          child: Icon(
                            Icons.pets,
                            size: 96,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
              ),
              // Info sheet overlapping the photo.
              Positioned(
                top: photoHeight - _sheetOverlap,
                left: 0,
                right: 0,
                bottom: 0,
                child: DecoratedBox(
                  decoration: const BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(32),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Column(
                      children: [
                        Expanded(
                          child: SingleChildScrollView(
                            keyboardDismissBehavior:
                                ScrollViewKeyboardDismissBehavior.onDrag,
                            padding: EdgeInsets.fromLTRB(
                              context.pagePadding,
                              context.h(24),
                              context.pagePadding,
                              context.h(16),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  draft.name.isEmpty ? '—' : draft.name,
                                  style: AppTextStyles.h1.copyWith(
                                    fontSize: context.sp(28),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                SizedBox(height: context.h(8)),
                                for (final line in details)
                                  Text(
                                    line,
                                    style: AppTextStyles.title.copyWith(
                                      fontWeight: FontWeight.w400,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                SizedBox(height: context.h(20)),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    StatChip(
                                      lines: [
                                        draft.weightKg == null
                                            ? '—'
                                            : PetFormat.number(
                                                draft.weightKg!,
                                              ),
                                        'KG',
                                      ],
                                    ),
                                    StatChip(
                                      lines: [
                                        draft.heightCm == null
                                            ? '—'
                                            : PetFormat.number(
                                                draft.heightCm!,
                                              ),
                                        'CM',
                                      ],
                                    ),
                                    StatChip(
                                      lines: [
                                        draft.lastVetVisit == null
                                            ? '—'
                                            : PetFormat.shortDate(
                                                draft.lastVetVisit!,
                                              ),
                                      ],
                                    ),
                                  ],
                                ),
                                SizedBox(height: context.h(24)),
                                const Text(
                                  'Personality',
                                  style: AppTextStyles.h2,
                                ),
                                TextField(
                                  controller: _personalityController,
                                  minLines: 3,
                                  maxLines: 6,
                                  style: AppTextStyles.title.copyWith(
                                    fontWeight: FontWeight.w400,
                                    color: AppColors.textSecondary,
                                  ),
                                  decoration: InputDecoration(
                                    hintText:
                                        "Describe your pet's personality",
                                    hintStyle: AppTextStyles.title.copyWith(
                                      fontWeight: FontWeight.w400,
                                      color: AppColors.textHint,
                                    ),
                                    border: InputBorder.none,
                                    enabledBorder: InputBorder.none,
                                    focusedBorder: InputBorder.none,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.fromLTRB(
                            context.pagePadding,
                            0,
                            context.pagePadding,
                            context.h(16),
                          ),
                          child: ElevatedButton(
                            onPressed: _goToHealth,
                            child: const Text('Continue'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // Back arrow and Skip over the photo.
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: SafeArea(
                  bottom: false,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const PetBackButton(),
                      TextButton(
                        onPressed: _goToHealth,
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.onPrimary,
                          textStyle: AppTextStyles.title.copyWith(
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        child: const Text('Skip'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
