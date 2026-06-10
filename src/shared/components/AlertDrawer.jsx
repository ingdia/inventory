import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { medicinesService } from '../../features/medicines/services/medicines.service';
import { formatDate } from '../utils/formatDate';
import { useNavigate } from 'react-router-dom';

export default function AlertDrawer() {
  const [open, setOpen] = useState(false);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    medicinesService.getLowStock().then(({ data }) => setLowStock(data.data || [])).catch(() => {});
    medicinesService.getExpiring().then(({ data }) => setExpiring(data.data || [])).catch(() => {});
  }, []);

  const total = lowStock.length + expiring.length;

  return (
    <>
      {/* Bell button with badge */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        title="Alerts"
      >
        <Bell size={16} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {total > 99 ? '99+' : total}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="relative z-10 w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-white">Alerts</h2>
                {total > 0 && (
                  <span className="bg-red-500/20 text-red-400 ring-1 ring-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium">{total}</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {/* Low Stock */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={13} className="text-amber-400" />
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Low Stock ({lowStock.length})</p>
                </div>
                {lowStock.length === 0 ? (
                  <p className="text-xs text-slate-500 pl-5">No low stock items</p>
                ) : (
                  <div className="space-y-1">
                    {lowStock.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.medicine?.name || item.name}</p>
                          <p className="text-xs text-amber-400">Qty: {item.quantity ?? item.currentStock} / Reorder: {item.medicine?.reorderLevel ?? item.reorderLevel}</p>
                        </div>
                        <button
                          onClick={() => { setOpen(false); navigate('/inventory/dashboard'); }}
                          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                        >
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expiring */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={13} className="text-orange-400" />
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Expiring Soon ({expiring.length})</p>
                </div>
                {expiring.length === 0 ? (
                  <p className="text-xs text-slate-500 pl-5">No expiry alerts</p>
                ) : (
                  <div className="space-y-1">
                    {expiring.map((med) => (
                      <div key={med._id} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{med.name}</p>
                          <p className="text-xs text-orange-400">Expires: {formatDate(med.expiryDate)}</p>
                        </div>
                        <button
                          onClick={() => { setOpen(false); navigate('/inventory/dashboard'); }}
                          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                        >
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-800">
              <button
                onClick={() => { setOpen(false); navigate('/inventory/dashboard'); }}
                className="w-full py-2 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/10 transition-all font-medium"
              >
                View Inventory Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
