// src/features/sales/store/salesStore.js
import { create } from 'zustand';

const initialFilters = {
  search: '',
  startDate: '',
  endDate: '',
  paymentMethod: '',
  status: '',
  soldBy: '',
};

const useSalesStore = create((set) => ({
  filters: { ...initialFilters },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: { ...initialFilters } }),
}));

export default useSalesStore;
