import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  FileText, 
  DownloadCloud, 
  Search, 
  Filter, 
  Calendar,
  Loader2,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { format } from 'date-fns';
import ReceiptPreview from '../components/ui/ReceiptPreview';

const Reports = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await API.get('/receipts');
      setReceipts(res.data);
    } catch (err) {
      console.error('Failed to fetch receipts', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReceipts = receipts.filter(r => 
    r.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreview = (receipt) => {
    setSelectedReceipt({
      receiptNo: receipt.receiptNo,
      date: format(new Date(receipt.createdAt), 'dd MMM yyyy'),
      studentName: receipt.studentId?.name,
      course: receipt.enrollmentId?.courseName,
      paymentMode: receipt.paymentId?.paymentMode || 'UPI',
      transactionId: receipt.paymentId?.transactionId || '—',
      totalAmount: receipt.enrollmentId?.totalFees,
      paidAmount: receipt.paidAmount,
      balance: receipt.balance,
      status: receipt.status
    });
  };

  if (selectedReceipt) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedReceipt(null)}
            className="gap-2 text-textSecondary font-bold"
          >
            <ChevronRight className="rotate-180" size={18} /> Back to History
          </Button>
          <div className="bg-[#0EA5E9]/5 text-[#0EA5E9] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-[#0EA5E9]/10">
            Previewing: {selectedReceipt.receiptNo}
          </div>
        </header>
        <ReceiptPreview data={selectedReceipt} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">Receipt History</h2>
          <p className="text-textSecondary text-[11px] mt-0.5">Audit and download all payment receipts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200 shadow-sm text-xs py-1.5">
            <Calendar size={14} /> Date
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200 shadow-sm text-xs py-1.5">
            <DownloadCloud size={14} /> Export
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search receipts..."
            className="w-full bg-white border border-gray-100 shadow-soft rounded-xl py-2 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 rounded-xl px-4 border-gray-100 bg-white shadow-soft text-xs py-2">
          <Filter size={14} /> Filters
        </Button>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Receipt ID</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Student</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Course</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Amount</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">Status</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <Loader2 className="animate-spin inline-block text-[#0EA5E9] mb-1" size={24} />
                    <p className="text-textSecondary font-black text-[9px] uppercase tracking-widest">Fetching reports...</p>
                  </td>
                </tr>
              ) : filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-textSecondary text-xs font-medium">No receipts found</td>
                </tr>
              ) : filteredReceipts.map((receipt) => (
                <tr key={receipt._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#0EA5E9]/5 rounded-lg text-[#0EA5E9]">
                        <FileText size={14} />
                      </div>
                      <span className="text-xs font-black text-textPrimary tracking-tight">{receipt.receiptNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-textPrimary leading-tight">{receipt.studentId?.name}</span>
                      <span className="text-[9px] text-gray-400 font-bold">{receipt.studentId?.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[10px] font-bold text-textSecondary">{receipt.enrollmentId?.courseName || '—'}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-textPrimary">₹{receipt.paidAmount?.toLocaleString()}</span>
                      <span className="text-[9px] text-gray-400 font-bold">{format(new Date(receipt.createdAt), 'dd MMM yy')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border inline-block",
                      receipt.status === 'FULLY_PAID' ? "bg-secondary/10 text-secondary border-secondary/20" :
                        receipt.status === 'PARTIAL' ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-danger/10 text-danger border-danger/20"
                    )}>
                      {receipt.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handlePreview(receipt)}
                        className="p-1.5 text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/5 rounded-lg transition-all"
                        title="View & Download"
                      >
                        <DownloadCloud size={16} />
                      </button>
                    </div>
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

export default Reports;
