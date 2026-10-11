import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:petpal_flutter_app/core/theme/app_text_styles.dart';

/// Row of single-digit boxes. Focus moves forward as you type and backward on
/// backspace. [onChanged] receives the digits entered so far.
class OtpField extends StatefulWidget {
  const OtpField({super.key, this.length = 6, required this.onChanged});

  final int length;
  final ValueChanged<String> onChanged;

  @override
  State<OtpField> createState() => _OtpFieldState();
}

class _OtpFieldState extends State<OtpField> {
  late final List<TextEditingController> _controllers =
      List.generate(widget.length, (_) => TextEditingController());
  late final List<FocusNode> _nodes =
      List.generate(widget.length, (_) => FocusNode());

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    for (final node in _nodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _notify() {
    widget.onChanged(_controllers.map((c) => c.text).join());
  }

  void _onChanged(int index, String value) {
    if (value.isNotEmpty && index < widget.length - 1) {
      _nodes[index + 1].requestFocus();
    }
    _notify();
  }

  KeyEventResult _onKey(int index, KeyEvent event) {
    final isBackspace = event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.backspace;
    if (isBackspace && _controllers[index].text.isEmpty && index > 0) {
      _controllers[index - 1].clear();
      _nodes[index - 1].requestFocus();
      _notify();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < widget.length; i++)
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: SizedBox(
                height: 52,
                child: Focus(
                  onKeyEvent: (node, event) => _onKey(i, event),
                  child: TextField(
                    controller: _controllers[i],
                    focusNode: _nodes[i],
                    autofocus: i == 0,
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    style: AppTextStyles.title,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(1),
                    ],
                    onChanged: (value) => _onChanged(i, value),
                    decoration: const InputDecoration(
                      counterText: '',
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
