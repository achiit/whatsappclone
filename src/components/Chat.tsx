import React, { useEffect } from 'react';
import { MessageSquare, Phone, Video, Search, MoreVertical, Menu } from 'lucide-react';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('http://localhost:3001');

const Chat: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    chats, 
    activeChat, 
    messages, 
    loadChats, 
    loadMessages, 
    sendMessage, 
    setActiveChat,
    addMessage 
  } = useChatStore();

  useEffect(() => {
    loadChats();

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (message) => {
      addMessage(message);
      if (message.sender._id !== user?._id) {
        toast.success(`New message from ${message.sender.name}`);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat._id);
    }
  }, [activeChat]);

  const handleChatSelect = (chat: any) => {
    setActiveChat(chat);
  };

  const handleSendMessage = async (text: string) => {
    if (activeChat) {
      await sendMessage(activeChat._id, text);
      socket.emit('message', {
        chatId: activeChat._id,
        text,
        receiverId: activeChat.participants.find(p => p._id !== user?._id)?._id
      });
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-xl shadow-lg flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-[350px] bg-white border-r ${activeChat ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{user?.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Menu className="w-5 h-5 cursor-pointer" />
              <MessageSquare className="w-5 h-5 cursor-pointer" />
              <MoreVertical className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
          
          <ChatList onChatSelect={handleChatSelect} />
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
                <div className="flex items-center space-x-4">
                  <img
                    src={activeChat.participants.find(p => p._id !== user?._id)?.avatar}
                    alt="Chat Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {activeChat.participants.find(p => p._id !== user?._id)?.name}
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <Video className="w-5 h-5 cursor-pointer" />
                  <Phone className="w-5 h-5 cursor-pointer" />
                  <Search className="w-5 h-5 cursor-pointer" />
                  <MoreVertical className="w-5 h-5 cursor-pointer" />
                </div>
              </div>

              <ChatMessages messages={messages} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">Welcome to WhatsChat</h3>
                <p className="text-gray-500 mt-2">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;