import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:petpal_flutter_app/core/constants/app_colors.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
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
              Icon(Icons.notifications,size: 30,)
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0,vertical: 12),
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
              )
            ],
          ),
        ),
      ),
    );
  }
}