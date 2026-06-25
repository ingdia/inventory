// src/features/sales/hooks/useSales.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createSale,
  getSales,
  getSummaryByRange,
  getTodaySummary,
} from '../services/sales.service.js';

export function useSalesList(filters) {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => getSales(filters),
    staleTime: 30 * 1000,
  });
}

export function useTodaySummary() {
  return useQuery({
    queryKey: ['sales-summary-today'],
    queryFn: getTodaySummary,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useSummaryByRange(startDate, endDate) {
  return useQuery({
    queryKey: ['sales-summary-range', startDate, endDate],
    queryFn: () => getSummaryByRange(startDate, endDate),
    enabled: Boolean(startDate && endDate),
    staleTime: 60 * 1000,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-summary-today'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });
}
