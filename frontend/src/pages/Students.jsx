import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { studentAPI, exportAPI } from '../services/api';
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
  AlertTriangle,
  DownloadCloud,
  Tag,
  MapPin
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
  
  // Filters
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTag, setFilterTag] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  
  // Selection for bulk actions
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkTagInput, setBulkTagInput] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Web Development',
    totalFees: '',
    tags: '',
    address: '',
    source: 'Walk-in'
  });
  
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    email: '',
    tags: '',
    address: '',
    source: 'Walk-in'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getStudents();
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
      // Process tags string into array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      await studentAPI.createStudent({
        ...formData,
        tags: tagsArray
      });
      
      toast.success('Student added successfully!');
      setShowAddModal(false);
      setFormData({ 
        name: '', 
        phone: '', 
        email: '', 
        course: 'Web Development', 
        totalFees: '', 
        tags: '', 
        address: '', 
        source: 'Walk-in' 
      });
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
      email: student.email,
      tags: (student.tags || []).join(', '),
      address: student.address || '',
      source: student.source || 'Walk-in'
    });
    setShowEditModal(true);
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagsArray = editData.tags
        ? editData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      await studentAPI.updateStudent(selectedStudent._id, {
        ...editData,
        tags: tagsArray
      });

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
      await studentAPI.deleteStudent(selectedStudent._id);
      toast.success('Student deleted successfully');
      setShowDeleteModal(false);
      setSelectedStudent(null);
      
      // Remove from selection if deleted
      setSelectedStudentIds(prev => prev.filter(id => id !== selectedStudent._id));
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedStudentIds.length} students?`)) return;
    setSubmitting(true);
    try {
      await studentAPI.bulkDeleteStudents(selectedStudentIds);
      toast.success(`${selectedStudentIds.length} students deleted successfully`);
      setSelectedStudentIds([]);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to perform bulk deletion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkAddTags = async (e) => {
    e.preventDefault();
    if (!bulkTagInput) return;
    setSubmitting(true);
    try {
      const newTags = bulkTagInput.split(',').map(t => t.trim()).filter(Boolean);
      await studentAPI.bulkAddTags(selectedStudentIds, newTags);
      toast.success('Tags added successfully!');
      setShowBulkTagModal(false);
      setBulkTagInput('');
      setSelectedStudentIds([]);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to add tags');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await exportAPI.exportStudents();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Students exported successfully!');
    } catch (err) {
      toast.error('Failed to export students');
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

  // Extract all unique tags for filter dropdown
  const uniqueTags = Array.from(new Set(students.flatMap(s => s.tags || [])));

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesCourse = filterCourse === 'All' || s.enrollments?.some(e => e.courseName === filterCourse);

    const isFullyPaid = s.enrollments?.every(e => e.status === 'FULLY_PAID');
    const isPartial = s.enrollments?.some(e => e.status === 'PARTIAL');
    const computedStatus = (isFullyPaid && s.enrollments.length > 0) ? 'FULLY PAID' : isPartial ? 'PARTIAL' : 'DUE';
    const matchesStatus = filterStatus === 'All' || computedStatus === filterStatus;

    const matchesTag = filterTag === 'All' || s.tags?.includes(filterTag);

    return matchesSearch && matchesCourse && matchesStatus && matchesTag;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">Student Directory</h2>
          <p className="text-textSecondary text-[11px] mt-0.5">Manage students, enrollments, and status tracking.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 rounded-xl border-gray-200 text-xs py-1.5">
            <DownloadCloud size={14} /> Export CSV
          </Button>
          {!isViewer && (
            <Button onClick={() => setShowAddModal(true)} className="gap-2 rounded-xl shadow-lg shadow-[#0EA5E9]/20 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
              <Plus size={18} /> Add Student
            </Button>
          )}
        </div>
      </header>

      {/* Bulk Actions Bar */}
      {selectedStudentIds.length > 0 && !isViewer && (
        <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-300">
          <span className="text-xs font-black uppercase tracking-wider">{selectedStudentIds.length} students selected</span>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowBulkTagModal(true)} 
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs py-1.5"
            >
              Add Tag
            </Button>
            <Button 
              onClick={handleBulkDelete} 
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs py-1.5"
            >
              Delete Selected
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedStudentIds([])} 
              className="text-gray-400 hover:text-white text-xs py-1.5"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
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
        <div className="flex flex-wrap gap-3">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="bg-white border border-gray-100 shadow-soft rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#0EA5E9]/10 cursor-pointer"
          >
            <option value="All">All Courses</option>
            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-100 shadow-soft rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#0EA5E9]/10 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="FULLY PAID">Fully Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="DUE">Due</option>
          </select>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="bg-white border border-gray-100 shadow-soft rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#0EA5E9]/10 cursor-pointer"
          >
            <option value="All">All Tags</option>
            {uniqueTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-center border-b border-gray-50 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded text-[#0EA5E9] focus:ring-[#0EA5E9]/10" 
                    checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudentIds(filteredStudents.map(s => s._id));
                      } else {
                        setSelectedStudentIds([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50">Source</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50">Courses</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50 text-right">Aggregate Balance</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50 text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] border-b border-gray-50"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin inline-block mr-2 text-[#0EA5E9]" size={32} />
                    <p className="text-textSecondary font-black text-xs uppercase tracking-widest mt-2">Fetching CRM Records...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center text-textSecondary font-bold italic">No students found in your records.</td>
                </tr>
              ) : filteredStudents.map((student) => {
                return (
                  <tr key={student._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-5 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-[#0EA5E9] focus:ring-[#0EA5E9]/10"
                        checked={selectedStudentIds.includes(student._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudentIds([...selectedStudentIds, student._id]);
                          } else {
                            setSelectedStudentIds(selectedStudentIds.filter(id => id !== student._id));
                          }
                        }}
                      />
                    </td>
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
                            {student.tags && student.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {student.tags.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 text-[8px] font-black uppercase bg-gray-100 text-gray-500 rounded border border-gray-200/50">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-bold text-textSecondary bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full uppercase">
                        {student.source || 'Walk-in'}
                      </span>
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
          <div className="bg-white rounded-[32px] w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] overflow-y-auto">
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
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lead Source</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Online">Online</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g. VIP, Follow-up"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 text-gray-400" size={15} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Student physical address"
                      rows={2}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                    />
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
          <div className="bg-white rounded-[32px] w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] overflow-y-auto">
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
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lead Source</label>
                  <select
                    value={editData.source}
                    onChange={(e) => setEditData({...editData, source: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Online">Online</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      value={editData.tags}
                      onChange={(e) => setEditData({...editData, tags: e.target.value})}
                      placeholder="e.g. VIP, Follow-up"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 text-gray-400" size={15} />
                  <textarea
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    placeholder="Student physical address"
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
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

      {/* Bulk Add Tag Modal */}
      {showBulkTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button 
              onClick={() => { setShowBulkTagModal(false); setBulkTagInput(''); }} 
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mb-3">
                <Tag size={24} />
              </div>
              <h3 className="text-lg font-black text-textPrimary tracking-tight">Bulk Add Tag</h3>
              <p className="text-[11px] text-textSecondary mt-0.5">Apply tags to {selectedStudentIds.length} selected students.</p>
            </div>
            
            <form onSubmit={handleBulkAddTags} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                <input
                  required
                  value={bulkTagInput}
                  onChange={(e) => setBulkTagInput(e.target.value)}
                  placeholder="e.g. June-Batch, Paid-Full"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                />
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-[#0EA5E9]/20 mt-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Tag size={16} />}
                {submitting ? 'Applying...' : 'Apply Tags'}
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
