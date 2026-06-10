// src/features/purchases/store/purchasesStore.js
import { create } from 'zustand';

const initialFilters = {
  search: '',
  startDate: '',
  endDate: '',
  supplier: '',
  status: '',
};

const usePurchasesStore = create((set) => ({
  filters: { ...initialFilters },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: { ...initialFilters } }),
}));

export default usePurchasesStore;
