import { create } from 'zustand';
import { medicinesService } from '../services/medicines.service';
import toast from 'react-hot-toast';

const useMedicineStore = create((set, get) => ({
  medicines: [],
  loading: false,
  error: null,
  pagination: { page: 1, totalPages: 1, total: 0 },
  filters: { search: '', category: '', supplier: '', status: '', sortBy: 'createdAt', sortOrder: 'desc' },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, })),

  fetchMedicines: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const { data } = await medicinesService.getAll({ ...filters, page, limit: 10 });
      set({
        medicines: data.data.medicines,
        pagination: { page: data.data.page, totalPages: data.data.totalPages, total: data.data.total },
        loading: false,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch medicines';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  addMedicine: async (payload) => {
    const { data } = await medicinesService.create(payload);
    toast.success('Medicine added successfully');
    get().fetchMedicines(get().pagination.page);
    return data.data;
  },

  updateMedicine: async (id, payload) => {
    const { data } = await medicinesService.update(id, payload);
    toast.success('Medicine updated successfully');
    get().fetchMedicines(get().pagination.page);
    return data.data;
  },

  deleteMedicine: async (id) => {
    await medicinesService.remove(id);
    toast.success('Medicine deleted');
    get().fetchMedicines(get().pagination.page);
  },
}));

export default useMedicineStore;
