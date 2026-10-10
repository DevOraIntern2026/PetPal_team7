import 'package:flutter/material.dart';
import 'package:petpal_flutter_app/feature/home/views/home_view.dart';

void main(){
  runApp(MyApp());
}
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home:HomeView(),
    );
  }
}