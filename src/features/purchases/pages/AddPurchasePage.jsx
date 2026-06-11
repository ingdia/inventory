import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreatePurchase } from '../hooks/usePurchases.js';
import { buildPurchasePayload } from '../utils/purchases.utils.js';
import SupplierSelect from '../components/SupplierSelect.jsx';
import useDebounce from '../../../shared/hooks/useDebounce.js';
import axiosInstance from '../../../shared/services/api.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { formatDateForInput } from '../../../shared/utils/formatDate.js';
import Button from '../../../shared/components/Button.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';

const purchaseSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  expectedDelivery: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        medicine: z.string().min(1, 'Select a medicine'),
        medicineName: z.string().optional(),
        quantity: z.coerce.number().int().min(1, 'Min 1'),
        purchasePrice: z.coerce.number().min(0, 'Required'),
      })
    )
    .min(1, 'Add at least one item'),
});

const inputClassName =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

function MedicineSearchSelect({ value, onChange, onSelectMedicine, error }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setMedicines([]);
      return;
    }

    let cancelled = false;
    async function fetchMedicines() {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/medicines', {
          params: { search: debouncedSearch, limit: 20 },
        });
        if (!cancelled) {
          setMedicines(data?.data?.medicines ?? data?.data ?? []);
        }
      } catch {
        if (!cancelled) setMedicines([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMedicines();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const selectedLabel = value?.medicineName || '';

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? search : selectedLabel}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search medicine..."
        className={`${inputClassName} ${error ? 'border-red-400' : ''}`}
      />
      {open && debouncedSearch.trim() && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {loading && (
            <div className="flex justify-center p-3">
              <Spinner size="sm" />
            </div>
          )}
          {!loading && medicines.length === 0 && (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400">No medicines found</p>
          )}
          {!loading &&
            medicines.map((med) => (
              <button
                key={med._id}
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-cyan-50 dark:text-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  onChange(med._id);
                  onSelectMedicine(med.name);
                  setSearch(med.name);
                  setOpen(false);
                }}
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

export default function AddPurchasePage() {
  const navigate = useNavigate();
  const createPurchase = useCreatePurchase();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplier: '',
      invoiceNumber: '',
      purchaseDate: formatDateForInput(new Date()),
      expectedDelivery: '',
      notes: '',
      items: [{ medicine: '', medicineName: '', quantity: 1, purchasePrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  const orderTotal = useMemo(() => {
    return (watchedItems || []).reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.purchasePrice) || 0;
      return sum + qty * price;
    }, 0);
  }, [watchedItems]);

  const onSubmit = (data) => {
    const payload = buildPurchasePayload(data, data.items);
    createPurchase.mutate(payload, {
      onSuccess: () => {
        toast.success('Purchase recorded');
        navigate('/purchases');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to record purchase');
      },
    });
  };

  return (
    <div className="min-h-full bg-white p-4 md:p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Record Purchase</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Purchase Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Supplier
                </label>
                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => (
                    <SupplierSelect
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.supplier?.message}
                    />
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Invoice Number
                </label>
                <input
                  type="text"
                  {...register('invoiceNumber')}
                  className={`${inputClassName} ${errors.invoiceNumber ? 'border-red-400' : ''}`}
                />
                {errors.invoiceNumber && (
                  <p className="mt-1 text-xs text-red-500">{errors.invoiceNumber.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Purchase Date
                </label>
                <input
                  type="date"
                  {...register('purchaseDate')}
                  className={`${inputClassName} ${errors.purchaseDate ? 'border-red-400' : ''}`}
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.purchaseDate.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected Delivery
                </label>
                <input type="date" {...register('expectedDelivery')} className={inputClassName} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className={inputClassName}
                  placeholder="Optional notes..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Items</h2>
            {errors.items?.message && (
              <p className="mb-3 text-xs text-red-500">{errors.items.message}</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Medicine
                    </th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Qty
                    </th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Unit Cost
                    </th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                      Subtotal
                    </th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => {
                    const qty = Number(watchedItems?.[index]?.quantity) || 0;
                    const price = Number(watchedItems?.[index]?.purchasePrice) || 0;
                    const subtotal = qty * price;

                    return (
                      <tr key={field.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-3">
                          <Controller
                            name={`items.${index}.medicine`}
                            control={control}
                            render={({ field: medField }) => (
                              <MedicineSearchSelect
                                value={{
                                  medicine: medField.value,
                                  medicineName: watchedItems?.[index]?.medicineName,
                                }}
                                onChange={medField.onChange}
                                onSelectMedicine={(name) =>
                                  setValue(`items.${index}.medicineName`, name)
                                }
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
                            className={`${inputClassName} w-20 ${errors.items?.[index]?.quantity ? 'border-red-400' : ''}`}
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.items[index].quantity.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            {...register(`items.${index}.purchasePrice`)}
                            className={`${inputClassName} w-28 ${errors.items?.[index]?.purchasePrice ? 'border-red-400' : ''}`}
                          />
                          {errors.items?.[index]?.purchasePrice && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.items[index].purchasePrice.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(subtotal)}
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

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                append({ medicine: '', medicineName: '', quantity: 1, purchasePrice: 0 })
              }
            >
              <Plus size={16} />
              Add Item
            </Button>

            <div className="mt-4 text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Order Total: {formatCurrency(orderTotal)}
              </p>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={createPurchase.isPending}>
              Record Purchase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
