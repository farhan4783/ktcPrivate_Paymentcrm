import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Check, X, User, Shield, Clock, Filter, 
  Plus, Edit3, Trash2, Key, Loader2, 
  AlertTriangle, Eye, UserCog, Save
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form data
  const [createData, setCreateData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [editData, setEditData] = useState({ name: '', email: '', role: '', status: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/admin/users${filter ? `?status=${filter}` : ''}`);
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      await API.put(`/admin/${action}/${userId}`, {});
      toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/admin/users', createData);
      toast.success('User created successfully!');
      setShowCreateModal(false);
      setCreateData({ name: '', email: '', password: '', role: 'staff' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit User
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/admin/users/${selectedUser._id}`, editData);
      toast.success('User updated!');
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    setSubmitting(true);
    try {
      await API.delete(`/admin/users/${selectedUser._id}`);
      toast.success('User deleted');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset Password
  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowResetPasswordModal(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/admin/users/${selectedUser._id}/reset-password`, { newPassword });
      toast.success('Password reset successfully!');
      setShowResetPasswordModal(false);
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return { icon: Shield, color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10' };
      case 'staff': return { icon: UserCog, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'viewer': return { icon: Eye, color: 'text-green-600', bg: 'bg-green-100' };
      default: return { icon: User, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-borderSubtle">
        <div>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">User Management</h2>
          <p className="text-textSecondary text-[11px] mt-0.5">Create accounts, manage access and permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={14} />
            <select 
              className="pl-9 pr-6 py-2 bg-bgSecondary border-none rounded-xl text-[11px] font-bold text-textPrimary focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all appearance-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2 rounded-xl shadow-lg shadow-[#0EA5E9]/20 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-xs py-2">
            <Plus size={16} /> Create User
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 overflow-hidden border border-borderSubtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bgSecondary/50 border-b border-borderSubtle">
                <th className="px-6 py-3 text-[10px] font-black text-textSecondary uppercase tracking-widest">User Details</th>
                <th className="px-6 py-3 text-[10px] font-black text-textSecondary uppercase tracking-widest">Role</th>
                <th className="px-6 py-3 text-[10px] font-black text-textSecondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[10px] font-black text-textSecondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-textSecondary font-medium text-xs">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-textSecondary font-medium text-xs">No users found</td>
                </tr>
              ) : users.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                const RoleIcon = roleBadge.icon;
                return (
                  <tr key={user._id} className="group hover:bg-bgSecondary/30 transition-colors">
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-lg flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-textPrimary text-xs leading-tight">{user.name}</div>
                          <div className="text-[10px] text-textSecondary font-medium leading-tight">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${roleBadge.bg} ${roleBadge.color}`}>
                        <RoleIcon size={11} />
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border inline-block ${getStatusStyle(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleAction(user._id, 'approve')} className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg shadow-green-500/20 transition-all" title="Approve">
                              <Check size={14} />
                            </button>
                            <button onClick={() => handleAction(user._id, 'reject')} className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg shadow-red-500/20 transition-all" title="Reject">
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit User">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => openResetPasswordModal(user)} className="p-1.5 text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 rounded-lg transition-all" title="Reset Password">
                          <Key size={14} />
                        </button>
                        <button onClick={() => openDeleteModal(user)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete User">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* MODAL: Create New User */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><X size={18} /></button>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mb-3"><Plus size={24} /></div>
              <h3 className="text-lg font-black text-textPrimary tracking-tight">Create New User</h3>
              <p className="text-[11px] text-textSecondary mt-0.5">This user will be auto-approved and can log in immediately.</p>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required value={createData.name} onChange={(e) => setCreateData({...createData, name: e.target.value})} placeholder="Enter name" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input required type="email" value={createData.email} onChange={(e) => setCreateData({...createData, email: e.target.value})} placeholder="email@example.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input required type="password" value={createData.password} onChange={(e) => setCreateData({...createData, password: e.target.value})} placeholder="Min 6 characters" minLength={6} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                <select value={createData.role} onChange={(e) => setCreateData({...createData, role: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all appearance-none cursor-pointer">
                  <option value="staff">Staff — Full CRM Access</option>
                  <option value="viewer">Viewer — Read-Only Access</option>
                </select>
              </div>
              <Button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-[#0EA5E9]/20 mt-2">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                {submitting ? 'Creating...' : 'Create User'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit User */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button onClick={() => setShowEditModal(false)} className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><X size={18} /></button>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-3"><Edit3 size={24} /></div>
              <h3 className="text-lg font-black text-textPrimary tracking-tight">Edit User</h3>
            </div>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                <input required value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input required type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                  <select value={editData.role} onChange={(e) => setEditData({...editData, role: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none appearance-none cursor-pointer">
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none appearance-none cursor-pointer">
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-amber-500/20 mt-2 bg-amber-500 hover:bg-amber-600">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button onClick={() => setShowResetPasswordModal(false)} className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><X size={18} /></button>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mb-3"><Key size={24} /></div>
              <h3 className="text-lg font-black text-textPrimary tracking-tight">Reset Password</h3>
              <p className="text-[11px] text-textSecondary mt-0.5">Set a new password for <strong>{selectedUser.name}</strong></p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-[#0EA5E9]/20 mt-2">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />}
                {submitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirm */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
            <h3 className="text-lg font-black text-textPrimary tracking-tight mb-1">Delete User?</h3>
            <p className="text-[12px] text-textSecondary mb-1">This will permanently delete <strong>{selectedUser.name}</strong>'s account.</p>
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-6">This action cannot be undone</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-2xl">Cancel</Button>
              <Button onClick={handleDeleteUser} disabled={submitting} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 gap-2">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                {submitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
