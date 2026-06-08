const Input = ({ label, error, icon: Icon, rightElement, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-semibold text-slate-700">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500">
          <Icon size={16} />
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all
          focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100
          ${Icon ? 'pl-10' : ''}
          ${rightElement ? 'pr-10' : ''}
          ${error ? 'border-red-400 bg-red-50 focus:ring-red-100' : 'border-slate-200 hover:border-cyan-300'}
        `}
      />
      {rightElement && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export default Input;
