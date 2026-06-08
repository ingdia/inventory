import { formatDate, isExpired } from '../../../shared/utils/formatDate';
import EmptyState from '../../../shared/components/EmptyState';
import { Clock } from 'lucide-react';

export default function ExpiryAlert({ items = [] }) {
  if (items.length === 0) return <EmptyState title="No expiry alerts" message="No medicines expiring soon." icon={Clock} />;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-800/50">
          <tr>
            {['Medicine', 'Category', 'Expiry Date', 'Status'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {items.map((med) => {
            const expired = isExpired(med.expiryDate);
            return (
              <tr key={med._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{med.name}</p>
                  <p className="text-xs text-slate-500">{med.genericName}</p>
                </td>
                <td className="px-4 py-3 text-slate-300">{med.category?.name || '—'}</td>
                <td className={`px-4 py-3 font-medium ${expired ? 'text-red-400' : 'text-amber-400'}`}>
                  {formatDate(med.expiryDate)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    expired
                      ? 'bg-red-900/40 text-red-400 ring-1 ring-red-500/30'
                      : 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                  }`}>
                    {expired ? 'Expired' : 'Expiring Soon'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
