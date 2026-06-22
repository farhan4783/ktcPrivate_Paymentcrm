import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Dynamic title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/students/')) return 'Student Profile';
    if (path === '/students') return 'Students CRM';
    if (path === '/payments') return 'Payments & Collections';
    if (path === '/receipts') return 'Receipt Generator';
    if (path === '/reports') return 'Financial Reports';
    if (path === '/admin/users') return 'System User Management';
    if (path === '/settings') return 'Account Settings';
    return 'CRM Platform';
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-24 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 md:px-12 fixed top-0 right-0 left-0 lg:left-80 z-30 border-b border-gray-50/50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Menu size={22} className="text-textPrimary" />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-black text-textPrimary leading-tight tracking-tight">{getPageTitle()}</h2>
          <p className="hidden md:block text-sm text-textSecondary font-medium">Welcome back, {user?.name || 'User'}! 👋</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="relative w-40 md:w-80 hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-2.5 pl-12 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2.5 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
            <Bell size={20} className="text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-bold border border-[#0EA5E9]/20 shadow-sm overflow-hidden">
              {userInitial}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-black text-textPrimary leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] font-black text-textSecondary uppercase mt-1 tracking-widest">{user?.role || 'Staff'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
