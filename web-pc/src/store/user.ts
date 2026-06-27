import { create } from 'zustand';

interface UserState {
  user: any | null;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  token: sessionStorage.getItem('token'),
  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    sessionStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
