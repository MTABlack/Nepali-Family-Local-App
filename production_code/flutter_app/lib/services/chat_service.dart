import 'package:flutter/foundation.dart';

class ChatService with ChangeNotifier {
  final List<Map<String, dynamic>> _mockRooms = [
    {
      'id': 'room_ward_4',
      'name': 'कास्की वडा नं ४ साझा चौतारी',
      'lastMessage': 'रामप्रसाद: खानेपानीको ट्याङ्कर भोलि बिहान ७ बजे आउँदैछ।',
      'timestamp': '2026-06-08 22:42:00',
    },
    {
      'id': 'room_help_sos',
      'name': 'Emergency Group (SOS Kaski)',
      'lastMessage': 'वडा उद्धार समूह सक्रिय भएको छ।',
      'timestamp': '2026-06-08 22:38:00',
    }
  ];

  List<Map<String, dynamic>> get activeRooms => _mockRooms;

  Future<void> sendChatMessage(String roomId, String text, String sender) async {
    // Send to Firestore under collections rules
    notifyListeners();
  }
}
