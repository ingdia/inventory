import { useState } from 'react';
import { useStockMovement } from '../hooks/useStockMovement';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import useInventoryStore from '../store/inventoryStore';

export default function StockMovementForm({ medicines = [], onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset } = useStockMovement();
  const { recordStockMovement } = useInventoryStore();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await recordStockMovement(data);
      reset();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select label="Medicine *" error={errors.medicine?.message} {...register('medicine')}>
        <option value="">Select medicine</option>
        {medicines.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Movement Type *" error={errors.type?.message} {...register('type')}>
          <option value="stock_in">Stock In</option>
          <option value="stock_out">Stock Out</option>
          <option value="adjustment">Adjustment</option>
        </Select>
        <Input label="Quantity *" type="number" error={errors.quantity?.message} placeholder="0" {...register('quantity')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        <Input label="Reason / Notes" error={errors.reason?.message} placeholder="e.g. Purchase restock" {...register('reason')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>Record Movement</Button>
      </div>
    </form>
  );
}
