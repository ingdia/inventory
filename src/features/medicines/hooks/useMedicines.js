import { useEffect, useState } from 'react';
import useMedicineStore from '../store/medicineStore';
import { medicinesService } from '../services/medicines.service';

export function useMedicines() {
  const store = useMedicineStore();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    store.fetchMedicines();
    medicinesService.getCategories().then(({ data }) => setCategories(Array.isArray(data.data) ? data.data : data.data?.categories || [])).catch(() => {});
    medicinesService.getSuppliers().then(({ data }) => setSuppliers(Array.isArray(data.data) ? data.data : data.data?.suppliers || [])).catch(() => {});
  }, []);

  const handleFilterChange = (key, value) => {
    store.setFilters({ [key]: value });
    store.fetchMedicines(1);
  };

  const handlePageChange = (page) => store.fetchMedicines(page);

  return { ...store, categories, suppliers, handleFilterChange, handlePageChange };
}
