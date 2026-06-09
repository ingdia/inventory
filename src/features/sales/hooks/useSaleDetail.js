// src/features/sales/hooks/useSaleDetail.js
import { useQuery } from '@tanstack/react-query';
import { getSaleById } from '../services/sales.service.js';

export function useSaleDetail(saleId) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sale', saleId],
    queryFn: () => getSaleById(saleId),
    enabled: Boolean(saleId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    sale: data?.data,
    isLoading,
    isError,
    refetch,
  };
}
