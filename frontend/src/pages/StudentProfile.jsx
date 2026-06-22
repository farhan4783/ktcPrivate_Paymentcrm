import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  BookOpen, 
  Edit3, 
  Plus,
  X,
  CreditCard,
  DownloadCloud,
  Loader2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CalendarDays,
  History,
  MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ReceiptPreview from '../components/ui/ReceiptPreview';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddEnrollment, setShowAddEnrollment] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);
  const [newEnrollment, setNewEnrollment] = useState({ courseName: 'Web Development', totalFees: '' });

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const handleViewReceipt = (payment) => {
    const enrollment = student.enrollments?.find(e => e._id === payment.enrollmentId);
    setSelectedPaymentData({
      receiptNo: payment.receiptNo || `KTC-${format(new Date(payment.createdAt), 'yyyy')}-${payment._id.slice(-4).toUpperCase()}`,
      date: format(new Date(payment.createdAt), 'dd MMM yyyy'),
      studentName: student.name,
      course: enrollment?.courseName || 'N/A',
      paymentMode: payment.paymentMode,
      transactionId: payment.transactionId || '—',
      totalAmount: enrollment?.totalFees || 0,
      paidAmount: payment.amountPaid,
      balance: payment.remainingBalance ?? (enrollment?.totalFees - payment.amountPaid),
      status: payment.amountPaid >= (enrollment?.totalFees || 0) ? "FULLY_PAID" : "PARTIAL"
    });
    setShowReceiptModal(true);
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await API.get(`/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      console.error('Failed to fetch student profile', err);
      toast.error('Could not load student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEnrollment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/students/${id}/enroll`, newEnrollment);
      toast.success('New course added successfully!');
      setShowAddEnrollment(false);
      fetchStudentProfile();
    } catch (err) {
      toast.error('Failed to add new course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-[#0EA5E9]" size={48} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-black text-textPrimary">Student not found</h2>
        <Link to="/students" className="text-[#0EA5E9] font-bold hover:underline">Back to Students</Link>
      </div>
    );
  }

  const totalPaid = student.enrollments?.reduce((sum, e) => sum + e.paidAmount, 0) || 0;
  const totalBalance = student.enrollments?.reduce((sum, e) => sum + e.balance, 0) || 0;

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link to="/students" className="flex items-center gap-2 text-xs font-black text-[#0EA5E9] uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit">
            <ArrowLeft size={14} /> Back to CRM
          </Link>
          <h2 className="text-4xl font-black text-textPrimary tracking-tight">Student Details</h2>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddEnrollment(true)} className="gap-2 rounded-2xl shadow-xl shadow-[#0EA5E9]/20">
            <Plus size={18} /> Enroll in New Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* TOP ROW: Identity & Financial Overview */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-soft flex flex-col items-center text-center relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-16 bg-[#0EA5E9]/5 -z-0"></div>
            
            <div className="relative z-10 mb-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex items-center justify-center bg-[#0EA5E9] text-white font-black text-2xl rotate-1">
                {student.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-secondary text-white p-1 rounded-md shadow-md border border-white">
                <ShieldCheck size={12} />
              </div>
            </div>

            <div className="z-10 space-y-0.5">
              <h3 className="text-lg font-black text-textPrimary tracking-tight">{student.name}</h3>
              <p className="text-[8px] font-black uppercase text-secondary tracking-widest bg-secondary/10 px-2 py-0.5 rounded-full inline-block">Verified</p>
            </div>
            
            <div className="w-full mt-4 p-3 bg-gray-50/50 rounded-2xl space-y-2 text-left border border-gray-100">
              <a href={`tel:${student.phone}`} className="flex items-center gap-2.5 group cursor-pointer hover:bg-gray-100/50 p-1.5 -mx-1.5 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#0EA5E9] transition-colors shadow-sm">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none">Phone (Call Now)</p>
                  <p className="text-[12px] font-bold text-textPrimary">{student.phone}</p>
                </div>
              </a>
              <div className="flex items-center gap-2.5 group p-1.5 -mx-1.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#0EA5E9] transition-colors shadow-sm">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none">Email</p>
                  <p className="text-[12px] font-bold text-textPrimary break-all">{student.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-gray-900 p-6 rounded-[32px] text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Financial Summary Overview</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Total Paid</p>
                      <p className="text-2xl font-black text-white tracking-tight">₹{totalPaid.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-danger/20 rounded-xl flex items-center justify-center text-danger">
                      <TrendingDown size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Balance Due</p>
                      <p className="text-2xl font-black text-white tracking-tight">₹{totalBalance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Active Course Enrollments</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.enrollments?.map(e => (
                    <span key={e._id} className="px-2 py-1 bg-[#0EA5E9]/20 rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#0EA5E9]/20 text-[#0EA5E9]">
                      {e.courseName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0EA5E9]/10 rounded-full blur-[80px]"></div>
          </div>
        </div>

        {/* SECOND ROW: Course History */}
        <div className="lg:col-span-12 space-y-12 mt-4">
          {/* Enrollments Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <div className="w-1.5 h-6 bg-[#0EA5E9] rounded-full"></div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-textSecondary">Course History</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {student.enrollments?.map((e) => (
                <div key={e._id} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-soft group hover:shadow-xl hover:translate-y-[-4px] transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-9 h-9 bg-[#0EA5E9]/10 rounded-xl flex items-center justify-center text-[#0EA5E9] group-hover:scale-110 transition-transform">
                      <BookOpen size={16} />
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm",
                      e.status === 'FULLY_PAID' ? "bg-secondary/10 text-secondary border-secondary/20" :
                        e.status === 'PARTIAL' ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-danger/10 text-danger border-danger/20"
                    )}>
                      {e.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-0.5 mb-4">
                    <h5 className="text-base font-black text-textPrimary tracking-tight leading-tight">{e.courseName}</h5>
                    <div className="flex items-center gap-1 text-gray-400">
                      <CalendarDays size={10} />
                      <p className="text-[8px] font-bold uppercase tracking-widest">Enrolled {format(new Date(e.createdAt), 'dd MMM yy')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Paid</p>
                      <p className="text-[13px] font-black text-secondary tracking-tight">₹{e.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bal.</p>
                      <p className="text-[13px] font-black text-danger tracking-tight">₹{e.balance.toLocaleString()}</p>
                    </div>
                  </div>

                  {e.balance > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-50 flex flex-col gap-2">
                      <a 
                        href={`https://wa.me/${student.phone?.length === 10 ? '91' + student.phone : student.phone}?text=${encodeURIComponent(`Hi ${student.name},

Greetings from Kode to Career.

This is a reminder that you have enrolled in our ${e.courseName} course. The total course fee is ₹${(e.paidAmount + e.balance).toLocaleString()}, out of which ₹${e.paidAmount.toLocaleString()} has already been paid. Your remaining pending amount is ₹${e.balance.toLocaleString()}.

Kindly complete the pending payment at your earliest convenience. Please feel free to contact us if you need any assistance.

Thank you.
Team Kode to Career`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-[10px] font-black uppercase tracking-widest"
                      >
                        <MessageCircle size={14} /> Send Reminder
                      </a>
                      <a 
                        href={`tel:${student.phone}`}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 transition-colors text-[10px] font-black uppercase tracking-widest"
                      >
                        <Phone size={14} /> Call Now
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-Width Transaction Log */}
        <div className="lg:col-span-12">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-textSecondary">
                <History size={18} />
              </div>
              <h4 className="text-lg font-black text-textPrimary tracking-tight">Transaction Log</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                    <th className="pb-4 px-4">Timestamp</th>
                    <th className="pb-4 px-4">Course Ref</th>
                    <th className="pb-4 px-4">Amount</th>
                    <th className="pb-4 px-4">Channel</th>
                    <th className="pb-4 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {student.payments?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-textSecondary font-bold text-xs italic">No records.</td>
                    </tr>
                  ) : student.payments?.map((payment) => {
                    const enrollment = student.enrollments?.find(e => e._id === payment.enrollmentId);
                    return (
                      <tr key={payment._id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-textPrimary">{format(new Date(payment.createdAt), 'dd MMM yyyy')}</span>
                            <span className="text-[9px] text-gray-400 font-bold">{format(new Date(payment.createdAt), 'hh:mm a')}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[9px] font-black uppercase text-[#0EA5E9] bg-[#0EA5E9]/5 px-2 py-1 rounded-lg border border-[#0EA5E9]/10">
                            {enrollment?.courseName || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-black text-textPrimary tracking-tight">₹{payment.amountPaid?.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              payment.paymentMode === 'UPI' ? "bg-secondary" : payment.paymentMode === 'Cash' ? "bg-warning" : "bg-[#0EA5E9]"
                            )}></div>
                            <span className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">{payment.paymentMode}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => handleViewReceipt(payment)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white text-textPrimary border border-gray-100 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all shadow-sm"
                          >
                            <DownloadCloud size={14} /> PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Receipt Preview */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-5xl h-[90vh] overflow-y-auto p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowReceiptModal(false)} 
              className="absolute top-8 right-8 z-10 p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors text-gray-500"
            >
              <X size={24} />
            </button>
            
            <div className="pt-8">
              <ReceiptPreview data={selectedPaymentData} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Enrollment */}
      {showAddEnrollment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-white">
            <button 
              onClick={() => setShowAddEnrollment(false)} 
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 z-10"
            >
              <X size={20} />
            </button>
            
            <form onSubmit={handleAddEnrollment} className="space-y-5 pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-black text-textPrimary tracking-tight">Add New Course</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Choose Course</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={newEnrollment.courseName}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, courseName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[20px] py-3.5 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                    <option>Full Stack Development</option>
                    <option>Digital Marketing</option>
                    <option>Python Programming</option>
                    <option>Android App Development</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admission Fees (₹)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="number"
                    value={newEnrollment.totalFees}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, totalFees: e.target.value })}
                    placeholder="Enter total course fee"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[20px] py-3.5 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-5 rounded-[24px] text-base font-black uppercase tracking-widest gap-3 shadow-2xl shadow-[#0EA5E9]/30 mt-2">
                Confirm Enrollment
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
