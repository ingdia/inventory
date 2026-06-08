import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users, Plus, Search, UserCheck, UserX, Pencil, X, Mail,
  Phone, ShieldCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema, updateProfileSchema } from '../utils/schemas';
import { userService } from '../services/auth.service';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

const roleVariant = { owner: 'warning', pharmacist: 'success' };

// ─── Modal ───────────────────────────────────────────────────────────────────
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit User' : 'Create New User'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" placeholder="Jane" icon={ShieldCheck} error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name" placeholder="Doe" icon={ShieldCheck} error={errors.lastName?.message} {...register('lastName')} />
          </div>

          {!isEdit && (
            <>
              <Input label="Email" type="email" placeholder="jane@pharmacy.com" icon={Mail} error={errors.email?.message} {...register('email')} />
              <Input label="Password" type="password" placeholder="Min 8 chars" icon={ShieldCheck} error={errors.password?.message} {...register('password')} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Role</label>
                <select
                  {...register('role')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                >
                  <option value="pharmacist">Pharmacist</option>
                  <option value="owner">Owner</option>
                </select>
                {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
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
  const [modal, setModal] = useState(null); // null | 'create' | user object
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
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users size={22} className="text-emerald-400" /> User Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">{pagination.total} total users</p>
          </div>
          <Button onClick={() => setModal('create')} className="gap-2">
            <Plus size={15} /> Add User
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="px-4 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="">All Roles</option>
            <option value="owner">Owner</option>
            <option value="pharmacist">Pharmacist</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Users size={40} className="mb-3 opacity-30" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => {
                    const initials = `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
                    return (
                      <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-white">{u.firstName} {u.lastName}</p>
                              <p className="text-slate-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={roleVariant[u.role]}>{u.role}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={u.isActive ? 'success' : 'danger'}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setModal(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                              title="Edit user"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(u)}
                              className={`p-1.5 rounded-lg transition-all ${u.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
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
            <p className="text-sm text-slate-400">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3"
              >
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
