import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, limit, total, totalPages, onPageChange }) {
  const computedTotalPages = totalPages ?? Math.max(1, Math.ceil(total / (limit || 20)));
  if (computedTotalPages <= 1 && !total) return null;

  const start = total === 0 ? 0 : (page - 1) * (limit || 20) + 1;
  const end   = Math.min(page * (limit || 20), total);

  // Smart page number list with ellipsis
  const pages = Array.from({ length: computedTotalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === computedTotalPages || Math.abs(p - page) <= 1);

  const rendered = [];
  let prev = null;
  for (const p of pages) {
    if (prev && p - prev > 1) rendered.push('...');
    rendered.push(p);
    prev = p;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

      {/* Results count — only shown when total is provided */}
      {total !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {start}–{end} of {total} results
        </p>
      )}

      {/* Page controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:text-cyan-400 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        {rendered.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400 dark:text-slate-600 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-200 dark:shadow-cyan-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:text-cyan-400 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= computedTotalPages}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:text-cyan-400 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}