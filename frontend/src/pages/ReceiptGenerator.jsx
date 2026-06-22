import React, { useState } from 'react';
import API from '../services/api';
import { 
  FilePlus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  DollarSign, 
  CreditCard,
  Hash,
  Loader2,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import ReceiptPreview from '../components/ui/ReceiptPreview';
import { toast } from 'react-hot-toast';

const ReceiptGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Web Development',
    totalFees: '',
    amountPaid: '',
    paymentMode: 'UPI',
    transactionId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/receipts/generate', formData);
      
      // Transform backend response to match Preview component format
      const receipt = res.data;
      setGeneratedReceipt({
        receiptNo: receipt.receiptNo,
        date: new Date(receipt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        studentName: receipt.studentId?.name,
        course: receipt.enrollmentId?.courseName,
        paymentMode: receipt.paymentId?.paymentMode,
        transactionId: receipt.paymentId?.transactionId || '—',
        totalAmount: receipt.enrollmentId?.totalFees,
        paidAmount: receipt.paidAmount,
        balance: receipt.balance,
        status: receipt.status
      });
      
      toast.success('Receipt generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate receipt');
    } finally {
      setLoading(false);
    }
  };

  if (generatedReceipt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setGeneratedReceipt(null)}
            className="gap-2 text-textSecondary font-bold"
          >
            <ArrowLeft size={18} /> Create New Receipt
          </Button>
          <div className="flex items-center gap-2 text-secondary font-black uppercase text-xs tracking-widest bg-secondary/10 px-4 py-2 rounded-xl">
            <CheckCircle2 size={16} /> Receipt Saved to Database
          </div>
        </div>
        <ReceiptPreview data={generatedReceipt} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-1">
        <div className="w-12 h-12 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-xl flex items-center justify-center mx-auto mb-2">
          <FilePlus size={24} />
        </div>
        <h2 className="text-2xl font-black text-textPrimary tracking-tight">Generate New Receipt</h2>
        <p className="text-textSecondary text-[11px] max-w-md mx-auto">
          Enter student and payment details to generate a digital receipt.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Student Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <User className="text-[#0EA5E9]" size={16} />
              <h3 className="font-black text-sm text-textPrimary uppercase tracking-tight">Student Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                    <option>Full Stack Development</option>
                    <option>Digital Marketing</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <DollarSign className="text-[#0EA5E9]" size={16} />
              <h3 className="font-black text-sm text-textPrimary uppercase tracking-tight">Payment Information</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Fee (₹)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    required
                    name="totalFees"
                    type="number"
                    value={formData.totalFees}
                    onChange={handleChange}
                    placeholder="Total amount"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Paid Now (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    required
                    name="amountPaid"
                    type="number"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    placeholder="Payment amount"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mode</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer / NEFT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction ID</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="Ref no. / UTR no."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 rounded-2xl text-base font-black uppercase tracking-widest gap-3 shadow-xl shadow-[#0EA5E9]/20 mt-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <FilePlus size={20} />
              Generate & Save Receipt
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

const Wallet = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

export default ReceiptGenerator;
