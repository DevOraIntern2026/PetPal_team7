import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/core/utils/validators.dart';
import 'package:petpal_flutter_app/feature/auth/views/verification_view.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_page.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_text_field.dart';

class ForgotPasswordView extends StatefulWidget {
  const ForgotPasswordView({super.key});

  @override
  State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
}

class _ForgotPasswordViewState extends State<ForgotPasswordView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _send() {
    if (!_formKey.currentState!.validate()) return;
    // TODO: request the reset code from the API.
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const VerificationView()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AuthPage(
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(height: context.h(24)),
            Text(
              'Forget Password !',
              textAlign: TextAlign.center,
              style: AppTextStyles.h2.copyWith(color: AppColors.accent),
            ),
            SizedBox(height: context.h(12)),
            Text(
              "Enter your email address and we'll send you a code to reset "
              'your password.',
              textAlign: TextAlign.center,
              style: AppTextStyles.bodySmall
                  .copyWith(color: AppColors.textSecondary),
            ),
            SizedBox(height: context.h(40)),
            const Text('Email address', style: AppTextStyles.title),
            SizedBox(height: context.h(12)),
            AuthTextField(
              hint: 'Email',
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.done,
              validator: Validators.email,
              onFieldSubmitted: (_) => _send(),
            ),
            SizedBox(height: context.h(32)),
            ElevatedButton(onPressed: _send, child: const Text('Send me')),
            SizedBox(height: context.h(12)),
            OutlinedButton(
              onPressed: () => Navigator.of(context).maybePop(),
              child: const Text('Back to login'),
            ),
            SizedBox(height: context.h(24)),
          ],
        ),
      ),
    );
  }
}
