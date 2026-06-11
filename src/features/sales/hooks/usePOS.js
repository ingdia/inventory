// src/features/sales/hooks/usePOS.js
import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/services/api.js';

export function useMedicineSearch(searchTerm) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['medicines-search', searchTerm],
    queryFn: async () => {
      const { data: response } = await api.get('/medicines', {
        params: { search: searchTerm, limit: 30 },
      });
      return response;
    },
    enabled: searchTerm.length >= 1,
    staleTime: 60 * 1000,
  });

  return {
    medicines: data?.data?.medicines || [],
    isLoading,
    isError,
  };
}
