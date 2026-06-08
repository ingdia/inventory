const Input = ({ label, error, icon: Icon, rightElement, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-semibold text-slate-700">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'oklch(55% 0.18 207.078)' }}>
          <Icon size={16} />
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all
          ${Icon ? 'pl-10' : ''}
          ${rightElement ? 'pr-10' : ''}
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-[oklch(86.5%_0.127_207.078)]'}
        `}
        style={error ? {} : { '--tw-ring-color': 'oklch(86.5% 0.127 207.078 / 0.4)' }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = 'oklch(55% 0.18 207.078)';
            e.target.style.boxShadow = '0 0 0 4px oklch(86.5% 0.127 207.078 / 0.25)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = '';
            e.target.style.boxShadow = '';
          }
        }}
      />
      {rightElement && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export default Input;
