import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      
      set({ token, user: decoded });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      
      set({ token, user: decoded });
    } catch (error) {
      throw error;
    }
  },
}));

export default useAuthStore;