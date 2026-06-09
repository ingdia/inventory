export default function Select({ label, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <select
        {...props}
        className={`w-full rounded-lg border bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
          ${error ? 'border-red-500/70' : 'border-slate-700 hover:border-slate-600'}
        `}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
