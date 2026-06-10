// src/features/purchases/components/PurchaseForm.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreatePurchase } from '../hooks/usePurchases.js';
import { buildPurchasePayload } from '../utils/purchases.utils.js';
import { formatDateForInput } from '../../../shared/utils/formatDate.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import SupplierSelect from './SupplierSelect.jsx';
import PurchaseItemsForm from './PurchaseItemsForm.jsx';
import Button from '../../../shared/components/Button.jsx';

const schema = z.object({
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

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

export default function PurchaseForm() {
  const navigate = useNavigate();
  const createPurchase = useCreatePurchase();

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      supplier: '',
      invoiceNumber: '',
      purchaseDate: formatDateForInput(new Date()),
      expectedDelivery: '',
      notes: '',
      items: [{ medicine: '', medicineName: '', quantity: 1, purchasePrice: 0 }],
    },
  });

  const watchedItems = watch('items');

  const orderTotal = useMemo(
    () => (watchedItems || []).reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.purchasePrice) || 0), 0),
    [watchedItems]
  );

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
                  className={`${inputClass} ${errors.invoiceNumber ? 'border-red-400' : ''}`}
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
                  className={`${inputClass} ${errors.purchaseDate ? 'border-red-400' : ''}`}
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.purchaseDate.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected Delivery
                </label>
                <input type="date" {...register('expectedDelivery')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className={inputClass}
                  placeholder="Optional notes..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Items</h2>
            <PurchaseItemsForm
              control={control}
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
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
