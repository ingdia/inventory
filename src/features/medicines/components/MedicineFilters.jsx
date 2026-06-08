import SearchBar from '../../../shared/components/SearchBar';

export default function MedicineFilters({ filters, categories, suppliers, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <SearchBar
        value={filters.search}
        onChange={(v) => onChange('search', v)}
        placeholder="Search name or generic name…"
      />
      <select
        value={filters.category}
        onChange={(e) => onChange('category', e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <select
        value={filters.supplier}
        onChange={(e) => onChange('supplier', e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
      >
        <option value="">All Suppliers</option>
        {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>
      <select
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
