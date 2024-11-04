import { create } from 'zustand';
import { Message, Chat, User } from '../types';
import axios from 'axios';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  setActiveChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],

  loadChats: async () => {
    try {
      const response = await axios.get('/api/chats');
      set({ chats: response.data });
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  },

  loadMessages: async (chatId: string) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  },

  sendMessage: async (chatId: string, text: string) => {
    try {
      const response = await axios.post(`/api/chats/${chatId}/messages`, { text });
      const message = response.data;
      set(state => ({
        messages: [...state.messages, message]
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  setActiveChat: (chat: Chat) => {
    set({ activeChat: chat });
  },

  addMessage: (message: Message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },
}));

export default useChatStore;