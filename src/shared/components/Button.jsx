const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-200 hover:shadow-cyan-300',
  danger: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-100',
  ghost: 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300',
  outline: 'border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-100',
};

const Button = ({ children, variant = 'primary', loading, className = '', ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant]} ${className}`}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    )}
    {children}
  </button>
);

export default Button;
