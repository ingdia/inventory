import { create } from 'zustand';
import { authService } from '../services/auth.service';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isInitialized: true,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try { await authService.logout(); } catch {}
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
    set({ user: data.user ?? data });
  },

  updatePassword: async (passwords) => {
    await authService.updatePassword(passwords);
  },

  setLoading: (val) => set({ isLoading: val }),
}));

export default useAuthStore;