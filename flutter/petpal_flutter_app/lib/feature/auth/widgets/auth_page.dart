import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/core/responsive/responsive.dart';

/// Shared layout for the auth screens: optional teal back arrow, scrollable
/// content with responsive side padding, and an optional footer pinned to the
/// bottom (e.g. "Don't have an account? Sign up").
class AuthPage extends StatelessWidget {
  const AuthPage({
    super.key,
    required this.child,
    this.bottom,
    this.showBack = true,
  });

  final Widget child;
  final Widget? bottom;
  final bool showBack;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: showBack
          ? AppBar(
              leading: IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                onPressed: () => Navigator.of(context).maybePop(),
              ),
            )
          : null,
      body: SafeArea(
        child: ResponsiveCenter(
          maxWidth: 480,
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  keyboardDismissBehavior:
                      ScrollViewKeyboardDismissBehavior.onDrag,
                  padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
                  child: child,
                ),
              ),
              if (bottom != null)
                Padding(
                  padding: EdgeInsets.only(
                    top: context.h(8),
                    bottom: context.h(16),
                    left: context.pagePadding,
                    right: context.pagePadding,
                  ),
                  child: bottom,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
