import 'package:flutter/foundation.dart';

class AuthService with ChangeNotifier {
  bool _isLoading = false;
  bool _isLoggedIn = false;
  String? _userId;
  String? _phone;

  bool get isLoading => _isLoading;
  bool get isLoggedIn => _isLoggedIn;
  String? get userId => _userId;
  String? get phone => _phone;

  // Stubs for Firebase Phone Authentication OTP verification
  Future<bool> sendOtp(String mobileNumber) async {
    _isLoading = true;
    notifyListeners();
    
    // Simulate minor network travel delay (offline compatible state defaults)
    await Future.delayed(const Duration(seconds: 1));
    _phone = mobileNumber;
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> verifyOtp(String smsCode) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));
    if (smsCode == "123456" || smsCode == "654321") {
      _isLoggedIn = true;
      _userId = "usr_nepal_${_phone ?? '9841'}_${DateTime.now().millisecondsSinceEpoch}";
      _isLoading = false;
      notifyListeners();
      return true;
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  void logout() {
    _isLoggedIn = false;
    _userId = null;
    _phone = null;
    notifyListeners();
  }
}
