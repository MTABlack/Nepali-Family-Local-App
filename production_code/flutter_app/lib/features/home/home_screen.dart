import 'package:flutter/material.dart';
import '../../core/constants.dart';

class HomeScreen extends StatelessWidget {
  final VoidCallback onTriggerSos;
  final Function(String) onTabChange;

  const HomeScreen({
    Key? key,
    required this.onTriggerSos,
    required this.onTabChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        // Top Citizen Profile Status
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderGrey),
          ),
          child: Row(
            children: [
              const CircleAvatar(
                backgroundColor: AppColors.primaryBlue,
                radius: 25,
                child: Text('श', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('शरण कुमार देवकोटा', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                    SizedBox(height: 4),
                    Text('Level 1 Verified Citizen • वडा नं ४, कास्की', style: TextStyle(fontSize: 12, color: AppColors.textGrey)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Emergency SOS Quick Dispatch Callouts Action Button
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: const Color(0xFFFEE2E2),
            border: Border.all(color: const Color(0xFFFCA5A5)),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              const Text(
                '🚨 आपतकालिन सेवा (Emergency SOS)',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.emergencyRed),
              ),
              const SizedBox(height: 8),
              const Text(
                'के तपाईलाई कुनै गम्भिर समस्या आइपरेको छ? छिमेकी र वडा उद्धार टोलीलाई तुरुन्त स्थान सहित खबर गर्नुहोस्।',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: AppColors.textDark),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: onTriggerSos,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.emergencyRed,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                child: const Text('गुहार पठाउनुहोस् (Activate SOS)'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Quick Modules Grid selectors tiles
        const Text(
          'द्रुत सुविधाहरू (Quick Access Modules)',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark),
        ),
        const SizedBox(height: 12),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 3,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          children: [
            _buildGridTile('❤️', 'गुहार केन्द्र', () => onTabChange('help')),
            _buildGridTile('🌽', 'हाट बजार', () => onTabChange('market')),
            _buildGridTile('💬', 'चौतारी चौतारी', () => onTabChange('chat')),
          ],
        ),
        const SizedBox(height: 20),

        // Adaptive Low-Data cache indicator
        Container(
          padding: const EdgeInsets.all(15.0),
          decoration: BoxDecoration(
            color: const Color(0xFFEBF5FF),
            borderRadius: BorderRadius.circular(12),
            border: const Border(left: BorderSide(color: AppColors.accentBlue, width: 4)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('⚡ कम डाटा खपत मोड (Low-Data Mode Active)', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
              SizedBox(height: 4),
              Text(
                'ग्रामीण र हिमाली भेगमा इन्टरनेट कमजोर हुँदा पनि यो एप सहजै चल्नेछ। महत्वपूर्ण तथ्याङ्कहरू लोकल मेमोरीमा सुरक्षित रहन्छन्।',
                style: TextStyle(fontSize: 11, color: AppColors.textGrey, height: 1.4),
              ),
            ],
          ),
        )
      ],
    );
  }

  Widget _buildGridTile(String emoji, String title, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Card(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 26)),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
          ],
        ),
      ),
    );
  }
}
