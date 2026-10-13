import 'dart:async';

import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/navigation/fade_route.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/feature/auth/views/verified_view.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_page.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/otp_field.dart';

/// Enter the 6-digit code. "Send me again" is available after a countdown.
class VerificationView extends StatefulWidget {
  const VerificationView({super.key});

  @override
  State<VerificationView> createState() => _VerificationViewState();
}

class _VerificationViewState extends State<VerificationView> {
  static const int _codeLength = 6;
  static const int _resendSeconds = 42;

  String _code = '';
  int _seconds = _resendSeconds;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  /// Does not call setState; wrap it in `setState(_startTimer)` when needed.
  void _startTimer() {
    _timer?.cancel();
    _seconds = _resendSeconds;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() => _seconds--);
      if (_seconds <= 0) timer.cancel();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _confirm() {
    // TODO: verify the code with the API. For now any 6 digits are accepted.
    Navigator.of(context).pushReplacement(fadeRoute(const VerifiedView()));
  }

  @override
  Widget build(BuildContext context) {
    final canConfirm = _code.length == _codeLength;
    final canResend = _seconds <= 0;

    return AuthPage(
      bottom: canResend
          ? TextButton(
              onPressed: () => setState(_startTimer),
              child: const Text('Send me again'),
            )
          : Text(
              'Send me again\n$_seconds seconds',
              textAlign: TextAlign.center,
              style: AppTextStyles.bodySmall
                  .copyWith(color: AppColors.textSecondary),
            ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(height: context.h(16)),
          const Text(
            'Verification',
            textAlign: TextAlign.center,
            style: AppTextStyles.title,
          ),
          SizedBox(height: context.h(48)),
          Text(
            'Enter your code please',
            style: AppTextStyles.bodySmall
                .copyWith(color: AppColors.textSecondary),
          ),
          SizedBox(height: context.h(12)),
          OtpField(
            length: _codeLength,
            onChanged: (value) => setState(() => _code = value),
          ),
          SizedBox(height: context.h(40)),
          ElevatedButton(
            onPressed: canConfirm ? _confirm : null,
            child: const Text('Confirm'),
          ),
          SizedBox(height: context.h(24)),
        ],
      ),
    );
  }
}
