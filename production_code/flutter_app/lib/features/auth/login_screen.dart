import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  bool _otpSent = false;
  String _language = 'np';

  void _handleSendOtp(AuthService auth) async {
    final phone = _phoneController.text.trim();
    if (phone.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('कृपया १० अंकको सही नेपाली नम्बर राख्नुहोस्।')),
      );
      return;
    }
    
    final success = await auth.sendOtp(phone);
    if (success) {
      setState(() {
        _otpSent = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Verification OTP code sent: (MOCK: 123456)')),
      );
    }
  }

  void _handleVerifyOtp(AuthService auth) async {
    final code = _otpController.text.trim();
    final verified = await auth.verifyOtp(code);
    if (verified) {
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('त्रुटि: कोड मिलेन।')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('🇳🇵', style: TextStyle(fontSize: 60)),
                const SizedBox(height: 12),
                const Text(
                  'नेपाली परिवार',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryBlue,
                  ),
                ),
                const Text(
                  'Ek Nepal, Ek Family',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textGrey,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 30),

                // Language toggle selectors tabs
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ChoiceChip(
                      label: const Text('नेपाली', style: TextStyle(fontWeight: FontWeight.bold)),
                      selected: _language == 'np',
                      selectedColor: AppColors.primaryBlue,
                      textColor: _language == 'np' ? Colors.white : Colors.black,
                      onSelected: (val) => setState(() => _language = 'np'),
                    ),
                    const SizedBox(width: 12),
                    ChoiceChip(
                      label: const Text('English', style: TextStyle(fontWeight: FontWeight.bold)),
                      selected: _language == 'en',
                      selectedColor: AppColors.primaryBlue,
                      textColor: _language == 'en' ? Colors.white : Colors.black,
                      onSelected: (val) => setState(() => _language = 'en'),
                    ),
                  ],
                ),
                const SizedBox(height: 40),

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        if (!_otpSent) ...[
                          Text(
                            _language == 'np' ? 'आफ्नो मोबाइल नम्बर राख्नुहोस्:' : 'Enter your mobile number:',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            maxLength: 10,
                            decoration: const InputDecoration(
                              hintText: '98XXXXXXXX',
                              border: OutlineInputBorder(),
                            ),
                          ),
                          const SizedBox(height: 16),
                          auth.isLoading
                              ? const Center(child: CircularProgressIndicator())
                              : ElevatedButton(
                                  onPressed: () => _handleSendOtp(auth),
                                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryBlue),
                                  child: Text(_language == 'np' ? 'एसएमएस कोड पठाउनुहोस्' : 'Send Code'),
                                ),
                        ] else ...[
                          Text(
                            _language == 'np' ? '६-अंकको कोड प्रविष्ट गर्नुहोस्:' : 'Enter 6-digit OTP:',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            controller: _otpController,
                            keyboardType: TextInputType.number,
                            maxLength: 6,
                            decoration: const InputDecoration(
                              hintText: '123456',
                              border: OutlineInputBorder(),
                            ),
                          ),
                          const SizedBox(height: 16),
                          auth.isLoading
                              ? const Center(child: CircularProgressIndicator())
                              : ElevatedButton(
                                  onPressed: () => _handleVerifyOtp(auth),
                                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.farmGreen),
                                  child: Text(_language == 'np' ? 'सत्यापन गरि साइन-इन गर्नुहोस्' : 'Verify & Sign In'),
                                ),
                          const SizedBox(height: 10),
                          TextButton(
                            onPressed: () => setState(() => _otpSent = false),
                            child: Text(
                              _language == 'np' ? 'नम्बर परिवर्तन गर्नुहोस्' : 'Change number',
                              style: const TextStyle(color: AppColors.accentBlue),
                            ),
                          )
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
