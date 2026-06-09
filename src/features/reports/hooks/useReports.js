import { useCallback } from 'react';
import useReportsStore from '../store/reportsStore';

export default function useReports(type) {
  const store = useReportsStore();

  const fetch = useCallback(
    (params) => store.fetchReport(type, params),
    [type]
  );

  return { ...store, fetch };
}
