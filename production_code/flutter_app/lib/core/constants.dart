import 'package:flutter/material.dart';

class AppColors {
  // Primary Trust Colors
  static const Color primaryBlue = Color(0xFF1E3A8A); // Deep Navy Blue
  static const Color accentBlue = Color(0xFF2563EB);  // Dynamic Blue
  static const Color backgroundLight = Color(0xFFF9FAFB);
  static const Color white = Color(0xFFFFFFFF);
  
  // Emergency Red
  static const Color emergencyRed = Color(0xFFDC2626);
  
  // Agricultural / Success Green
  static const Color farmGreen = Color(0xFF059669);
  
  // Warning Warm Amber
  static const Color warningAmber = Color(0xFFFBBF24);
  
  // Descriptive Text Shades
  static const Color textDark = Color(0xFF111827);
  static const Color textGrey = Color(0xFF4B5563);
  static const Color borderGrey = Color(0xFFE5E7EB);
}

class AppTextStyles {
  static const TextStyle nepaliHeading = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: AppColors.textDark,
    fontFamily: 'Roboto',
  );

  static const TextStyle nepaliSubheading = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: AppColors.textGrey,
  );

  static const TextStyle bodyText = TextStyle(
    fontSize: 13,
    color: AppColors.textGrey,
  );
}

const List<String> nepalProvinces = [
  'Koshi Province',
  'Madesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province',
];

const Map<String, List<String>> provinceDistricts = {
  'Gandaki Province': ['Kaski', 'Mustang', 'Myagdi', 'Baglung', 'Parbat', 'Gorkha', 'Tanahun', 'Syangja', 'Lamjung', 'Manang', 'Nawalpur'],
  'Koshi Province': ['Jhapa', 'Morang', 'Sunsari', 'Udayapur', 'Dhankuta', 'Ilam', 'Panchthar', 'Taplejung', 'Sankhuwasabha', 'Bhojpur', 'Okhaldhunga', 'Khotang', 'Solukhumbu', 'Terhathum'],
  'Bagmati Province': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Kavrepalanchok', 'Makwanpur', 'Dhading', 'Nuwakot', 'Sindhupalchok', 'Ramechhap', 'Sindhuli', 'Dolakha', 'Rasuwa'],
};
