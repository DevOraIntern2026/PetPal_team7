import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';
import 'package:petpal_flutter_app/feature/home/widgets/adoption_banner.dart';
import 'package:petpal_flutter_app/feature/home/widgets/article/articles_section.dart';
import 'package:petpal_flutter_app/feature/home/widgets/custom_service.dart';
import 'package:petpal_flutter_app/feature/home/widgets/mood/mood_section.dart';
import 'package:petpal_flutter_app/feature/home/widgets/popular/popular_section.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Row(
            children: [
              Row(
                children: [
                  Text("Pet ",style: TextStyle(color: AppColors.primary,fontWeight: FontWeight.bold,fontSize: 24),),
                  Text("mate",style: TextStyle(color: AppColors.primary,),),
                ],
              ),
              Spacer(),
              Image.asset("assets/Icons/ai_Icon.png",
              color: Colors.black,width: 30,),
              Gap(5),
              Icon(Icons.notifications,size: 30,color: Colors.black,)
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0,vertical: 12),
          child: SingleChildScrollView(
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                    ),
                    Gap(10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Hi ,Nadeen",
                        style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold),
                  
                        ),
                        Text("Egypt")
                      ],
                    )
                  ],
                ),
                Gap(20),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5.0),
                  child: TextField(
                    decoration: InputDecoration(
                      prefixIcon: Icon(Icons.search),
                      hintText: "search for pets,vets,products....",
                      
                      border: OutlineInputBorder(
                        
                        
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide(
                          color: AppColors.primary,
                        ),
                        
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide(
                          color: AppColors.primary
                        )
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide(
                          
                          color: AppColors.primary
                        )
                      ),
                    ),
                  ),
                ),
            
                Gap(15),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      CustomService(image: "assets/Services/store.png",text: "Pet Shop",),
                      CustomService(image: "assets/Services/paw-print.png",text: "Adoption",),
                      CustomService(image: "assets/Services/stethoscope.png",text: "Vets",),
                      CustomService(image: "assets/Services/users-round.png",text: "Community",)
                    ]
                    
                  ),
                ),
                Gap(20),
                AdoptionBanner(),
                Gap(20),
                ArticlesSection(),
                PopularSection(),
                Gap(20),
                MoodSection(),
                Gap(200),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
