import { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance.js';
import Spinner from '../../../shared/components/Spinner.jsx';

const selectClassName =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';

export default function SupplierSelect({
  value,
  onChange,
  error,
  includeAllOption = false,
  className = '',
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSuppliers() {
      setLoading(true);
      setFetchError(false);
      try {
        const { data } = await axiosInstance.get('/suppliers', { params: { limit: 100 } });
        if (!cancelled) {
          setSuppliers(data?.data ?? []);
        }
      } catch {
        if (!cancelled) {
          setFetchError(true);
          setSuppliers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSuppliers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || fetchError}
          className={`${selectClassName} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
        >
          {includeAllOption ? (
            <option value="">All suppliers</option>
          ) : (
            <option value="" disabled>
              Select supplier...
            </option>
          )}
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {loading && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
      {fetchError && (
        <p className="mt-1 text-xs text-red-500">Failed to load suppliers</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
