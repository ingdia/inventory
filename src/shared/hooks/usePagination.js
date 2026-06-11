// src/shared/hooks/usePagination.js
import { useState } from 'react';

function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage]   = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const resetPage = () => setPage(1);

  return {
    page,
    limit,
    setPage,
    setLimit,
    resetPage,       // your branch uses this
    reset: resetPage // main's branch uses this — alias, same function
  };
}

export default usePagination;
export { usePagination }; // supports named import too