import React from 'react';
import { User, Chat } from '../types';
import useChatStore from '../store/useChatStore';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { chats, activeChat } = useChatStore();

  return (
    <div className="overflow-y-auto h-[calc(100%-120px)]">
      {chats.map((chat) => {
        const otherParticipant = chat.participants[1];
        return (
          <div
            key={chat._id}
            onClick={() => onChatSelect(chat)}
            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b
              ${activeChat?._id === chat._id ? 'bg-gray-50' : ''}`}
          >
            <img 
              src={otherParticipant.avatar} 
              alt={otherParticipant.name} 
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{otherParticipant.name}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage?.text || 'Start a conversation'}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;