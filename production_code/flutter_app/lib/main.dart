import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/constants.dart';
import 'core/theme.dart';
import 'core/routes.dart';

import 'services/auth_service.dart';
import 'services/database_service.dart';
import 'services/chat_service.dart';

import 'features/auth/login_screen.dart';
import 'features/home/home_screen.dart';
import 'features/community/community_screen.dart';
import 'features/help_center/help_screen.dart';
import 'features/marketplace/market_screen.dart';
import 'features/chat/chat_screen.dart';
import 'features/profile/profile_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Call Firebase.initializeApp() in production once config files are placed
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => DatabaseService()),
        ChangeNotifierProvider(create: (_) => ChatService()),
      ],
      child: const NepaliFamilyApp(),
    ),
  );
}

class NepaliFamilyApp extends StatelessWidget {
  const NepaliFamilyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nepali Family Local App',
      theme: AppThemes.lightTheme,
      initialRoute: AppRoutes.splash,
      routes: {
        AppRoutes.splash: (context) => const SplashScreen(),
        AppRoutes.login: (context) => const LoginScreen(),
        AppRoutes.home: (context) => const MainTabBarSkeleton(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

// 1. Initial Splash Screen
class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNext();
  }

  void _navigateToNext() async {
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      final auth = Provider.of<AuthService>(context, listen: false);
      if (auth.isLoggedIn) {
        Navigator.pushReplacementNamed(context, AppRoutes.home);
      } else {
        Navigator.pushReplacementNamed(context, AppRoutes.login);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryBlue,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text('🏔️', style: TextStyle(fontSize: 80)),
            SizedBox(height: 20),
            Text(
              'नेपाली परिवार',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Sajha Chautari - Local Ward Utility Network',
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
            SizedBox(height: 48),
            CircularProgressIndicator(color: Colors.white),
          ],
        ),
      ),
    );
  }
}

// 2. Bottom Navigation Tab Bar Wrapper Shell
class MainTabBarSkeleton extends StatefulWidget {
  const MainTabBarSkeleton({Key? key}) : super(key: key);

  @override
  _MainTabBarSkeletonState createState() => _MainTabBarSkeletonState();
}

class _MainTabBarSkeletonState extends State<MainTabBarSkeleton> {
  int _currentIndex = 0;

  void _onTriggerSos() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('🚨 आकस्मिक गुहार चेतावनी (SOS Alert)'),
        content: const Text(
          'के तपाईं वडा कार्यालय र नजिकका ५० जना छिमेकीहरूलाई आफ्नो स्थानसहित आकस्मिक सहायता सन्देश पठाउन चाहनुहुन्छ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('रद्द गर्नुहोस् (Cancel)'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('SOS संदेश पठाइयो! छिमेकी र उद्धार समूह सूचित भएका छन्।'),
                  backgroundColor: AppColors.emergencyRed,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.emergencyRed),
            child: const Text('पठाउनुहोस् (Send SOS)'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      HomeScreen(
        onTriggerSos: _onTriggerSos,
        onTabChange: (tab) {
          int index = 0;
          if (tab == 'help') index = 2;
          if (tab == 'market') index = 3;
          if (tab == 'chat') index = 4;
          setState(() => _currentIndex = index);
        },
      ),
      const CommunityScreen(),
      const HelpScreen(),
      const MarketScreen(),
      const ChatScreen(),
    ];

    return Scaffold(
      appBar: _currentIndex == 0
          ? AppBar(
              title: const Text('⛰️ नेपाली परिवार'),
              actions: [
                IconButton(
                  icon: const Icon(Icons.emergency, color: Colors.redAccent),
                  onPressed: _onTriggerSos,
                ),
                IconButton(
                  icon: const Icon(Icons.person),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const ProfileScreen()),
                    );
                  },
                )
              ],
            )
          : null, // Sub-views handle their own AppBars with specific action button sets
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Text('🏠', style: TextStyle(fontSize: 18)), label: 'गृह (Home)'),
          BottomNavigationBarItem(icon: Text('📢', style: TextStyle(fontSize: 18)), label: 'चौतारी (Feed)'),
          BottomNavigationBarItem(icon: Text('❤️', style: TextStyle(fontSize: 18)), label: 'गुहार (Help)'),
          BottomNavigationBarItem(icon: Text('🌽', style: TextStyle(fontSize: 18)), label: 'हाट (Market)'),
          BottomNavigationBarItem(icon: Text('💬', style: TextStyle(fontSize: 18)), label: 'सन्देश (Chat)'),
        ],
      ),
    );
  }
}
