import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants.dart';
import '../../services/database_service.dart';

class HelpScreen extends StatelessWidget {
  const HelpScreen({Key? key}) : super(key: key);

  void _callContact(String phone) async {
    final Uri callUri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(callUri)) {
      await launchUrl(callUri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DatabaseService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('❤️ गुहार केन्द्र (Guhar Hub)'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: db.helpRequests.length,
        itemBuilder: (context, index) {
          final req = db.helpRequests[index];
          final bool isCritical = req['urgency'] == 'critical';

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isCritical ? const Color(0xFFFEE2E2) : const Color(0xFFD1FAE5),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          isCritical ? 'CRITICAL (आपतकाल)' : 'NORMAL',
                          style: TextStyle(
                            color: isCritical ? AppColors.emergencyRed : AppColors.farmGreen,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Text('📍 ${req['district']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    req['title']!,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    req['description']!,
                    style: const TextStyle(fontSize: 13, color: AppColors.textGrey, height: 1.4),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        'dispatcher: ${req['contactName']}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blueGrey),
                      ),
                      ElevatedButton.icon(
                        onPressed: () => _callContact(req['contactPhone']!),
                        icon: const Icon(Icons.phone, size: 14),
                        label: const Text('कल गर्नुहोस्'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.accentBlue,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        ),
                      )
                    ],
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
