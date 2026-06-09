import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { STOCK_MOVEMENT_TYPES } from '../../../shared/constants/status.constants';

const schema = z.object({
  medicine: z.string().min(1, 'Medicine is required'),
  type: z.enum(STOCK_MOVEMENT_TYPES, { errorMap: () => ({ message: 'Type is required' }) }),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().optional(),
  date: z.string().optional(),
});

export function useStockMovement() {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues: { medicine: '', type: 'stock_in', quantity: '', reason: '', date: new Date().toISOString().split('T')[0] },
  });
}
