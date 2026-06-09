const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: { className: 'bg-slate-100 text-slate-600' },
    success: { className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    danger: { className: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
    warning: { className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    info: {
      className: 'ring-1',
      style: {
        background: 'oklch(96% 0.04 207.078)',
        color: 'oklch(45% 0.18 207.078)',
        ringColor: 'oklch(86.5% 0.127 207.078)',
      },
    },
  };

  const { className, style } = styles[variant] || styles.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
