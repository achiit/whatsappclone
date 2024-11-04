import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import useAuthStore from '../store/useAuthStore';
import { format } from 'date-fns';

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f0f2f5] p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender._id === user?._id
                  ? 'bg-green-100 rounded-tr-none'
                  : 'bg-white rounded-tl-none'
              }`}
            >
              <p className="text-gray-800">{message.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <p className="text-xs text-gray-500">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </p>
                {message.sender._id === user?._id && (
                  <span className="text-xs text-gray-500">
                    {message.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;