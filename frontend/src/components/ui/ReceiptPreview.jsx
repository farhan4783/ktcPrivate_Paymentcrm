import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Printer,
  Loader2,
  BookOpen
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { settingsAPI } from '../../services/api';

const ReceiptPreview = ({ data = {
  receiptNo: "KTC-2026-001-4660",
  date: "Sun May 03 2026",
  studentName: "Dronveer",
  course: "Full Stack Mern",
  paymentMode: "UPI",
  transactionId: "T2605021806148589331174",
  totalAmount: 3499,
  paidAmount: 1000,
  balance: 2499,
  status: "PARTIAL"
} }) => {
  const receiptRef = useRef();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getSettings();
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings in receipt preview', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleDownload = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Receipt-${data.receiptNo}.pdf`);
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-[#0EA5E9]" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 no-print">
        <Button variant="outline" className="gap-2 rounded-xl" onClick={() => window.print()}>
          <Printer size={18} /> Print
        </Button>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={handleDownload}>
          <Download size={18} /> Download PDF
        </Button>
      </div>

      {/* Outer Wrapper for Preview (Simulates Card Border on Screen) */}
      <div className="bg-[#F4F7FC] p-6 md:p-10 rounded-[32px] no-print">
        <div 
          ref={receiptRef}
          className="bg-white p-12 rounded-[24px] shadow-sm max-w-[850px] mx-auto text-sm font-inter text-gray-800"
          style={{ width: '100%', minHeight: '950px' }}
        >
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#0EA5E9]/10 p-2.5 rounded-xl text-[#0EA5E9]">
                <BookOpen size={24} />
              </div>
              <div>
                <h5 className="text-sm font-black text-textPrimary leading-none uppercase tracking-tight">{settings?.companyName || 'Kode to Career'}</h5>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{settings?.phone || ''}</p>
              </div>
            </div>
            <div className="text-right text-xs font-medium text-gray-500 space-y-0.5 max-w-[300px]">
              <p className="font-bold text-gray-900 text-[11px] leading-tight break-words">{settings?.address || 'info.kodetocareer.com'}</p>
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full mb-6"></div>

          {/* Metadata Section 1 (Receipt & Date) */}
          <div className="space-y-2 text-sm text-gray-700 mb-6">
            <p><span className="font-bold text-gray-900 mr-1">Receipt No:</span> {data.receiptNo}</p>
            <p><span className="font-bold text-gray-900 mr-1">Date:</span> {data.date}</p>
          </div>

          <div className="h-px bg-gray-200 w-full mb-6"></div>

          {/* Metadata Section 2 (Student Info) */}
          <div className="space-y-2 text-sm text-gray-700 mb-6">
            <p><span className="font-bold text-gray-900 mr-1">Name:</span> {data.studentName}</p>
            <p><span className="font-bold text-gray-900 mr-1">Course:</span> {data.course}</p>
          </div>

          <div className="h-px bg-gray-200 w-full mb-8"></div>

          {/* Financial Breakdown */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="font-medium text-gray-500">Total Amount</span>
              <span className="font-medium text-gray-900">₹ {Number(data.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="font-medium text-gray-500">Amount Paid</span>
              <span className="font-bold text-[#10B981]">₹ {Number(data.paidAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="h-px bg-gray-200 w-full"></div>
            
            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-gray-900">Balance Due</span>
              <span className="text-[#EF4444]">₹ {Number(data.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Transaction Status Box */}
          <table className="w-full bg-[#0B1530] text-white rounded-xl mb-6 shadow-sm border-collapse" style={{ height: '54px' }}>
            <tbody>
              <tr>
                <td className="px-6 font-bold tracking-wide text-sm text-left" style={{ verticalAlign: 'middle', height: '54px', lineHeight: '54px', padding: '0 24px' }}>
                  Transaction Status
                </td>
                <td className="px-6 font-black text-sm text-[#F59E0B] tracking-wider uppercase text-right" style={{ verticalAlign: 'middle', height: '54px', lineHeight: '54px', padding: '0 24px' }}>
                  {data.status === 'FULLY_PAID' || Number(data.balance) <= 0 ? 'FULLY PAID' : 'PARTIALLY PAID'}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="h-px bg-gray-200 w-full mb-6"></div>

          {/* Metadata Section 3 (Payment Details) */}
          <div className="space-y-2 text-sm text-gray-700 mb-6">
            <p><span className="font-bold text-gray-900 mr-1">Payment Mode:</span> {data.paymentMode}</p>
            <p><span className="font-bold text-gray-900 mr-1">Transaction ID:</span> {data.transactionId || '—'}</p>
          </div>

          <div className="text-center text-xs text-gray-400 italic py-2 mb-4">
            This is a system-generated receipt
          </div>

          <div className="h-px bg-gray-200 w-full mb-6"></div>

          {/* Terms & Conditions */}
          <div className="space-y-2 mb-8">
            <h5 className="font-bold text-xs text-[#0B1530] uppercase tracking-wider">Terms & Conditions</h5>
            <ol className="list-decimal list-inside text-xs text-gray-500 space-y-1.5 leading-relaxed">
              <li>Fees once paid are non-refundable.</li>
              <li>For any queries, please reach out using the contact information listed above.</li>
            </ol>
          </div>

          {/* Footer Announcement Box */}
          <div className="bg-[#F0F5FF] border border-[#D0E0FC] p-6 rounded-2xl flex items-center gap-6 mt-12">
            <div className="shrink-0 bg-white p-2.5 rounded-xl shadow-sm border border-[#E0E7FF] text-[#0EA5E9]">
              <BookOpen size={24} />
            </div>
            <div className="text-left text-xs text-[#1E293B] space-y-1">
              <p className="font-semibold text-gray-800">Thank you for choosing {settings?.companyName || 'Kode to Career'}.</p>
              <p className="font-medium text-gray-500">We appreciate your trust in us.</p>
              <p className="font-bold text-[#1E3A8A] text-sm mt-0.5">Keep Learning, Keep Growing!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
