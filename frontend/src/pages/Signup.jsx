import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup(formData);
      toast.success(res.message || 'Account created successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8F9FC] font-inter overflow-hidden">
      {/* LEFT SECTION: Branding + Logo */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] flex-col items-center justify-center p-12 overflow-hidden"
      >
        {/* Abstract shapes / waves */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-3xl"></div>
          <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <img 
              src="/logo.jpeg" 
              alt="KodeToCareer Logo" 
              className="w-full max-w-sm h-auto mx-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight"
          >
            Manage Student Enrollments & Payments in One Place
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white/80 text-lg font-medium"
          >
            Track fees, monitor enrollments, and streamline your institute operations with KodeToCareer CRM.
          </motion.p>
        </div>
      </motion.div>

      {/* RIGHT SECTION: Signup Panel */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-[#F8F9FC] relative">
        {/* Mobile-only branding */}
        <div className="md:hidden w-full mb-8 text-center">
          <div className="inline-block mb-4">
             <img src="/logo.jpeg" alt="Logo" className="w-40 h-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">Create Account</h2>
          <p className="text-textSecondary">Join KodeToCareer CRM</p>
        </div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm bg-white p-6 md:p-8 rounded-[2rem] shadow-premium"
        >
          <div className="hidden md:block mb-10 text-left">
            <h2 className="text-3xl font-bold text-textPrimary mb-2">Join Us Today</h2>
            <p className="text-textSecondary font-medium">Create your CRM account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-textPrimary block ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0EA5E9] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#0EA5E9]/20 rounded-xl text-textPrimary focus:bg-white focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] outline-none transition-all placeholder:text-gray-400"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-textPrimary block ml-1">
                Gmail Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0EA5E9] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#0EA5E9]/20 rounded-xl text-textPrimary focus:bg-white focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] outline-none transition-all placeholder:text-gray-400"
                  placeholder="Enter your gmail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-textPrimary block ml-1">
                Password
              </label>
              <div className="relative group">
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-4 flex items-center cursor-pointer text-gray-400 hover:text-[#0EA5E9] transition-colors z-10"
                >
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#0EA5E9]/20 rounded-xl text-textPrimary focus:bg-white focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] outline-none transition-all placeholder:text-gray-400"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Signup Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0EA5E9]/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="relative z-10">Sign Up</span>
                  <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={18} />
                </>
              )}
              {/* Shine effect on hover */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-textSecondary font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0EA5E9] hover:underline font-bold transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer Text / Copyright */}
        <div className="absolute bottom-8 text-xs text-gray-400">
          © 2026 KodeToCareer. All rights reserved.
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .animate-shine {
          animation: shine 0.7s;
        }
      `}} />
    </div>
  );
};

export default Signup;
