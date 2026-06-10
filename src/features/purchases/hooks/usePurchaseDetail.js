// src/features/purchases/hooks/usePurchaseDetail.js
import { useQuery } from '@tanstack/react-query';
import { getPurchaseById } from '../services/purchases.service.js';

export function usePurchaseDetail(purchaseId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['purchase', purchaseId],
    queryFn: () => getPurchaseById(purchaseId),
    enabled: Boolean(purchaseId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    purchase: data?.data,
    isLoading,
    isError,
  };
}
