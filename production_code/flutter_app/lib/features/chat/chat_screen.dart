import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants.dart';
import '../../services/chat_service.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chat = Provider.of<ChatService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('💬 चौतारी समूह (Chautari Chats)'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: chat.activeRooms.length,
        separatorBuilder: (context, index) => const Divider(),
        itemBuilder: (context, index) {
          final room = chat.activeRooms[index];

          return ListTile(
            leading: const CircleAvatar(
              backgroundColor: AppColors.primaryBlue,
              child: Text('🏔️', style: TextStyle(fontSize: 18)),
            ),
            title: Text(
              room['name']!,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 4.0),
              child: Text(
                room['lastMessage']!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12, color: AppColors.textGrey),
              ),
            ),
            trailing: Text(
              room['timestamp']!.substring(11, 16),
              style: const TextStyle(fontSize: 10, color: Colors.grey),
            ),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${room['name']} खोलिदै छ...')),
              );
            },
          );
        },
      ),
    );
  }
}
