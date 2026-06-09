import { create } from 'zustand';
import { authService } from '../services/auth.service';

const useAuthStore = create((set) => ({
  user: { firstName: 'Demo', lastName: 'User', role: 'owner' },
  accessToken: 'mock-token',
  isAuthenticated: true,
  isInitialized: true,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    const { data } = await authService.login(credentials);
    const { accessToken, user } = data.data;
    localStorage.setItem('accessToken', accessToken);
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
    return user;
  },

  logout: async () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const { data } = await authService.getMe();
    set({ user: data.data.user, isAuthenticated: true });
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
