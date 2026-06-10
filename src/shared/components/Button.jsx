const variants = {
  primary: {
    style: { background: 'linear-gradient(135deg,oklch(86.5% 0.127 207.078),oklch(55% 0.18 207.078))', boxShadow: '0 6px 20px oklch(55% 0.18 207.078 / 0.32)' },
    cls: 'text-white hover:opacity-90',
  },
  secondary: {
    style: {},
    cls: 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200',
  },
  danger: {
    style: { background: 'linear-gradient(135deg,#fb7185,#e11d48)', boxShadow: '0 6px 20px rgba(225,29,72,0.25)' },
    cls: 'text-white hover:opacity-90',
  },
  ghost: {
    style: { borderColor: 'oklch(90% 0.04 207.078)' },
    cls: 'bg-white border text-slate-600 hover:bg-slate-50',
  },
  outline: {
    style: { borderColor: 'oklch(86.5% 0.127 207.078)', color: 'oklch(45% 0.18 207.078)' },
    cls: 'border-2 bg-transparent hover:opacity-80',
  },
};

const Button = ({ children, variant = 'primary', loading, className = '', style: extra = {}, ...props }) => {
  const { style, cls } = variants[variant] || variants.primary;
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{ ...style, ...extra }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${cls} ${className}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
      {children}
    </button>
  );
};

export default Button;
