import React, { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../services/api';
import { COURSES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Award, 
  Search, 
  User, 
  Calendar, 
  BookOpen, 
  Download, 
  Printer, 
  Loader2, 
  Info,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const CertificateGenerator = () => {
  const { user } = useAuth();
  const certificateRef = useRef();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [transparentLogo, setTransparentLogo] = useState('');
  
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '4-Month MERN Stack Development with AI Training Program',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    leftSignName: 'MOHD KAUNAIN',
    leftSignRole: 'CO- FOUNDER',
    rightSignName: 'MD ARBAAZ',
    rightSignRole: 'FOUNDER',
    description: 'During the program, the student demonstrated proficiency in full-stack web development, AI-assisted development, and successfully completed practical assignments and projects.'
  });

  // Client-side image processing to convert black background in k_logo.jpg to transparent PNG
  const makeLogoTransparent = (imgUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      // Omit crossOrigin to prevent CORS issues on same-origin/localhost setups
      img.src = imgUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            
            // Check if pixel is near black (background of k_logo.jpg is solid black)
            if (r < 40 && g < 40 && b < 40) {
              data[i+3] = 0; // Set alpha channel to 0 (fully transparent)
            }
          }
          
          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (e) {
          console.error('Error processing transparent logo:', e);
          resolve(imgUrl); // Fallback to original
        }
      };
      img.onerror = () => {
        resolve(imgUrl); // Fallback to original if load fails
      };
    });
  };

  useEffect(() => {
    const fetchStudents = async () => {
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
    
    fetchStudents();
    
    setLogoLoading(true);
    makeLogoTransparent('/k_logo.jpg')
      .then(url => {
        setTransparentLogo(url);
      })
      .finally(() => {
        setLogoLoading(false);
      });
  }, []);

  const handleSelectStudent = (student) => {
    let studentCourse = '4-Month MERN Stack Development with AI Training Program';
    if (student.enrollments && student.enrollments.length > 0) {
      const rawCourse = student.enrollments[0].courseName;
      if (rawCourse.toLowerCase().includes('mern') || rawCourse.toLowerCase().includes('full stack')) {
        studentCourse = '4-Month MERN Stack Development with AI Training Program';
      } else {
        studentCourse = `${rawCourse} Training Program`;
      }
    }

    setFormData(prev => ({
      ...prev,
      studentName: student.name,
      courseName: studentCourse
    }));
    setSearchTerm(student.name);
    setShowDropdown(false);
    toast.success(`Selected student: ${student.name}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    if (!formData.studentName) {
      toast.error('Please select or type a student name first');
      return;
    }
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = certificateRef.current;
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: false, // Turn off useCORS to prevent dev server CORS headers failures
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate-${formData.studentName.replace(/\s+/g, '_')}.pdf`);
      toast.success('Certificate PDF generated!');
    } catch (err) {
      console.error(err);
      toast.error(`Failed to generate PDF: ${err.message || err.toString()}`);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!formData.studentName) {
      toast.error('Please select or type a student name first');
      return;
    }
    window.print();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role === 'viewer') {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20 bg-white p-10 rounded-[32px] border border-gray-100 shadow-soft">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto">
          <Info size={32} />
        </div>
        <h3 className="text-xl font-black text-textPrimary tracking-tight">Read-Only Access</h3>
        <p className="text-sm text-textSecondary leading-relaxed">
          You are logged in with a read-only viewer account. You can view student data, but you do not have permission to generate certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Printing Style overrides to ensure ONLY the certificate prints */}
      <style>{`
        @media print {
          /* Hide everything on the page */
          body * {
            visibility: hidden !important;
          }
          /* Show and format only the certificate target */
          .print-target, .print-target * {
            visibility: visible !important;
          }
          .print-target {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            z-index: 9999 !important;
          }
          /* Setup landscape print page dimensions */
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight flex items-center gap-2">
            <Award className="text-[#0EA5E9]" size={28} />
            Certificate Generator
          </h2>
          <p className="text-textSecondary text-xs mt-1">
            Generate and export course completion certificates using a clean custom white-theme template.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={handlePrint} disabled={generating || logoLoading || !formData.studentName}>
            <Printer size={18} /> Print
          </Button>
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={handleDownload} disabled={generating || logoLoading || !formData.studentName}>
            {generating ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Generating...
              </>
            ) : logoLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Loading Logo...
              </>
            ) : (
              <>
                <Download size={18} /> Download Certificate PDF
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Form Panel (Left) */}
        <div className="xl:col-span-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-soft space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <User className="text-[#0EA5E9]" size={16} />
              <h3 className="font-black text-sm text-textPrimary uppercase tracking-tight">Certificate Details</h3>
            </div>

            {/* Student Search & Select */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Search Student</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFormData(prev => ({ ...prev, studentName: e.target.value }));
                    setShowDropdown(true);
                  }}
                  placeholder="Type or select student..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFormData(prev => ({ ...prev, studentName: '' }));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Student Dropdown list */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-50">
                  {loading ? (
                    <div className="p-4 text-center text-xs text-textSecondary flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin text-primary" size={14} /> Loading students...
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-4 text-center text-xs text-textSecondary">
                      No students found. Type name directly.
                    </div>
                  ) : (
                    filteredStudents.map(student => (
                      <div
                        key={student._id}
                        onClick={() => handleSelectStudent(student)}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                      >
                        <p className="text-sm font-bold text-textPrimary">{student.name}</p>
                        <div className="flex justify-between text-[11px] text-textSecondary mt-0.5">
                          <span>{student.email}</span>
                          <span className="font-semibold text-primary">{student.course || 'No Course'}</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div 
                    onClick={() => setShowDropdown(false)}
                    className="p-2 text-center text-[10px] font-black text-gray-400 hover:bg-gray-50 cursor-pointer uppercase tracking-wider"
                  >
                    Close Dropdown
                  </div>
                </div>
              )}
            </div>

            {/* Manual Name Edit (if needed) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student Name (On Certificate)</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Course Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Name</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="e.g. 4-Month MERN Stack Development..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Completion Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. 27 June, 2026"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description Paragraph</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description of program proficiency..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Signatures Setup */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 pb-2">
              <FileText className="text-[#0EA5E9]" size={16} />
              <h3 className="font-black text-sm text-textPrimary uppercase tracking-tight">Signatory Settings</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Left Name</label>
                  <input
                    name="leftSignName"
                    value={formData.leftSignName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Left Title</label>
                  <input
                    name="leftSignRole"
                    value={formData.leftSignRole}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Right Name</label>
                  <input
                    name="rightSignName"
                    value={formData.rightSignName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Right Title</label>
                  <input
                    name="rightSignRole"
                    value={formData.rightSignRole}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel (Right) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between text-xs text-textSecondary font-bold">
            <span>Certificate Preview (1000px × 707px landscape, scaled)</span>
            <span>Premium custom white-theme layout</span>
          </div>

          {/* Wrapper to allow horizontal scroll on small screens */}
          <div className="overflow-x-auto bg-[#F4F7FC] p-6 rounded-[32px] border border-gray-100 shadow-inner flex justify-center">
            {/* White-themed certificate container with print-target class */}
            <div 
              ref={certificateRef}
              className="print-target w-[1000px] h-[707px] min-w-[1000px] relative bg-white overflow-hidden shadow-2xl p-1.5 select-none"
            >
              {/* Premium Blue Border Background Frame (Solid sky blue outer border, extremely safe for html2canvas) */}
              <div className="absolute inset-0 bg-[#0EA5E9] rounded-none z-0"></div>
              
              {/* Inner card content (pure white background) */}
              <div className="w-[988px] h-[695px] absolute inset-[6px] bg-white z-10 p-12 flex flex-col justify-between items-center text-center overflow-hidden">
                
                {/* Center Watermark: The transparent logo rendered as standard img element (much safer for html2canvas) */}
                {transparentLogo && (
                  <img 
                    src={transparentLogo} 
                    alt="Watermark" 
                    className="absolute inset-0 m-auto w-[460px] h-[460px] pointer-events-none z-0 opacity-[0.05] object-contain" 
                  />
                )}

                {/* Corner Geometric Accents (Clean Tech Border corners) */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#0EA5E9]/30"></div>
                <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#0EA5E9]/30"></div>
                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#0EA5E9]/30"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#0EA5E9]/30"></div>

                {/* Dot matrix accents in opposite corners */}
                <div className="absolute top-6 left-6 w-16 h-8 opacity-[0.12] pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(#0EA5E9 1.5px, transparent 1.5px)',
                  backgroundSize: '6px 6px'
                }}></div>
                <div className="absolute bottom-6 right-6 w-16 h-8 opacity-[0.12] pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(#0EA5E9 1.5px, transparent 1.5px)',
                  backgroundSize: '6px 6px'
                }}></div>

                {/* Content Area */}
                <div className="w-full h-full flex flex-col justify-between items-center z-10 relative">
                  
                  {/* Top Block: Logo and Headers */}
                  <div className="flex flex-col items-center mt-2">
                    {/* Header Logo: We use logo.jpeg because it has a clean white background */}
                    <img src="/logo.jpeg" alt="KodeToCareer Logo" className="h-10 object-contain mb-5" />

                    <h1 
                      className="text-[#0EA5E9] leading-none"
                      style={{
                        fontFamily: "'Alex Brush', cursive",
                        fontSize: '84px'
                      }}
                    >
                      Certificate
                    </h1>
                    <p className="text-[12px] font-black text-gray-800 tracking-[0.25em] mt-1.5 uppercase">
                      OF ACHIEVEMENT
                    </p>
                  </div>

                  {/* Presenter Line */}
                  <div className="text-[9.5px] font-black text-gray-400 tracking-[0.2em] mt-2 uppercase">
                    THIS CERTIFICATE IS PROUDLY PRESENTED TO
                  </div>

                  {/* Recipient Block */}
                  <div className="w-full flex flex-col items-center">
                    <h2 
                      className="text-[#0B5ED7] font-black tracking-wide uppercase select-text"
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '44px',
                        lineHeight: '1.1',
                      }}
                    >
                      {formData.studentName || 'STUDENT NAME'}
                    </h2>
                    
                    {/* Clean Gradient Accent Line under name */}
                    <div className="flex flex-col items-center gap-[2.5px] w-[50%] mt-4 mb-2">
                      <div className="w-full h-[1.5px] bg-[#0EA5E9]/30"></div>
                      <div className="w-[75%] h-[0.5px] bg-[#0EA5E9]/15"></div>
                    </div>
                  </div>

                  {/* Description / Body Text Block */}
                  <div className="flex flex-col items-center max-w-[760px] px-6">
                    <p className="text-gray-700 leading-[1.7] text-sm font-medium">
                      for successfully completing the course of study in <span className="font-extrabold text-gray-900 text-base tracking-wide border-b border-[#0EA5E9]/30 pb-0.5">{formData.courseName}</span> at Kode To Career.
                    </p>
                    <p className="text-textSecondary leading-[1.7] text-[11.5px] font-normal mt-3 max-w-[700px]">
                      {formData.description}
                    </p>
                  </div>

                  {/* Signatures & Issue Date Footer */}
                  <div className="w-full flex justify-between items-end px-8 mt-4">
                    {/* Left: Mohd Kaunain */}
                    <div className="w-[200px] flex flex-col items-center">
                      {/* Cursive Signature */}
                      <div className="font-['Alex_Brush'] text-3xl text-[#0B5ED7]/80 transform -rotate-2 select-none h-8 leading-none">
                        {formData.leftSignName ? 'Kaunain' : ''}
                      </div>
                      <div className="w-full h-[0.5px] bg-gray-200 my-2"></div>
                      <div className="font-bold text-textPrimary tracking-tight" style={{ fontSize: '10.5px' }}>
                        {formData.leftSignName}
                      </div>
                      <div className="text-[#0EA5E9] tracking-wider uppercase font-black" style={{ fontSize: '8px', marginTop: '2px' }}>
                        {formData.leftSignRole}
                      </div>
                    </div>

                    {/* Middle: Issue Date */}
                    <div className="w-[180px] flex flex-col items-center pb-0.5">
                      <div className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest">Date of Issue</div>
                      <div className="font-extrabold text-textPrimary mt-2 select-text" style={{ fontSize: '11px' }}>
                        {formData.date}
                      </div>
                    </div>

                    {/* Right: Md Arbaaz */}
                    <div className="w-[200px] flex flex-col items-center">
                      {/* Cursive Signature */}
                      <div className="font-['Caveat'] text-3xl font-bold text-[#0B5ED7]/80 transform -rotate-1 select-none h-8 leading-none">
                        {formData.rightSignName ? 'Arbaaz' : ''}
                      </div>
                      <div className="w-full h-[0.5px] bg-gray-200 my-2"></div>
                      <div className="font-bold text-textPrimary tracking-tight" style={{ fontSize: '10.5px' }}>
                        {formData.rightSignName}
                      </div>
                      <div className="text-[#0EA5E9] tracking-wider uppercase font-black" style={{ fontSize: '8px', marginTop: '2px' }}>
                        {formData.rightSignRole}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
