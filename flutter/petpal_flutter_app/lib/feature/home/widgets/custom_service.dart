
import 'package:flutter/cupertino.dart';
import 'package:gap/gap.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';

class CustomService extends StatelessWidget {
  const CustomService({
    super.key, required this.text, required this.image,
  });
final String text;
final String image;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12.0),
      child: Column(
        children: [
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(30),
              
            ),
            child:Image.asset(image,width: 200,height: 200,) ,),
            Gap(5),
            Text(text,style: TextStyle(fontWeight: FontWeight.bold),)
        ],
      ),
    );
  }
}