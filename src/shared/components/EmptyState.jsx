import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message = 'Try adjusting your search or filters.', icon: Icon = PackageSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-500" />
      </div>
      <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      <p className="text-xs text-slate-500 mt-1">{message}</p>
    </div>
  );
}
