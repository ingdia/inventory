const Input = ({ label, error, icon: Icon, rightElement, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-300">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={16} />
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-lg border bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
          ${Icon ? 'pl-10' : ''}
          ${rightElement ? 'pr-10' : ''}
          ${error ? 'border-red-500/70' : 'border-slate-700 hover:border-slate-600'}
        `}
      />
      {rightElement && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
      )}
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export default Input;
