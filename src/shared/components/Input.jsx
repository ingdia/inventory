const Input = ({ label, error, icon: Icon, rightElement, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: error ? '#f87171' : 'oklch(72% 0.12 207.078)' }}>
          <Icon size={15} />
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none transition-all
          ${Icon ? 'pl-10' : ''}
          ${rightElement ? 'pr-10' : ''}
          ${error
            ? 'border-red-300 bg-red-50/50'
            : 'border-slate-150 hover:border-slate-300'
          }`}
        style={{ borderColor: error ? '' : 'oklch(90% 0.04 207.078)' }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#f87171' : 'oklch(55% 0.18 207.078)';
          e.target.style.boxShadow   = error
            ? '0 0 0 3px rgba(248,113,113,0.15)'
            : '0 0 0 3px oklch(86.5% 0.127 207.078 / 0.3)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#fca5a5' : 'oklch(90% 0.04 207.078)';
          e.target.style.boxShadow   = 'none';
        }}
      />
      {rightElement && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
      )}
    </div>
    {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
  </div>
);

export default Input;
