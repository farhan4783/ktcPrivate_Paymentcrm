import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Printer,
  Loader2,
  BookOpen,
  Globe,
  Youtube,
  Instagram,
  Linkedin
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import { settingsAPI } from '../../services/api';
import { defaultLogoBase64 } from './logoBase64';

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
  const [logoBase64, setLogoBase64] = useState(defaultLogoBase64);

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

  useEffect(() => {
    let active = true;
    const convertLogoToBase64 = (url) => {
      if (url === '/logo.jpeg') {
        setLogoBase64(defaultLogoBase64);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        if (!active) return;
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL('image/png');
          setLogoBase64(dataURL);
        } catch (err) {
          console.error('Failed to convert logo to base64, using direct url:', err);
          setLogoBase64(url);
        }
      };
      img.onerror = () => {
        if (!active) return;
        console.warn('Failed to load logo image, using fallback:', url);
        setLogoBase64(url);
      };
    };

    if (settings?.logoUrl) {
      convertLogoToBase64(settings.logoUrl);
    } else {
      setLogoBase64(defaultLogoBase64);
    }

    return () => {
      active = false;
    };
  }, [settings]);

  const handleDownload = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, { 
      scale: 3, 
      useCORS: true
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Parse and add interactive link annotations on top of the PDF canvas
    try {
      const linkElements = element.querySelectorAll('a');
      const elementRect = element.getBoundingClientRect();
      const scaleFactor = pdfWidth / elementRect.width;

      linkElements.forEach((linkEl) => {
        const rect = linkEl.getBoundingClientRect();
        const left = (rect.left - elementRect.left) * scaleFactor;
        const top = (rect.top - elementRect.top) * scaleFactor;
        const w = rect.width * scaleFactor;
        const h = rect.height * scaleFactor;
        
        pdf.link(left, top, w, h, { url: linkEl.href });
      });
    } catch (err) {
      console.error('Failed to add links to PDF', err);
    }

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
          <div className="flex justify-between items-center mb-6">
            {/* Left Side: Brand Logo only */}
            <div className="flex items-center justify-start h-12 md:h-14">
              <img 
                src={logoBase64 || settings?.logoUrl || '/logo.jpeg'} 
                alt="KodeToCareer Logo" 
                className="h-full w-auto object-contain"
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                }}
              />
            </div>

            {/* Right Side: Empty */}
            <div></div>
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
              <p className="font-semibold text-gray-800">Thank you for choosing KodeToCareer.</p>
              <p className="font-medium text-gray-500">We appreciate your trust in us.</p>
              <p className="font-bold text-[#1E3A8A] text-sm mt-0.5">Keep Learning, Keep Growing!</p>
            </div>
          </div>

          {/* Footer Contact Info (Single Line) */}
          <div className="h-px bg-gray-100 w-full mt-10 mb-6"></div>
          <div className="flex justify-center items-center gap-8 text-[12px] text-gray-500 font-bold tracking-tight flex-wrap">
            {settings?.phone && (
              <span className="flex items-center gap-2">
                <span className="text-gray-400">Phone:</span> {settings.phone}
              </span>
            )}
            {settings?.address && (
              <span className="flex items-center gap-2">
                <span className="text-gray-400">Address:</span> {settings.address}
              </span>
            )}
            <a 
              href="https://kodetocareer.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-[#0EA5E9] transition-colors"
            >
              <Globe size={14} className="text-[#0EA5E9]" />
              <span>kodetocareer.com</span>
            </a>
            <a 
              href="https://www.youtube.com/@kodetocareer" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-[#FF0000] transition-colors"
            >
              <Youtube size={14} className="text-[#FF0000]" />
              <span>@kodetocareer</span>
            </a>
            <a 
              href="https://instagram.com/kodetocareer" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-[#E1306C] transition-colors"
            >
              <Instagram size={14} className="text-[#E1306C]" />
              <span>@kodetocareer</span>
            </a>
            <a 
              href="https://linkedin.com/company/kodetocareer" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors"
            >
              <Linkedin size={14} className="text-[#0A66C2]" />
              <span>KodeToCareer</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
