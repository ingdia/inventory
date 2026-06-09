import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button.jsx';

export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {start}–{end} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-2"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-2"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
