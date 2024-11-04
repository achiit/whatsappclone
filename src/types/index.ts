export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  status?: 'online' | 'offline';
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Chat {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}