import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { COURSES } from '../utils/constants';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Loader2, 
  X, 
  User, 
  BookOpen, 
  CreditCard,
  ShieldCheck,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Students = () => {
  const { user: currentUser } = useAuth();
  const isViewer = currentUser?.role === 'viewer';
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Web Development',
    totalFees: ''
  });
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
      toast.error('Could not load student list');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/students', formData);
      toast.success('Student added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '', course: 'Web Development', totalFees: '' });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditData({
      name: student.name,
      phone: student.phone,
      email: student.email
    });
    setShowEditModal(true);
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/students/${selectedStudent._id}`, editData);
      toast.success('Student updated successfully!');
      setShowEditModal(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleDeleteStudent = async () => {
    setSubmitting(true);
    try {
      await API.delete(`/students/${selectedStudent._id}`);
      toast.success('Student deleted successfully');
      setShowDeleteModal(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (student) => {
    const isFullyPaid = student.enrollments?.every(e => e.status === 'FULLY_PAID');
    const isPartial = student.enrollments?.some(e => e.status === 'PARTIAL');
    
    if (isFullyPaid && student.enrollments.length > 0) return 'bg-secondary/10 text-secondary border-secondary/20';
    if (isPartial) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-danger/10 text-danger border-danger/20';
  };

  const getStatusText = (student) => {
    const isFullyPaid = student.enrollments?.every(e => e.status === 'FULLY_PAID');
    const isPartial = student.enrollments?.some(e => e.status === 'PARTIAL');
    
    if (isFullyPaid && student.enrollments.length > 0) return 'FULLY PAID';
    if (isPartial) return 'PARTIAL';
    return 'DUE';
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div></div>
        <div className="flex gap-3">
          {!isViewer && (
            <Button onClick={() => setShowAddModal(true)} className="gap-2 rounded-xl shadow-lg shadow-[#0EA5E9]/20 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
              <Plus size={18} /> Add Student
            </Button>
          )}
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..."
            className="w-full bg-white border border-gray-100 shadow-soft rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50">Courses</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50 text-right">Aggregate Balance</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50 text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin inline-block mr-2 text-[#0EA5E9]" size={32} />
                    <p className="text-textSecondary font-black text-xs uppercase tracking-widest mt-2">Fetching CRM Records...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-textSecondary font-bold italic">No students found in your records.</td>
                </tr>
              ) : filteredStudents.map((student) => {
                return (
                  <tr key={student._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/5 text-[#0EA5E9] flex items-center justify-center font-black text-base border border-[#0EA5E9]/10 shadow-sm group-hover:scale-105 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <Link to={`/students/${student._id}`} className="font-bold text-[14px] text-textPrimary hover:text-[#0EA5E9] tracking-tight transition-colors cursor-pointer block">{student.name}</Link>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <span className="flex items-center gap-1.5 text-[10px] text-textSecondary font-bold">
                              <Phone size={9} className="text-[#0EA5E9]" /> {student.phone}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-textSecondary font-bold">
                              <Mail size={9} className="text-[#0EA5E9]" /> {student.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-black text-textPrimary uppercase tracking-tight">{student.course}</span>
                        {student.enrollments?.length > 1 && (
                          <span className="text-[9px] font-black text-[#0EA5E9] bg-[#0EA5E9]/5 px-2 py-0.5 rounded-full w-fit">
                            +{student.enrollments.length - 1} More
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Total Due</p>
                      <p className={cn(
                        "text-base font-black tracking-tighter",
                        student.balance > 0 ? "text-danger" : "text-secondary"
                      )}>
                        ₹{student.balance?.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border whitespace-nowrap inline-block",
                        getStatusColor(student)
                      )}>
                        {getStatusText(student)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isViewer && (
                          <>
                            <button 
                              onClick={() => openEditModal(student)}
                              className="p-2 text-gray-300 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/5 rounded-lg transition-all"
                              title="Edit Student"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => openDeleteModal(student)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Student"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                        <Link 
                          to={`/students/${student._id}`}
                          className="p-2 text-gray-300 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/5 rounded-lg transition-all inline-block"
                        >
                          <MoreHorizontal size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button 
              onClick={() => setShowAddModal(false)} 
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mb-3">
                <User size={24} />
              </div>
              <h3 className="text-lg font-black text-textPrimary tracking-tight">New Student Entry</h3>
              <p className="text-[11px] text-textSecondary mt-0.5">Quickly register a new student profile.</p>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Student full name"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-10 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Mobile number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                      required
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Course</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admission Fees (₹)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        required
                        name="totalFees"
                        type="number"
                        value={formData.totalFees}
                        onChange={handleInputChange}
                        placeholder="Total fee"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-[#0EA5E9]/20 mt-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                {submitting ? 'Registering...' : 'Register Student'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button 
              onClick={() => { setShowEditModal(false); setSelectedStudent(null); }} 
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-3">
                <Edit3 size={24} />
              </div>
              <h3 className="text-lg font-black text-textPrimary tracking-tight">Edit Student</h3>
              <p className="text-[11px] text-textSecondary mt-0.5">Correct student details.</p>
            </div>
            
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  required
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                  <input
                    required
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input
                    required
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-amber-500/20 mt-2 bg-amber-500 hover:bg-amber-600"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Edit3 size={16} />}
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-textPrimary tracking-tight mb-1">Delete Student?</h3>
            <p className="text-[12px] text-textSecondary mb-1">
              This will permanently delete <strong>{selectedStudent.name}</strong> and all their enrollments, payments, and receipts.
            </p>
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-6">
              This action cannot be undone
            </p>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => { setShowDeleteModal(false); setSelectedStudent(null); }}
                className="flex-1 py-3 rounded-2xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteStudent}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 gap-2"
              >
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

export default Students;
