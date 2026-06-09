import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { useMedicines } from './hooks/useMedicines';
import MedicineTable from './components/MedicineTable';
import MedicineFilters from './components/MedicineFilters';
import MedicineForm from './components/MedicineForm';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Pagination from '../../shared/components/Pagination';
import Button from '../../shared/components/Button';
import EmptyState from '../../shared/components/EmptyState';
import { exportMedicinesToCSV } from './utils/medicine.utils';
import { inventoryService } from '../inventory/services/inventory.service';
import { getMedicines } from './services/medicines.service';

export default function MedicinesPage() {
  const {
    medicines, loading, pagination, filters,
    categories, suppliers,
    handleFilterChange, handlePageChange,
    addMedicine, updateMedicine, deleteMedicine,
    setFilters, fetchMedicines,
  } = useMedicines();

  // TEMP TEST
  useEffect(() => {
    getMedicines()
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [inventoryMap, setInventoryMap] = useState({});

  useEffect(() => {
    inventoryService.getAll({ limit: 1000 })
      .then(({ data }) => {
        const map = {};
        (data.data?.inventory || []).forEach((item) => {
          if (item.medicine?._id) map[item.medicine._id] = item.quantity;
        });
        setInventoryMap(map);
      })
      .catch(() => {});
  }, [medicines]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (med) => { setEditing(med); setFormOpen(true); };
  const closeForm = () => { setEditing(null); setFormOpen(false); };

  const handleSort = (key) => {
    const order = filters.sortBy === key && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters({ sortBy: key, sortOrder: order });
    fetchMedicines(1);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      editing?._id ? await updateMedicine(editing._id, data) : await addMedicine(data);
      closeForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await deleteMedicine(deleting._id);
      setDeleting(null);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Medicines</h1>
          <p className="text-sm text-slate-400 mt-0.5">{pagination.total} medicines total</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => exportMedicinesToCSV(medicines)}>
            <Download size={15} /> Export CSV
          </Button>
          <Button onClick={openAdd}>
            <Plus size={15} /> Add Medicine
          </Button>
        </div>
      </div>

      {/* Filters */}
      <MedicineFilters filters={filters} categories={categories} suppliers={suppliers} onChange={handleFilterChange} />

      {/* Table */}
      {!loading && medicines.length === 0 ? (
        <EmptyState title="No medicines found" message="Add a medicine or adjust your filters." />
      ) : (
        <MedicineTable
          medicines={medicines}
          loading={loading}
          onEdit={openEdit}
          onDelete={setDeleting}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          inventoryMap={inventoryMap}
        />
      )}

      {/* Pagination */}
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />

      {/* Add / Edit Modal */}
      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Medicine' : 'Add Medicine'} size="lg">
        <MedicineForm
          defaultValues={editing}
          categories={categories}
          suppliers={suppliers}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={formLoading}
        title="Delete Medicine"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
