import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CreditCard, 
  Settings as SettingsIcon, 
  Upload, 
  GraduationCap, 
  Save, 
  Phone,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({
    companyName: 'Kode to Career Education Pvt. Ltd.',
    address: '123, Knowledge Park, Bhopal, Madhya Pradesh - 462023',
    phone: '+91 70000 12345',
    upiId: 'kodetocareer@upi',
    prefix: 'KTC-'
  });

  const tabs = [
    { id: 'company', label: 'Company Settings', icon: Building2 },
    { id: 'receipt', label: 'Receipt Settings', icon: FileText },
    { id: 'payment', label: 'Payment Settings', icon: CreditCard },
    { id: 'system', label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-textPrimary tracking-tight">Settings</h2>
        <p className="text-textSecondary text-sm mt-1">Manage your institute and system preferences</p>
      </header>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-soft flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-8 py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "text-primary border-b-2 border-primary rounded-b-none" 
                : "text-textSecondary hover:bg-gray-50"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Company Form */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[32px] border border-gray-50 shadow-soft">
          <div className="mb-10">
            <h4 className="text-xl font-black text-textPrimary">Company Information</h4>
            <p className="text-sm text-textSecondary mt-1">Update your institute details. These details will appear on receipts.</p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <Input 
                  label="Company Name *" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />

                <div className="space-y-2">
                  <label className="text-sm font-bold text-textPrimary">Address *</label>
                  <textarea 
                    className="w-full h-32 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-textPrimary mb-3 block">Logo</label>
                <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/20 transition-all cursor-pointer group bg-gray-50/30 h-full max-h-[250px]">
                  <div className="bg-primary/10 p-5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                    <GraduationCap size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Click to upload</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">PNG, JPG or SVG</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Max size 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-textPrimary">Phone *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={16} /></span>
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-textPrimary">UPI ID *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">UPI</span>
                  <input 
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-bold tracking-tight">This UPI ID will be used to generate QR codes for payments.</p>
              </div>
            </div>

            <div className="w-1/2 space-y-2">
              <Input 
                label="Default Prefix *" 
                value={formData.prefix}
                onChange={(e) => setFormData({...formData, prefix: e.target.value})}
              />
              <p className="text-[10px] text-gray-400 font-bold tracking-tight">This prefix will be used for all receipt numbers.</p>
            </div>

            <div className="pt-10">
              <Button size="lg" className="px-12 py-7 rounded-2xl text-base font-black shadow-xl shadow-primary/20 gap-3">
                <Save size={20} /> Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Receipt Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-soft">
            <div className="mb-8">
              <h4 className="text-lg font-black text-textPrimary">Receipt Preview</h4>
              <p className="text-xs text-textSecondary mt-1 font-medium">This is how your receipt will look</p>
            </div>

            <div className="border border-gray-100 rounded-[32px] p-6 bg-gray-50/10 scale-[0.95] origin-top shadow-inner">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-1.5 rounded-lg">
                    <ShieldCheck className="text-white" size={16} />
                  </div>
                  <h5 className="text-[9px] font-black text-[#1E1B4B] w-28 leading-none uppercase">{formData.companyName}</h5>
                </div>
                <div className="text-[7px] text-right text-gray-400 font-bold leading-tight">
                  <p>123, Knowledge Park, Bhopal</p>
                  <p>GSTIN: 23ABCDE1234F1Z5</p>
                </div>
              </div>

              <div className="text-center mb-6 relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100"></div>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] italic bg-white relative z-10 px-4 inline-block">Payment Receipt</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[6px] font-black text-gray-400 uppercase">Student Name</p>
                  <p className="text-[8px] font-bold text-textPrimary">RAHUL SHARMA</p>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[6px] font-black text-gray-400 uppercase">Payment Mode</p>
                  <p className="text-[8px] font-bold text-textPrimary uppercase">{formData.prefix}UPI</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 px-1">
                <div className="flex justify-between text-[8px] font-bold border-b border-gray-50 pb-1.5">
                  <span className="text-gray-400 uppercase">Course Fee</span>
                  <span className="text-textPrimary">₹50,000</span>
                </div>
                <div className="flex justify-between text-[8px] font-bold border-b border-gray-50 pb-1.5">
                  <span className="text-gray-400 uppercase">Paid Amount</span>
                  <span className="text-textPrimary">₹20,000</span>
                </div>
                <div className="flex justify-between text-[9px] font-black pt-1">
                  <span className="text-textPrimary uppercase">Balance</span>
                  <span className="text-danger">₹30,000</span>
                </div>
              </div>

              <div className="bg-secondary/10 py-2.5 rounded-xl text-center border border-secondary/20">
                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.1em] flex items-center justify-center gap-1.5">
                  <CheckCircle size={10} /> Fully Paid
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
