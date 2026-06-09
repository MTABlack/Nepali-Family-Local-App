import 'package:flutter/material.dart';
import '../../core/constants.dart';

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> posts = [
      {
        'title': 'वडा नं ४ खानेपानी आपूर्ति समयतालिका परिवर्तन',
        'content': 'विहान ट्याङ्की मर्मत कार्य हुने भएकाले पानी वितरण भोलि विहान १० बजेदेखि हुने व्यहोरा सूचित गरिन्छ।',
        'author': 'हरिप्रसाद बराल (वडा अध्यक्ष)',
        'date': '2 घंटे पहिले',
        'geo': 'Gandaki • Kaski'
      },
      {
        'title': 'सडक मर्मत संबन्धी आकस्मिक सूचना',
        'content': 'भैरव मार्ग कालोपत्रे मर्मत गर्नुपर्ने भएकोले २ दिन सवारी साधन चलाउन बन्द गरिएको छ।',
        'author': 'स्थानीय सडक निर्माण समिति',
        'date': '५ घंटे पहिले',
        'geo': 'Gandaki • Kaski'
      }
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('📢 चौतारी साझा सन्देश (Bulletins)'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: posts.length,
        itemBuilder: (context, index) {
          final post = posts[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          post['geo']!,
                          style: const TextStyle(color: Color(0xFF78350F), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Text(post['date']!, style: const TextStyle(color: Colors.grey, fontSize: 11)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    post['title']!,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    post['content']!,
                    style: const TextStyle(fontSize: 13, color: AppColors.textGrey, height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'प्रकाशक: ${post['author']}',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.thumb_up_alt_outlined, size: 18),
                            onPressed: () {},
                          ),
                          const Text('१२ वटा समर्थहरु'),
                        ],
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
