// src/features/purchases/components/PurchaseItemsForm.jsx
import { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce.js';
import axiosInstance from '../../../shared/services/axiosInstance.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import Spinner from '../../../shared/components/Spinner.jsx';

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

function MedicineSearchSelect({ value, onChange, onSelectMedicine, error }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) { setMedicines([]); return; }
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/medicines', {
          params: { search: debouncedSearch, limit: 20 },
        });
        if (!cancelled) setMedicines(data?.data?.medicines ?? data?.data ?? []);
      } catch {
        if (!cancelled) setMedicines([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? search : (value?.medicineName || '')}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search medicine..."
        className={`${inputClass} ${error ? 'border-red-400' : ''}`}
      />
      {open && debouncedSearch.trim() && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {loading && <div className="flex justify-center p-3"><Spinner size="sm" /></div>}
          {!loading && medicines.length === 0 && (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400">No medicines found</p>
          )}
          {!loading && medicines.map((med) => (
            <button
              key={med._id}
              type="button"
              className="block w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-cyan-50 dark:text-gray-100 dark:hover:bg-gray-700"
              onClick={() => { onChange(med._id); onSelectMedicine(med.name); setSearch(med.name); setOpen(false); }}
            >
              {med.name}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function PurchaseItemsForm({ control, register, errors, watch, setValue }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  return (
    <div>
      {errors.items?.message && (
        <p className="mb-3 text-xs text-red-500">{errors.items.message}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {['Medicine', 'Qty', 'Unit Cost', 'Subtotal', ''].map((h, i) => (
                <th key={i} className={`px-2 py-2 font-semibold text-gray-700 dark:text-gray-300 ${i === 3 ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const qty = Number(watchedItems?.[index]?.quantity) || 0;
              const price = Number(watchedItems?.[index]?.purchasePrice) || 0;
              return (
                <tr key={field.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-2 py-3">
                    <Controller
                      name={`items.${index}.medicine`}
                      control={control}
                      render={({ field: f }) => (
                        <MedicineSearchSelect
                          value={{ medicine: f.value, medicineName: watchedItems?.[index]?.medicineName }}
                          onChange={f.onChange}
                          onSelectMedicine={(name) => setValue(`items.${index}.medicineName`, name)}
                          error={errors.items?.[index]?.medicine?.message}
                        />
                      )}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      min={1}
                      {...register(`items.${index}.quantity`)}
                      className={`${inputClass} w-20 ${errors.items?.[index]?.quantity ? 'border-red-400' : ''}`}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-xs text-red-500">{errors.items[index].quantity.message}</p>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      {...register(`items.${index}.purchasePrice`)}
                      className={`${inputClass} w-28 ${errors.items?.[index]?.purchasePrice ? 'border-red-400' : ''}`}
                    />
                    {errors.items?.[index]?.purchasePrice && (
                      <p className="mt-1 text-xs text-red-500">{errors.items[index].purchasePrice.message}</p>
                    )}
                  </td>
                  <td className="px-2 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(qty * price)}
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => append({ medicine: '', medicineName: '', quantity: 1, purchasePrice: 0 })}
        className="mt-4 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
}
