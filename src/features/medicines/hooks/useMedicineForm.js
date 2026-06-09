import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MEDICINE_UNITS } from '../../../shared/constants/status.constants';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  genericName: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().optional(),
  unit: z.enum(MEDICINE_UNITS, { errorMap: () => ({ message: 'Unit is required' }) }),
  purchasePrice: z.coerce.number().min(0, 'Must be ≥ 0'),
  sellingPrice: z.coerce.number().min(0, 'Must be ≥ 0'),
  reorderLevel: z.coerce.number().min(0).default(10),
  expiryDate: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export function useMedicineForm(defaultValues) {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      name: '', genericName: '', description: '', category: '', supplier: '',
      unit: 'tablet', purchasePrice: '', sellingPrice: '', reorderLevel: 10,
      expiryDate: '', status: 'active',
    },
  });
}
