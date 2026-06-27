 import { create } from 'zustand';
 
 interface UserState {
   user: any | null;
   token: string | null;
   setUser: (user: any) => void;
   setToken: (token: string) => void;
   logout: () => void;
 }
 
 export const useUserStore = create<UserState>((set) => ({
   user: null,
   token: localStorage.getItem('token'),
   setUser: (user) => set({ user }),
   setToken: (token) => {
     localStorage.setItem('token', token);
     set({ token });
   },
   logout: () => {
     localStorage.removeItem('token');
     set({ user: null, token: null });
   },
 }));
