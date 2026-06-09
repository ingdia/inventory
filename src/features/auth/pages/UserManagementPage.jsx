import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users, Plus, Search, UserCheck, UserX, Pencil, X,
  Mail, Phone, Shield, ChevronLeft, ChevronRight, UserCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema, updateProfileSchema } from '../utils/schemas';
import { userService } from '../services/auth.service';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

const BRAND = 'oklch(55% 0.18 207.078)';
const BRAND_LIGHT = 'oklch(96% 0.04 207.078)';
const BRAND_MID = 'oklch(86.5% 0.127 207.078)';
const roleVariant = { owner: 'warning', pharmacist: 'info' };

const gradients = [
  'linear-gradient(135deg, oklch(70% 0.18 207.078), oklch(50% 0.18 207.078))',
  'linear-gradient(135deg, #a78bfa, #7c3aed)',
  'linear-gradient(135deg, #fb7185, #e11d48)',
  'linear-gradient(135deg, #fbbf24, #d97706)',
  'linear-gradient(135deg, #34d399, #059669)',
];
const getGradient = (name = '') => gradients[name.charCodeAt(0) % gradients.length];

const card = {
  borderColor: `${BRAND_MID.replace(')', ' / 0.4)').replace('oklch(', 'oklch(')}`,
  boxShadow: '0 16px 48px oklch(55% 0.18 207.078 / 0.08)',
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function UserModal({ user, onClose, onSaved }) {
  const isEdit = Boolean(user);
  const schema = isEdit ? updateProfileSchema : registerSchema;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? { firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' }
      : { role: 'pharmacist' },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await userService.update(user._id, data);
        toast.success('User updated.');
      } else {
        await userService.create(data);
        toast.success('User created.');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0% 0 0 / 0.35)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border" style={{ borderColor: `${BRAND_MID}`, boxShadow: `0 32px 80px oklch(55% 0.18 207.078 / 0.2)` }}>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
              <UserCircle size={20} style={{ color: BRAND }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{isEdit ? 'Edit User' : 'Create New User'}</h3>
              <p className="text-xs text-slate-400">{isEdit ? 'Update user details' : 'Add a new team member'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" placeholder="Jane" icon={UserCircle} error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name" placeholder="Doe" icon={UserCircle} error={errors.lastName?.message} {...register('lastName')} />
          </div>
          {!isEdit && (
            <>
              <Input label="Email" type="email" placeholder="jane@pharmacy.com" icon={Mail} error={errors.email?.message} {...register('email')} />
              <Input label="Password" type="password" placeholder="Min 8 characters" icon={Shield} error={errors.password?.message} {...register('password')} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select {...register('role')}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all hover:border-slate-300"
                  onFocus={(e) => { e.target.style.borderColor = BRAND; e.target.style.boxShadow = `0 0 0 4px oklch(86.5% 0.127 207.078 / 0.25)`; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="owner">Owner</option>
                </select>
                {errors.role && <p className="text-xs text-red-500 font-medium">{errors.role.message}</p>}
              </div>
            </>
          )}
          <Input label="Phone (optional)" placeholder="+250 788 000 000" icon={Phone} error={errors.phone?.message} {...register('phone')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await userService.getAll(params);
      setUsers(data.data.users);
      setPagination((p) => ({ ...p, ...data.data.pagination }));
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleActive = async (u) => {
    try {
      if (u.isActive) {
        await userService.deactivate(u._id);
        toast.success(`${u.firstName} deactivated.`);
      } else {
        await userService.activate(u._id);
        toast.success(`${u.firstName} activated.`);
      }
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: BRAND_LIGHT }}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Team Members</h1>
            <p className="text-slate-400 text-xs mt-0.5">{pagination.total} users</p>
          </div>
          <Button onClick={() => setModal('create')} className="gap-1.5">
            <Plus size={14} /> Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: pagination.total, bg: `linear-gradient(135deg, ${BRAND_MID}, ${BRAND})` },
            { label: 'Active', value: users.filter(u => u.isActive).length, bg: 'linear-gradient(135deg, #34d399, #059669)' },
            { label: 'Owners', value: users.filter(u => u.role === 'owner').length, bg: 'linear-gradient(135deg, #fbbf24, #d97706)' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-3 flex items-center gap-3 border" style={{ borderColor: 'oklch(86.5% 0.127 207.078 / 0.3)', boxShadow: '0 4px 16px oklch(55% 0.18 207.078 / 0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: s.bg }}>
                {s.value}
              </div>
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: BRAND }} />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none transition-all hover:border-slate-300"
              onFocus={(e) => { e.target.style.borderColor = BRAND; e.target.style.boxShadow = '0 0 0 4px oklch(86.5% 0.127 207.078 / 0.25)'; }}
              onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
            />
          </div>
          <select value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-700 outline-none transition-all hover:border-slate-300"
            onFocus={(e) => { e.target.style.borderColor = BRAND; e.target.style.boxShadow = '0 0 0 4px oklch(86.5% 0.127 207.078 / 0.25)'; }}
            onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}>
            <option value="">All Roles</option>
            <option value="owner">Owner</option>
            <option value="pharmacist">Pharmacist</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl overflow-hidden border" style={card}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100" style={{ borderTopColor: BRAND }} />
              <p className="text-xs text-slate-400">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
                <Users size={28} style={{ color: BRAND_MID }} />
              </div>
              <p className="font-medium text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100" style={{ background: BRAND_LIGHT }}>
                    {['User', 'Role', 'Status', 'Last Login', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => {
                    const initials = `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm"
                              style={{ background: getGradient(u.firstName) }}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{u.firstName} {u.lastName}</p>
                              <p className="text-slate-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><Badge variant={roleVariant[u.role]}>{u.role}</Badge></td>
                        <td className="px-6 py-4">
                          <Badge variant={u.isActive ? 'success' : 'danger'}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {u.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setModal(u)}
                              className="p-2 rounded-xl text-slate-400 hover:text-white transition-all"
                              style={{ '--hover-bg': BRAND }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = BRAND_LIGHT; e.currentTarget.style.color = BRAND; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
                              title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleToggleActive(u)}
                              className="p-2 rounded-xl text-slate-400 transition-all"
                              onMouseEnter={(e) => { e.currentTarget.style.background = u.isActive ? '#fef2f2' : '#f0fdf4'; e.currentTarget.style.color = u.isActive ? '#ef4444' : '#22c55e'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
                              title={u.isActive ? 'Deactivate' : 'Activate'}>
                              {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-700">{pagination.page}</span> of <span className="font-semibold text-slate-700">{pagination.pages}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className="px-3 py-2"><ChevronLeft size={16} /></Button>
              <Button variant="ghost" onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.pages} className="px-3 py-2"><ChevronRight size={16} /></Button>
            </div>
          </div>
        )}
      </div>

      {modal && <UserModal user={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={fetchUsers} />}
    </div>
  );
}
