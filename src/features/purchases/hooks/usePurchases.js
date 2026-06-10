// src/features/purchases/hooks/usePurchases.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  cancelPurchase,
  createPurchase,
  getPurchases,
  receivePurchase,
} from '../services/purchases.service.js';

export function usePurchasesList(filters) {
  return useQuery({
    queryKey: ['purchases', filters],
    queryFn: () => getPurchases(filters),
    staleTime: 30 * 1000,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      toast.success('Purchase recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useReceivePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receivePurchase,
    onSuccess: () => {
      toast.success('Purchase marked as received. Stock updated.');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useCancelPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPurchase,
    onSuccess: () => {
      toast.success('Purchase cancelled.');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });
}
