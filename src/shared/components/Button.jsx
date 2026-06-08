const variants = {
  primary: {
    style: { background: 'oklch(55% 0.18 207.078)', boxShadow: '0 6px 20px oklch(55% 0.18 207.078 / 0.3)' },
    className: 'text-white hover:opacity-90',
  },
  danger: {
    style: { background: 'linear-gradient(135deg, #ef4444, #f43f5e)' },
    className: 'text-white shadow-lg shadow-red-100 hover:opacity-90',
  },
  ghost: {
    style: {},
    className: 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300',
  },
  outline: {
    style: { borderColor: 'oklch(86.5% 0.127 207.078)', color: 'oklch(45% 0.18 207.078)' },
    className: 'border-2 hover:opacity-80 bg-transparent',
  },
  success: {
    style: { background: 'linear-gradient(135deg, #10b981, #0d9488)' },
    className: 'text-white shadow-lg shadow-emerald-100 hover:opacity-90',
  },
};

const Button = ({ children, variant = 'primary', loading, className = '', style: extraStyle = {}, ...props }) => {
  const { style, className: variantClass } = variants[variant];
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{ ...style, ...extraStyle }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variantClass} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
};

export default Button;
