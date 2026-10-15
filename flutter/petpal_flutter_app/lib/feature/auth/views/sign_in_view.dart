import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/constants/app_assets.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/core/navigation/fade_route.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';
import 'package:petpal_flutter_app/core/utils/validators.dart';
import 'package:petpal_flutter_app/core/widgets/app_image.dart';
import 'package:petpal_flutter_app/feature/auth/views/forgot_password_view.dart';
import 'package:petpal_flutter_app/feature/auth/views/sign_up_view.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/account_prompt.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_page.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/auth_text_field.dart';
import 'package:petpal_flutter_app/feature/auth/widgets/social_buttons.dart';
import 'package:petpal_flutter_app/feature/root/root_view.dart';

class SignInView extends StatefulWidget {
  const SignInView({super.key});

  @override
  State<SignInView> createState() => _SignInViewState();
}

class _SignInViewState extends State<SignInView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    // TODO: call the login use case (Cubit) once the API is ready.
    Navigator.of(context).pushAndRemoveUntil(
      fadeRoute(const RootView()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return AuthPage(
      bottom: AccountPrompt(
        question: 'Don`t have an account?',
        action: 'Sign up',
        onTap: () => Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(builder: (_) => const SignUpView()),
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
            const Text('Login to your account', style: AppTextStyles.title),
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
              textInputAction: TextInputAction.done,
              validator: Validators.password,
              onFieldSubmitted: (_) => _submit(),
            ),
            SizedBox(height: context.h(16)),
            ElevatedButton(onPressed: _submit, child: const Text('Sign in')),
            SizedBox(height: context.h(8)),
            Row(
              children: [
                SizedBox(
                  width: 24,
                  height: 24,
                  child: Checkbox(
                    value: _rememberMe,
                    visualDensity: VisualDensity.compact,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    onChanged: (value) =>
                        setState(() => _rememberMe = value ?? false),
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  'Remember me',
                  style: AppTextStyles.caption
                      .copyWith(color: AppColors.textSecondary),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const ForgotPasswordView(),
                    ),
                  ),
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: const Text('Forgot password?'),
                ),
              ],
            ),
            SizedBox(height: context.h(32)),
            Center(
              child: Text(
                '-Or sign in with-',
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
