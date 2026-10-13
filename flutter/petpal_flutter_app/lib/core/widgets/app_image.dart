import 'package:flutter/material.dart';

import '../constants/app_colors.dart';

/// One widget for every image in the app (asset or network).
///
/// - `source` starting with `http` is loaded from the network, anything else
///   is an asset path (use `AppAssets.*`).
/// - Shows a spinner while a network image loads and a paw placeholder if the
///   image is missing or fails, so a bad URL or a not-yet-exported asset never
///   breaks a screen.
///
/// ```dart
/// AppImage(AppAssets.logo, width: 120);
/// AppImage(vet.photoUrl, width: 64, height: 64, circular: true);
/// AppImage(pet.photoUrl, borderRadius: BorderRadius.circular(12));
/// ```
class AppImage extends StatelessWidget {
  const AppImage(
    this.source, {
    super.key,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.circular = false,
  });

  final String source;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  /// Clips the image to a circle (vet avatars).
  final bool circular;

  bool get _isNetwork => source.startsWith('http');

  @override
  Widget build(BuildContext context) {
    final Widget image = _isNetwork
        ? Image.network(
            source,
            width: width,
            height: height,
            fit: fit,
            loadingBuilder: (context, child, progress) =>
                progress == null ? child : _placeholder(loading: true),
            errorBuilder: (context, error, stackTrace) => _placeholder(),
          )
        : Image.asset(
            source,
            width: width,
            height: height,
            fit: fit,
            errorBuilder: (context, error, stackTrace) => _placeholder(),
          );

    if (circular) return ClipOval(child: image);
    if (borderRadius != null) {
      return ClipRRect(borderRadius: borderRadius!, child: image);
    }
    return image;
  }

  Widget _placeholder({bool loading = false}) {
    return Container(
      width: width,
      height: height,
      color: AppColors.primaryLight,
      alignment: Alignment.center,
      child: loading
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : const Icon(Icons.pets, color: AppColors.primary),
    );
  }
}
