const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    danger: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
    warning: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
    info: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
