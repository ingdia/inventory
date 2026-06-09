import { useEffect } from 'react';
import { useMedicineForm } from '../hooks/useMedicineForm';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import { MEDICINE_UNITS } from '../../../shared/constants/status.constants';

export default function MedicineForm({ defaultValues, categories, suppliers, onSubmit, onCancel, loading }) {
  const { register, handleSubmit, formState: { errors }, reset } = useMedicineForm(defaultValues);

  useEffect(() => { if (defaultValues) reset(defaultValues); }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name *" error={errors.name?.message} placeholder="e.g. Amoxicillin" {...register('name')} />
        <Input label="Generic Name" error={errors.genericName?.message} placeholder="e.g. Amoxicillin trihydrate" {...register('genericName')} />
      </div>

      <Input label="Description" error={errors.description?.message} placeholder="Brief description…" {...register('description')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Category *" error={errors.category?.message} {...register('category')}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </Select>
        <Select label="Supplier" error={errors.supplier?.message} {...register('supplier')}>
          <option value="">Select supplier</option>
          {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select label="Unit *" error={errors.unit?.message} {...register('unit')}>
          {MEDICINE_UNITS.map((u) => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
        </Select>
        <Input label="Purchase Price *" type="number" step="0.01" error={errors.purchasePrice?.message} placeholder="0.00" {...register('purchasePrice')} />
        <Input label="Selling Price *" type="number" step="0.01" error={errors.sellingPrice?.message} placeholder="0.00" {...register('sellingPrice')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Reorder Level" type="number" error={errors.reorderLevel?.message} placeholder="10" {...register('reorderLevel')} />
        <Input label="Expiry Date" type="date" error={errors.expiryDate?.message} {...register('expiryDate')} />
        <Select label="Status" error={errors.status?.message} {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{defaultValues?._id ? 'Save Changes' : 'Add Medicine'}</Button>
      </div>
    </form>
  );
}
