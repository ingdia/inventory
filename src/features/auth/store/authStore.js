import { create } from 'zustand';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isInitialized: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.login(credentials);
      const token = data.token;
      const user = data.user;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try { await authService.logout(); } catch { /* silent */ }
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const { data } = await authService.getMe();
      set({ user: data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateProfile: async (profileData) => {
    const { data } = await authService.updateProfile(profileData);
    const user = data.user ?? data;
    set({ user });
    return user;
  },

  updatePassword: async (passwords) => {
    await authService.updatePassword(passwords);
  },

  setLoading: (val) => set({ isLoading: val }),
}));

export default useAuthStore;
