import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants.dart';
import '../../services/database_service.dart';

class MarketScreen extends StatelessWidget {
  const MarketScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DatabaseService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('🌽 हाट बजार (Marketplace)'),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.amber.shade50,
            child: Row(
              children: const [
                Text('🏡 ', style: TextStyle(fontSize: 20)),
                Expanded(
                  child: Text(
                    'आफ्नो वडामा फलेका अर्गानिक तरकारी, कृषि औजार, साटासाट तथा खरीद विक्रि गर्नुहोस्। बिचौलिया रहित हाट बजार।',
                    style: TextStyle(fontSize: 11, color: Colors.brown, height: 1.3),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: db.marketItems.length,
              itemBuilder: (context, index) {
                final item = db.marketItems[index];

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
                            Text(
                              item['title']!,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark),
                            ),
                            Text(
                              item['price_tag']!,
                              style: const TextStyle(color: AppColors.farmGreen, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          item['description']!,
                          style: const TextStyle(fontSize: 13, color: AppColors.textGrey, height: 1.4),
                        ),
                        const SizedBox(height: 12),
                        const Divider(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('सम्पर्क: ${item['sellerName']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                            Text('📍 ${item['district']}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                          ],
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }
}
