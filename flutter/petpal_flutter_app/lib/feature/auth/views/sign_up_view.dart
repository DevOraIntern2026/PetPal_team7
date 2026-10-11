import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/core/utils/validators.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';
import 'package:petpal_flutter_app/feature/auth/views/sign_in_view.dart';
import 'package:petpal_flutter_app/feature/auth/views/verification_view.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/account_prompt.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_page.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_text_field.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/social_buttons.dart';

class SignUpView extends StatefulWidget {
  const SignUpView({super.key});

  @override
  State<SignUpView> createState() => _SignUpViewState();
}

class _SignUpViewState extends State<SignUpView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _agreed = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreed) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('Please agree to the terms & conditions'),
          ),
        );
      return;
    }
    // TODO: call the register use case (Cubit) once the API is ready.
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const VerificationView()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AuthPage(
      bottom: AccountPrompt(
        question: 'already have an account?',
        action: 'sign in',
        onTap: () => Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(builder: (_) => const SignInView()),
        ),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(height: context.h(16)),
            Center(
              child: AppImage(
                AppAssets.logo,
                width: context.w(104),
                fit: BoxFit.contain,
              ),
            ),
            SizedBox(height: context.h(32)),
            const Text('Create your Account', style: AppTextStyles.title),
            SizedBox(height: context.h(16)),
            AuthTextField(
              hint: 'Email',
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              validator: Validators.email,
            ),
            SizedBox(height: context.h(14)),
            AuthTextField(
              hint: 'Password',
              controller: _passwordController,
              isPassword: true,
              validator: Validators.password,
            ),
            SizedBox(height: context.h(14)),
            AuthTextField(
              hint: 'Confirm password',
              controller: _confirmController,
              isPassword: true,
              textInputAction: TextInputAction.done,
              validator: Validators.confirmPassword(_passwordController),
              onFieldSubmitted: (_) => _submit(),
            ),
            SizedBox(height: context.h(16)),
            ElevatedButton(onPressed: _submit, child: const Text('Sign up')),
            SizedBox(height: context.h(8)),
            Row(
              children: [
                SizedBox(
                  width: 24,
                  height: 24,
                  child: Checkbox(
                    value: _agreed,
                    visualDensity: VisualDensity.compact,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    onChanged: (value) =>
                        setState(() => _agreed = value ?? false),
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  'I agree to terms & conditions',
                  style: AppTextStyles.caption
                      .copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
            SizedBox(height: context.h(28)),
            Center(
              child: Text(
                '-Or sign up with-',
                style: AppTextStyles.bodySmall
                    .copyWith(color: AppColors.textSecondary),
              ),
            ),
            SizedBox(height: context.h(16)),
            const SocialIconRow(),
            SizedBox(height: context.h(24)),
          ],
        ),
      ),
    );
  }
}
