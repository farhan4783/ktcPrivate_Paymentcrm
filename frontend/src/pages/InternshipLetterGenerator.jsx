import React, { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../services/api';
import { COURSES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Briefcase, 
  Search, 
  User, 
  Calendar, 
  Download, 
  Printer, 
  Loader2, 
  Info,
  Phone,
  Mail,
  Globe,
  FileText,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

// Course-specific presets for personalized internship letters
export const COURSE_INTERNSHIP_PRESETS = {
  'Full Stack Development': {
    courseKey: 'Full Stack Development',
    role: 'Full Stack Intern',
    domainText: 'hands-on experience and professional development in full-stack web development (React.js, Node.js, Express.js, and MongoDB).',
    supervisor: 'KodeToCareer Full Stack Development Team',
    duties: [
      'Developing and maintaining web applications using the MERN stack (MongoDB, Express, React, Node.js)',
      'Building responsive user interfaces with React.js and modern CSS styling',
      'Working with Node.js and Express.js for backend RESTful API development',
      'Managing and integrating MongoDB database schemas and queries',
      'Collaborating with the development team on real-world web projects',
      'Debugging, testing, and optimizing application performance',
      'Participating in team discussions, code reviews, and project planning'
    ]
  },
  'Web Development': {
    courseKey: 'Web Development',
    role: 'Web Development Intern',
    domainText: 'hands-on experience and professional development in modern web development, front-end architecture, and responsive web design.',
    supervisor: 'KodeToCareer Web Development Team',
    duties: [
      'Designing and developing responsive, accessible web pages using HTML5, CSS3, and JavaScript',
      'Building dynamic front-end web components using modern frameworks like React',
      'Integrating RESTful APIs and handling asynchronous data flows',
      'Optimizing web page performance, page load speeds, and cross-browser compatibility',
      'Collaborating with designers to translate UI/UX wireframes into functional web pages',
      'Testing web applications across mobile, tablet, and desktop viewports',
      'Participating in daily stand-ups, code reviews, and project sprint planning'
    ]
  },
  'Data Science': {
    courseKey: 'Data Science',
    role: 'Data Science Intern',
    domainText: 'hands-on experience and professional development in data science, predictive modeling, machine learning, and data analytics.',
    supervisor: 'KodeToCareer Data Science Team',
    duties: [
      'Performing exploratory data analysis (EDA) and data preprocessing on structured and unstructured datasets',
      'Building, training, and evaluating machine learning models using Python, Scikit-Learn, and Pandas',
      'Developing data pipelines for feature extraction, model inference, and predictive analytics',
      'Creating interactive data visualizations and analytical reports using Matplotlib and Seaborn',
      'Cleaning and validating raw datasets to ensure data quality and integrity',
      'Documenting machine learning workflows, algorithms, and experimental results',
      'Collaborating with data engineers and senior data scientists on production ML tasks'
    ]
  },
  'Data Analytics': {
    courseKey: 'Data Analytics',
    role: 'Data Analyst Intern',
    domainText: 'hands-on experience and professional development in data analysis, SQL querying, data visualization, and business intelligence.',
    supervisor: 'KodeToCareer Analytics Team',
    duties: [
      'Extracting, transforming, and analyzing data from relational databases using complex SQL queries',
      'Building interactive dashboards and visual reports using Power BI, Tableau, or Metabase',
      'Analyzing business KPIs, customer trends, and operational metrics to derive actionable insights',
      'Performing statistical analysis, cohort analysis, and data validation tasks',
      'Automating repetitive data extraction and reporting workflows',
      'Presenting key data insights and analytical findings to team leads and stakeholders',
      'Assisting in maintaining data governance, accuracy, and reporting standards'
    ]
  },
  'MLOps': {
    courseKey: 'MLOps',
    role: 'MLOps Engineer Intern',
    domainText: 'hands-on experience and professional development in machine learning operations (MLOps), model deployment, and ML pipeline automation.',
    supervisor: 'KodeToCareer MLOps & Infrastructure Team',
    duties: [
      'Designing and maintaining automated CI/CD pipelines for machine learning model deployment',
      'Tracking machine learning experiments, artifacts, and model versions using MLflow or DVC',
      'Containerizing ML applications using Docker and orchestrating services with Kubernetes',
      'Implementing model monitoring systems to track data drift, latency, and model accuracy',
      'Automating model retraining loops and deployment validation scripts',
      'Managing cloud infrastructure (AWS/GCP/Azure) optimized for machine learning workloads',
      'Collaborating with data science and DevOps teams to streamline production model deployment'
    ]
  },
  'DevOps': {
    courseKey: 'DevOps',
    role: 'DevOps Engineer Intern',
    domainText: 'hands-on experience and professional development in DevOps practices, cloud infrastructure management, containerization, and CI/CD pipelines.',
    supervisor: 'KodeToCareer DevOps Team',
    duties: [
      'Designing and automating continuous integration and continuous deployment (CI/CD) pipelines',
      'Containerizing software applications using Docker and managing clusters with Kubernetes',
      'Provisioning and managing cloud infrastructure using Infrastructure as Code (Terraform/Ansible)',
      'Setting up system monitoring, log aggregation, and alert configurations (Prometheus, Grafana)',
      'Implementing security compliance, environment configurations, and access control management',
      'Troubleshooting build failures, server logs, deployment issues, and network configurations',
      'Collaborating with software engineering teams to optimize cloud resource efficiency'
    ]
  },
  'UI/UX Design': {
    courseKey: 'UI/UX Design',
    role: 'UI/UX Designer Intern',
    domainText: 'hands-on experience and professional development in user interface (UI) design, user experience (UX) research, wireframing, and interactive prototyping.',
    supervisor: 'KodeToCareer Design Studio Team',
    duties: [
      'Conducting user research, target user interviews, and competitive design analysis',
      'Creating low-fidelity wireframes, user flow diagrams, and high-fidelity interactive prototypes in Figma',
      'Designing modern, responsive user interfaces following design systems and visual standards',
      'Conducting usability testing sessions and gathering feedback for iterative design improvements',
      'Collaborating closely with web and mobile developers to ensure design fidelity during implementation',
      'Developing visual assets, icons, typography scales, and UI component libraries',
      'Documenting UX guidelines, design tokens, and user journey specifications'
    ]
  },
  'Digital Marketing': {
    courseKey: 'Digital Marketing',
    role: 'Digital Marketing Intern',
    domainText: 'hands-on experience and professional development in digital marketing strategies, SEO, content creation, social media, and campaign analytics.',
    supervisor: 'KodeToCareer Growth & Marketing Team',
    duties: [
      'Planning and executing digital marketing campaigns across Google Ads, Meta, and social media platforms',
      'Conducting keyword research, on-page SEO optimization, and search engine ranking analysis',
      'Creating engaging marketing copy, social media content, email newsletters, and ad creatives',
      'Tracking and analyzing campaign performance metrics using Google Analytics and Meta Business Suite',
      'Managing community engagement and social media channel interactions',
      'Assisting in conversion rate optimization (CRO) and landing page A/B testing',
      'Generating weekly marketing performance reports and strategy recommendations'
    ]
  },
  'Python Programming': {
    courseKey: 'Python Programming',
    role: 'Python Developer Intern',
    domainText: 'hands-on experience and professional development in Python programming, web backend frameworks, automation scripts, and database integration.',
    supervisor: 'KodeToCareer Software Engineering Team',
    duties: [
      'Developing modular Python applications, CLI utilities, and automated task scripts',
      'Building and maintaining backend RESTful APIs using Python frameworks like FastAPI or Django',
      'Writing web scraping scripts, data processing utilities, and third-party API integrations',
      'Writing unit tests and integration tests using PyTest to ensure code quality and stability',
      'Designing relational database schemas and executing SQL queries with SQLAlchemy/ORM',
      'Debugging issues, profiling code performance, and refactoring existing Python codebases',
      'Participating in code reviews, technical architecture discussions, and team stand-ups'
    ]
  },
  'Android App Development': {
    courseKey: 'Android App Development',
    role: 'Android App Developer Intern',
    domainText: 'hands-on experience and professional development in Android mobile application development, UI design, API integration, and mobile architecture.',
    supervisor: 'KodeToCareer Mobile Development Team',
    duties: [
      'Developing and testing native or cross-platform Android mobile applications using Kotlin or React Native',
      'Designing intuitive, responsive mobile layouts adhering to Android Material Design guidelines',
      'Integrating RESTful web services, JSON APIs, and offline local databases (Room/SQLite)',
      'Implementing app state management, push notifications, and background service logic',
      'Debugging mobile runtime issues, memory leaks, and performance bottlenecks across devices',
      'Preparing app build releases, APK/AAB packaging, and testing on diverse Android OS versions',
      'Collaborating with UI designers and backend developers for seamless mobile feature delivery'
    ]
  }
};

// Helper function to resolve course string to best matching preset
export const getPresetForCourse = (courseInput) => {
  if (!courseInput || typeof courseInput !== 'string') {
    return COURSE_INTERNSHIP_PRESETS['Full Stack Development'];
  }
  const clean = courseInput.trim().toLowerCase();

  if (clean.includes('data science')) return COURSE_INTERNSHIP_PRESETS['Data Science'];
  if (clean.includes('data analytics') || clean.includes('analytics')) return COURSE_INTERNSHIP_PRESETS['Data Analytics'];
  if (clean.includes('mlops')) return COURSE_INTERNSHIP_PRESETS['MLOps'];
  if (clean.includes('devops')) return COURSE_INTERNSHIP_PRESETS['DevOps'];
  if (clean.includes('ui') || clean.includes('ux') || clean.includes('design')) return COURSE_INTERNSHIP_PRESETS['UI/UX Design'];
  if (clean.includes('digital marketing') || clean.includes('marketing')) return COURSE_INTERNSHIP_PRESETS['Digital Marketing'];
  if (clean.includes('python')) return COURSE_INTERNSHIP_PRESETS['Python Programming'];
  if (clean.includes('android') || clean.includes('mobile')) return COURSE_INTERNSHIP_PRESETS['Android App Development'];
  if (clean.includes('web dev') || clean.includes('web development')) return COURSE_INTERNSHIP_PRESETS['Web Development'];
  if (clean.includes('mern') || clean.includes('full stack')) return COURSE_INTERNSHIP_PRESETS['Full Stack Development'];

  // Check exact key match
  if (COURSE_INTERNSHIP_PRESETS[courseInput]) {
    return COURSE_INTERNSHIP_PRESETS[courseInput];
  }

  // Fallback to Full Stack Development preset
  return COURSE_INTERNSHIP_PRESETS['Full Stack Development'];
};

const InternshipLetterGenerator = () => {
  const { user } = useAuth();
  const letterRef = useRef();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const initialPreset = COURSE_INTERNSHIP_PRESETS['Full Stack Development'];

  const [formData, setFormData] = useState({
    studentName: '',
    selectedCourse: 'Full Stack Development',
    role: initialPreset.role,
    domainText: initialPreset.domainText,
    offerDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    endDate: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    supervisor: initialPreset.supervisor,
    senderName: 'Mohd Arbaaz',
    senderRole: 'CEO, Founder',
    dutiesText: initialPreset.duties.join('\n')
  });

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
  }, []);

  const applyCoursePreset = (courseName, studentName = null) => {
    const preset = getPresetForCourse(courseName);
    setFormData(prev => ({
      ...prev,
      ...(studentName !== null ? { studentName } : {}),
      selectedCourse: preset.courseKey,
      role: preset.role,
      domainText: preset.domainText,
      supervisor: preset.supervisor,
      dutiesText: preset.duties.join('\n')
    }));
  };

  const handleSelectStudent = (student) => {
    const studentCourse = student.course || 'Full Stack Development';
    applyCoursePreset(studentCourse, student.name);
    setSearchTerm(student.name);
    setShowDropdown(false);
    toast.success(`Selected ${student.name} (${studentCourse})`);
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    applyCoursePreset(selectedCourse);
    toast.success(`Loaded ${selectedCourse} preset`);
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
      
      const element = letterRef.current;
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Internship_Offer_Letter-${formData.studentName.replace(/\s+/g, '_')}.pdf`);
      toast.success('Internship offer letter PDF generated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
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

  const getFirstName = () => {
    if (!formData.studentName) return 'Intern';
    return formData.studentName.trim().split(' ')[0];
  };

  const getDutiesList = () => {
    return formData.dutiesText
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean);
  };

  if (user?.role === 'viewer') {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20 bg-white p-10 rounded-[32px] border border-gray-100 shadow-soft">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto">
          <Info size={32} />
        </div>
        <h3 className="text-xl font-black text-textPrimary tracking-tight">Read-Only Access</h3>
        <p className="text-sm text-textSecondary leading-relaxed">
          You are logged in with a read-only viewer account. You can view student data, but you do not have permission to generate internship letters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Printing Style overrides to ensure ONLY the offer letter prints */}
      <style>{`
        @media print {
          /* Hide everything on the page */
          body * {
            visibility: hidden !important;
          }
          /* Show and format only the letter target */
          .print-target, .print-target * {
            visibility: visible !important;
          }
          .print-target {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 16mm !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            z-index: 9999 !important;
          }
          /* Setup portrait print page dimensions */
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-textPrimary tracking-tight flex items-center gap-2">
            <Briefcase className="text-[#0EA5E9]" size={28} />
            Internship Letter Generator
          </h2>
          <p className="text-textSecondary text-xs mt-1">
            Generate course-personalized internship offer letters for every track (MERN, Data Science, Data Analytics, MLOps, DevOps, UI/UX, etc.) with identical design layout.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={handlePrint} disabled={generating || !formData.studentName}>
            <Printer size={18} /> Print
          </Button>
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={handleDownload} disabled={generating || !formData.studentName}>
            {generating ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Generating...
              </>
            ) : (
              <>
                <Download size={18} /> Download Offer Letter PDF
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
              <Briefcase className="text-[#0EA5E9]" size={16} />
              <h3 className="font-black text-sm text-textPrimary uppercase tracking-tight">Internship Details</h3>
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

            {/* Course / Domain Selection Preset */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course / Track Preset</label>
                <span className="text-[10px] font-extrabold text-[#0EA5E9] flex items-center gap-1">
                  <Sparkles size={10} /> Auto-loads course text
                </span>
              </div>
              <div className="relative">
                <select
                  name="selectedCourse"
                  value={formData.selectedCourse}
                  onChange={handleCourseChange}
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manual Name Edit */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student Name (On Letter)</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Internship Role */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Internship Role Title</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Data Science Intern / Full Stack Intern"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Offer Date</label>
                <input
                  name="offerDate"
                  value={formData.offerDate}
                  onChange={handleChange}
                  placeholder="May 01, 2026"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                <input
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder="May 03, 2026"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                <input
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder="July 03, 2026"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Supervisor */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Supervisor / Team</label>
              <input
                name="supervisor"
                value={formData.supervisor}
                onChange={handleChange}
                placeholder="KodeToCareer Data Science Team"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Custom Duties (Textarea, line by line) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Responsibilities (One per line)</label>
              <textarea
                name="dutiesText"
                value={formData.dutiesText}
                onChange={handleChange}
                rows={6}
                placeholder="Enter course duties (one line per bullet)..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Signatory Setup */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 pb-2">
              <FileText className="text-[#0EA5E9]" size={16} />
              <h3 className="font-black text-sm text-textPrimary uppercase tracking-tight">Signatory Settings</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Sender Name</label>
                <input
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Sender Title</label>
                <input
                  name="senderRole"
                  value={formData.senderRole}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel (Right) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between text-xs text-textSecondary font-bold">
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#0EA5E9]" />
              Offer Letter Preview — Personalized for <span className="text-[#0EA5E9] font-black">{formData.selectedCourse}</span>
            </span>
            <span>PDF exports at high-quality A4 dimensions</span>
          </div>

          {/* Wrapper to allow horizontal scroll on small screens */}
          <div className="overflow-x-auto bg-[#F4F7FC] p-6 rounded-[32px] border border-gray-100 shadow-inner flex justify-center">
            {/* The actual letter container with A4 dimensions and print-target class */}
            <div 
              ref={letterRef}
              className="print-target w-[794px] h-[1123px] min-w-[794px] bg-white relative shadow-2xl p-16 font-inter overflow-hidden text-sm text-[#334155] leading-relaxed flex flex-col justify-between select-none"
            >
              {/* TOP DECORATION: SVG Blue Curves */}
              <div className="absolute top-0 left-0 w-full h-[180px] pointer-events-none z-0">
                <svg className="absolute top-0 left-0 w-[320px] h-[180px] text-[#0ea5e9]" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0 H260 C240 60, 160 120, 0 150 Z" fill="currentColor"/>
                </svg>
                <svg className="absolute top-0 left-0 w-[340px] h-[185px] text-[#0284c7] opacity-40" viewBox="0 0 340 185" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0 H275 C255 62, 170 123, 0 154 Z" fill="currentColor"/>
                </svg>
              </div>

              {/* DOT MATRIX: Top Right Decoration */}
              <div className="absolute top-8 right-8 w-28 h-16 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#0EA5E9 1.5px, transparent 1.5px)',
                backgroundSize: '8px 8px'
              }}></div>

              {/* Content Container to overlay above absolute decorations */}
              <div className="z-10 relative flex-1 flex flex-col justify-between">
                
                {/* Header: Logo and Title */}
                <div className="text-center pt-2">
                  <img 
                    src="/logo.jpeg" 
                    alt="KodeToCareer Logo" 
                    className="h-14 object-contain mx-auto" 
                  />
                  <div className="mt-8">
                    <h1 className="text-center font-black tracking-[0.2em] text-[#0F172A] text-lg">
                      INTERNSHIP
                    </h1>
                    <h1 className="text-center font-black tracking-[0.2em] text-[#0EA5E9] text-lg border-b-2 border-[#0EA5E9] inline-block pb-0.5 mt-0.5">
                      OFFER LETTER
                    </h1>
                  </div>
                </div>

                {/* Body Content */}
                <div className="mt-8 flex-1 space-y-5 text-[12.5px] select-text">
                  {/* Date (Right aligned) */}
                  <div className="text-right font-semibold text-gray-700">
                    {formData.offerDate}
                  </div>

                  {/* Reference */}
                  <div className="font-bold text-gray-800">
                    Re: Internship Offer – {formData.studentName || 'Student Name'}
                  </div>

                  {/* Salutation */}
                  <div className="font-bold text-gray-800">
                    Dear {getFirstName()},
                  </div>

                  {/* Body Paragraphs - Course Personalized */}
                  <p>
                    I am pleased to confirm your acceptance of an internship as a <span className="font-bold text-gray-900">{formData.role}</span> at KodeToCareer. This internship is designed to provide you with {formData.domainText || 'hands-on experience and professional development in your chosen field'}. As part of your role, your duties and responsibilities will include but are not limited to:
                  </p>

                  {/* Course Duties List */}
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                    {getDutiesList().map((duty, idx) => (
                      <li key={idx}>{duty}</li>
                    ))}
                  </ul>

                  <p>
                    Your first day of work will be <span className="font-bold text-gray-950">{formData.startDate}</span>, and the internship is expected to conclude on <span className="font-bold text-gray-950">{formData.endDate}</span>. During this period, you will gain practical exposure to industry-level development workflows and modern technologies.
                  </p>

                  <p>
                    Your primary supervisor will be the <span className="font-bold text-gray-900">{formData.supervisor}</span>, who will guide and support you throughout the internship duration.
                  </p>

                  <p>
                    We are excited to welcome you to the KodeToCareer team and look forward to supporting your growth and learning through this internship experience.
                  </p>
                </div>

                {/* Footer and Signatures */}
                <div className="mt-8 flex justify-between items-end border-t border-gray-100 pt-6">
                  {/* Left: Contact Info */}
                  <div className="space-y-1.5 text-[10.5px] text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-[#0EA5E9]" />
                      <span>9971255899</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-[#0EA5E9]" />
                      <span>info@kodetocareer.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="text-[#0EA5E9]" />
                      <span>www.kodetocareer.com</span>
                    </div>
                  </div>

                  {/* Right: Signature */}
                  <div className="text-right pr-4">
                    <p className="text-gray-500 font-semibold text-xs mb-1">Sincerely,</p>
                    {/* Dynamic Signature Cursive Font */}
                    <div className="font-['Caveat'] text-3xl font-black text-blue-900/80 transform -rotate-1 select-none h-8 leading-none flex justify-end">
                      {formData.senderName.split(' ').pop()}
                    </div>
                    <div className="w-36 h-px bg-gray-200 ml-auto my-1.5"></div>
                    <p className="font-bold text-gray-800 text-[11px] uppercase tracking-tight">{formData.senderName}</p>
                    <p className="text-gray-400 text-[9px] uppercase tracking-wider font-bold mt-0.5">{formData.senderRole}</p>
                  </div>
                </div>

              </div>

              {/* BOTTOM DECORATION: SVG Blue Curves */}
              <div className="absolute bottom-0 left-0 w-full h-[100px] pointer-events-none z-0">
                <svg className="absolute bottom-0 left-0 w-[450px] h-[75px] text-[#0ea5e9]" viewBox="0 0 450 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 75 H450 L350 25 C250 5, 120 40, 0 20 Z" fill="currentColor"/>
                </svg>
                <svg className="absolute bottom-0 left-0 w-[470px] h-[80px] text-[#0284c7] opacity-40" viewBox="0 0 470 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 80 H470 L370 27 C260 7, 130 42, 0 22 Z" fill="currentColor"/>
                </svg>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipLetterGenerator;
