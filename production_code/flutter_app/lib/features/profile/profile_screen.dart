import 'package:flutter/material.dart';
import '../../core/constants.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('👤 मेरो नागरिक विवरण (Citizen Identity)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundColor: AppColors.primaryBlue,
              child: Text('श', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 12),
            const Text(
              'शरण कुमार देवकोटा',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            const Text(
              'Phone: 98451XXXXX',
              style: TextStyle(fontSize: 14, color: AppColors.textGrey),
            ),
            const SizedBox(height: 24),

            // Citizenship Info Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'सत्यापन सूचकांक (Identity Levels)',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    _buildIdentityStep('📱 Level 1: Phone Code Verified', true),
                    _buildIdentityStep('🪪 Level 2: Citizenship (नागरिकता) Verified', false),
                    _buildIdentityStep('🏔️ Level 3: Ward Community Verified', false),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(12),
                      color: Colors.amber.shade50,
                      child: const Text(
                        'Reputation Point Index: 10 / 100 🌟\n(छिमेकीले विश्वास गर्ने नम्बर सूचकांक)',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.orange),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIdentityStep(String label, bool completed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Icon(
            completed ? Icons.check_circle : Icons.radio_button_unchecked,
            color: completed ? AppColors.farmGreen : Colors.grey,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: completed ? FontWeight.bold : FontWeight.normal,
                color: completed ? AppColors.textDark : Colors.grey,
              ),
            ),
          )
        ],
      ),
    );
  }
}
