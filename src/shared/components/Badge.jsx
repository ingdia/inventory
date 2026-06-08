const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    danger: 'bg-red-50 text-red-600 ring-1 ring-red-200',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    info: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
