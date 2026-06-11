// src/features/sales/components/POSProductSearch.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce.js';
import { useMedicineSearch } from '../hooks/usePOS.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import Badge from '../../../shared/components/Badge.jsx';

function StockBadge({ stock }) {
  if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (stock <= 10) return <Badge variant="warning">Low Stock ({stock})</Badge>;
  return <Badge variant="success">In Stock ({stock})</Badge>;
}

function MedicineSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mb-3 h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-600" />
      <div className="mb-3 h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-5 w-24 rounded-full bg-gray-100 dark:bg-gray-600" />
    </div>
  );
}

export default function POSProductSearch({ onAddToCart }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { medicines, isLoading } = useMedicineSearch(debouncedSearch);

  const handleCardClick = (medicine) => {
    if (medicine.stock === 0) return;
    onAddToCart(medicine);
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="relative">
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 dark:text-cyan-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines by name or generic..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MedicineSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !search.trim() && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <Search size={40} className="mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              Search for a medicine to get started
            </p>
          </div>
        )}

        {!isLoading && search.trim() && medicines.length === 0 && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <p className="font-medium text-gray-600 dark:text-gray-300">No medicines found</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              Try a different search term
            </p>
          </div>
        )}

        {!isLoading && medicines.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {medicines.map((medicine) => {
              const outOfStock = medicine.stock === 0;
              const price = medicine.unitPrice ?? medicine.sellingPrice ?? 0;

              return (
                <button
                  key={medicine._id || medicine.id}
                  type="button"
                  onClick={() => handleCardClick(medicine)}
                  disabled={outOfStock}
                  className={`rounded-xl border border-gray-200 bg-white p-4 text-left transition-all dark:border-gray-700 dark:bg-gray-800 ${
                    outOfStock
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:border-cyan-500 hover:shadow-sm dark:hover:border-cyan-400'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">{medicine.name}</p>
                  {medicine.genericName && (
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {medicine.genericName}
                    </p>
                  )}
                  <p className="mt-2 font-bold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(price)}
                  </p>
                  <div className="mt-2">
                    <StockBadge stock={medicine.stock} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
