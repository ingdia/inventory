import { useEffect, useState } from 'react';
import useInventoryStore from '../store/inventoryStore';

export function useInventory() {
  const store = useInventoryStore();
  const [filters, setFiltersLocal] = useState({ search: '', status: '', category: '' });

  useEffect(() => { store.fetchInventory(); }, []);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFiltersLocal(updated);
    store.fetchInventory({ ...updated, page: 1 });
  };

  const handlePageChange = (page) => store.fetchInventory({ ...filters, page });

  return { ...store, filters, handleFilterChange, handlePageChange };
}
