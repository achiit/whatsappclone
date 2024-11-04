import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-t">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Smile className="w-6 h-6 cursor-pointer" />
          <Paperclip className="w-6 h-6 cursor-pointer" />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 bg-white rounded-lg focus:outline-none"
        />
        <Send
          className={`w-6 h-6 cursor-pointer ${
            message.trim() ? 'text-green-500' : 'text-gray-400'
          }`}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default MessageInput;