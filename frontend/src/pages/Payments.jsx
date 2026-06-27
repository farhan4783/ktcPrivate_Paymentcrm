import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import ReceiptPreview from '../components/ui/ReceiptPreview';

const Payments = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      mode: 'UPI',
      amount: '',
      studentId: '',
      enrollmentId: '',
      transactionId: ''
    }
  });

  const mode = watch('mode');
  const studentId = watch('studentId');
  const enrollmentId = watch('enrollmentId');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (studentId) {
      const student = students.find(s => s._id === studentId);
      setSelectedStudent(student);
      setEnrollments(student.enrollments || []);
      setValue('enrollmentId', '');
      setSelectedEnrollment(null);
    } else {
      setSelectedStudent(null);
      setEnrollments([]);
    }
  }, [studentId, students, setValue]);

  useEffect(() => {
    if (enrollmentId) {
      const enrollment = enrollments.find(e => e._id === enrollmentId);
      setSelectedEnrollment(enrollment);
    } else {
      setSelectedEnrollment(null);
    }
  }, [enrollmentId, enrollments]);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students');
      setStudents(res.data);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await API.post('/payments', {
        enrollmentId: data.enrollmentId,
        amountPaid: Number(data.amount),
        paymentMode: data.mode,
        transactionId: data.transactionId
      });

      const { receipt } = res.data;
      
      setGeneratedReceipt({
        receiptNo: receipt.receiptNo,
        date: new Date(receipt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        studentName: selectedStudent.name,
        course: selectedEnrollment.courseName,
        paymentMode: data.mode,
        transactionId: data.transactionId || '—',
        totalAmount: selectedEnrollment.totalFees,
        paidAmount: Number(data.amount),
        balance: receipt.balance,
        status: receipt.status
      });

      toast.success('Payment recorded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role === 'viewer') {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20 bg-white p-10 rounded-[32px] border border-gray-100 shadow-soft">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto">
          <Info size={32} />
        </div>
        <h3 className="text-xl font-black text-textPrimary tracking-tight">Read-Only Access</h3>
        <p className="text-sm text-textSecondary leading-relaxed">
          You are logged in with a read-only viewer account. You can view all payments and student profiles, but you do not have permission to record new payments.
        </p>
      </div>
    );
  }

  if (generatedReceipt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => {
              setGeneratedReceipt(null);
              reset();
              fetchStudents();
            }}
            className="gap-2 text-textSecondary font-bold"
          >
            <ArrowLeft size={18} /> Record Another Payment
          </Button>
          <div className="flex items-center gap-2 text-secondary font-black uppercase text-xs tracking-widest bg-secondary/10 px-4 py-2 rounded-xl">
            <CheckCircle2 size={16} /> Payment Verified & Saved
          </div>
        </div>
        <ReceiptPreview data={generatedReceipt} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0EA5E9]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="text-center mb-2">
        <h2 className="text-2xl font-black text-textPrimary tracking-tight">Revenue Gateway</h2>
        <p className="text-textSecondary text-[11px] mt-0.5">Process payments against enrollments.</p>
      </header>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Student</label>
              <select 
                {...register('studentId', { required: 'Student is required' })}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all cursor-pointer"
              >
                <option value="">Choose a student...</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.phone})
                  </option>
                ))}
              </select>
              {errors.studentId && <p className="text-[10px] text-danger font-medium">{errors.studentId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Course</label>
              <select 
                disabled={!studentId}
                {...register('enrollmentId', { required: 'Course selection is required' })}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">{studentId ? 'Choose a course...' : 'Select student first'}</option>
                {enrollments.map(e => (
                  <option key={e._id} value={e._id}>
                    {e.courseName} - ₹{e.balance.toLocaleString()} Due
                  </option>
                ))}
              </select>
              {errors.enrollmentId && <p className="text-[10px] text-danger font-medium">{errors.enrollmentId.message}</p>}
            </div>
          </div>

          {selectedEnrollment && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Fee</label>
                <input 
                  value={`₹${selectedEnrollment.totalFees?.toLocaleString()}`} 
                  readOnly 
                  className="flex h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-black text-textPrimary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Balance</label>
                <input 
                  value={`₹${selectedEnrollment.balance?.toLocaleString()}`} 
                  readOnly 
                  className={cn(
                    "flex h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-black outline-none",
                    selectedEnrollment.balance > 0 ? "text-danger" : "text-secondary"
                  )}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'UPI', icon: Wallet, label: 'UPI' },
                { id: 'Cash', icon: Banknote, label: 'Cash' },
                { id: 'Bank', icon: CreditCard, label: 'Bank' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setValue('mode', m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all",
                    mode === m.id 
                      ? "border-[#0EA5E9] bg-[#0EA5E9]/5 text-[#0EA5E9]" 
                      : "border-gray-100 hover:border-gray-200 text-textSecondary"
                  )}
                >
                  <m.icon size={18} strokeWidth={mode === m.id ? 2.5 : 2} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (₹)</label>
              <input 
                type="number"
                placeholder="Enter amount"
                {...register('amount', { 
                  required: 'Amount is required',
                  max: { value: selectedEnrollment?.balance, message: 'Exceeds balance' }
                })}
                className="flex h-12 w-full rounded-2xl border border-gray-200 bg-white px-5 py-2 text-lg font-black text-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all placeholder:text-gray-300"
              />
              {errors.amount && <p className="text-[10px] text-danger font-medium">{errors.amount.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference</label>
              <input 
                placeholder={mode === 'Cash' ? 'N/A' : 'UTR / Ref Number'}
                disabled={mode === 'Cash'}
                {...register('transactionId', { required: mode !== 'Cash' })}
                className="flex h-12 w-full rounded-2xl border border-gray-200 bg-white px-5 py-2 text-xs font-bold text-textPrimary focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all disabled:bg-gray-50 disabled:text-gray-300"
              />
              {errors.transactionId && <p className="text-[10px] text-danger font-medium">{errors.transactionId.message}</p>}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl flex items-start gap-3 border border-gray-100">
            <Info size={16} className="text-[#0EA5E9] mt-0.5" />
            <p className="text-[10px] text-textSecondary leading-relaxed">
              Recording payment for <strong>{selectedEnrollment?.courseName || 'selected course'}</strong> will update status and generate receipt.
            </p>
          </div>

          <Button 
            size="lg" 
            type="submit" 
            disabled={submitting || !selectedEnrollment}
            className="w-full py-4 rounded-[20px] text-sm font-black uppercase tracking-widest gap-2 shadow-xl shadow-[#0EA5E9]/20"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck size={18} /> 
                Confirm Payment
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};


export default Payments;
