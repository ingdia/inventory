import { create } from 'zustand';
import { authService } from '../services/auth.service';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.login(credentials);
      const token = data.token;
      const user = data.user;
      localStorage.setItem('token', token);
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const { data } = await authService.getMe();
    set({ user: data, isAuthenticated: true });
  },

  updateProfile: async (profileData) => {
    const { data } = await authService.updateProfile(profileData);
    set({ user: data.data.user });
    return data.data.user;
  },

  updatePassword: async (passwords) => {
    await authService.updatePassword(passwords);
  },

  setLoading: (val) => set({ isLoading: val }),
}));

export default useAuthStore;
