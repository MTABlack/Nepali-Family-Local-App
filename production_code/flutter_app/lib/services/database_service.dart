import 'package:flutter/foundation.dart';

class DatabaseService with ChangeNotifier {
  // Collection queues structures
  final List<Map<String, dynamic>> _mockHelpRequests = [
    {
      'id': 'hlp_1',
      'contactName': 'दुर्गा प्रसाद',
      'contactPhone': '9841234567',
      'title': 'कालीगण्डकी अस्पतालको लागि O- नेगेटिभ रगत आवश्यक',
      'description': 'बिरामी आपतकालिन कक्षमा हुनुहुन्छ। ४ पिन्ट ओ नेगेटिभ रगतको तत्काल आवश्यकता छ।',
      'urgency': 'critical',
      'district': 'Kaski',
      'createdAt': '2026-06-08T12:00:00Z',
    },
    {
      'id': 'hlp_2',
      'contactName': 'राजन दाहाल',
      'contactPhone': '9807654321',
      'title': 'बाढीपछिको पहिरोले सडक अवरुद्ध - स्वयंसेवक सहयोग',
      'description': 'सिदार्थ राजमार्ग सफा गर्न र प्राथमिक राहत सामान बोक्न १० जना युवा स्वयंसेवक आवश्यक।',
      'urgency': 'high',
      'district': 'Syangja',
      'createdAt': '2026-06-08T14:30:00Z',
    }
  ];

  final List<Map<String, dynamic>> _mockMarketItems = [
    {
      'id': 'mkt_1',
      'sellerName': 'कमला घिमिरे',
      'sellerPhone': '9812345600',
      'title': 'अर्गानिक टमाटर विउ साटासाट',
      'description': 'हाम्रो कृषि फार्ममा उत्पादित शुद्ध अर्गानिक टमाटर विउ मकैको विउसँग साट्न चाहन्छु।',
      'price_tag': 'साटासाट (Barter)',
      'district': 'Jhapa',
    }
  ];

  List<Map<String, dynamic>> get helpRequests => _mockHelpRequests;
  List<Map<String, dynamic>> get marketItems => _mockMarketItems;

  Future<void> submitHelpRequest(Map<String, dynamic> request) async {
    // In production, this maps to Firestore Firebase integration:
    // FirebaseFirestore.instance.collection('help_requests').add(request);
    _mockHelpRequests.insert(0, request);
    notifyListeners();
  }

  Future<void> submitMarketItem(Map<String, dynamic> item) async {
    _mockMarketItems.insert(0, item);
    notifyListeners();
  }
}
