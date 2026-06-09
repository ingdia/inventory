const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
  danger: 'bg-red-600/80 hover:bg-red-500 text-white',
  ghost: 'bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600',
  outline: 'border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10',
};

const Button = ({ children, variant = 'primary', loading, className = '', ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    )}
    {children}
  </button>
);

export default Button;
