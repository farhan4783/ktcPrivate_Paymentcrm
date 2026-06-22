import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { Check, X, User, Shield, Clock, Search, Filter } from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-borderSubtle">
        <div>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">User Management</h2>
          <p className="text-textSecondary text-[11px] mt-0.5">Manage team access requests.</p>
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
              ) : users.map((user) => (
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
                    <div className="flex items-center gap-2 text-textPrimary font-bold text-[11px]">
                      {user.role === 'admin' ? <Shield size={12} className="text-[#0EA5E9]" /> : <User size={12} className="text-textSecondary" />}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border inline-block ${getStatusStyle(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-right">
                    {user.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAction(user._id, 'approve')}
                          className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg shadow-green-500/20 transition-all"
                          title="Approve"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleAction(user._id, 'reject')}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg shadow-red-500/20 transition-all"
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    {user.status !== 'PENDING' && (
                      <span className="text-[10px] text-textSecondary font-medium italic">Action completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
