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

const roleVariant = { owner: 'warning', pharmacist: 'info' };

const avatarColors = [
  'from-cyan-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-500',
];

const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

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
        toast.success('User updated successfully.');
      } else {
        await userService.create(data);
        toast.success('User created successfully.');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-cyan-200/50 border border-cyan-100 p-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <UserCircle size={20} className="text-cyan-600" />
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
                <select
                  {...register('role')}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 hover:border-cyan-300 transition-all"
                >
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

// ─── Main Page ────────────────────────────────────────────────────────────────
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

  const handleToggleActive = async (user) => {
    try {
      if (user.isActive) {
        await userService.deactivate(user._id);
        toast.success(`${user.firstName} deactivated.`);
      } else {
        await userService.activate(user._id);
        toast.success(`${user.firstName} activated.`);
      }
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users size={22} className="text-cyan-500" /> User Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {pagination.total} team member{pagination.total !== 1 ? 's' : ''} in your pharmacy
            </p>
          </div>
          <Button onClick={() => setModal('create')} className="gap-2 shadow-cyan-200">
            <Plus size={15} /> Add User
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: pagination.total, color: 'from-cyan-400 to-teal-500' },
            { label: 'Active', value: users.filter(u => u.isActive).length, color: 'from-emerald-400 to-green-500' },
            { label: 'Owners', value: users.filter(u => u.role === 'owner').length, color: 'from-amber-400 to-orange-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-cyan-100 shadow-sm shadow-cyan-50 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                {s.value}
              </div>
              <p className="text-sm font-semibold text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 hover:border-cyan-300 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 hover:border-cyan-300 transition-all"
          >
            <option value="">All Roles</option>
            <option value="owner">Owner</option>
            <option value="pharmacist">Pharmacist</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-lg shadow-cyan-100/50 border border-cyan-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-500" />
              <p className="text-sm text-slate-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center">
                <Users size={28} className="text-cyan-300" />
              </div>
              <p className="font-medium">No users found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => {
                    const initials = `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
                    return (
                      <tr key={u._id} className="hover:bg-cyan-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColor(u.firstName)} flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0`}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{u.firstName} {u.lastName}</p>
                              <p className="text-slate-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={roleVariant[u.role]}>{u.role}</Badge>
                        </td>
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
                            <button
                              onClick={() => setModal(u)}
                              className="p-2 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(u)}
                              className={`p-2 rounded-xl transition-all ${u.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                            >
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
              <Button variant="ghost" onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className="px-3 py-2">
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.pages} className="px-3 py-2">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <UserModal
          user={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchUsers}
        />
      )}
    </div>
  );
}
