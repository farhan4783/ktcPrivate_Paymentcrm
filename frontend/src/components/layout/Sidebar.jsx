import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  LogOut,
  FileBarChart,
  ShieldCheck,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Students', icon: Users, path: '/students' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Receipts', icon: FileText, path: '/receipts' },
    { name: 'Reports', icon: FileBarChart, path: '/reports' },
  ];

  // Add Admin-only link
  if (user?.role === 'admin') {
    menuItems.push({ name: 'User Management', icon: ShieldCheck, path: '/admin/users' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "w-72 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-24 flex items-center justify-between px-8">
        <Link to="/" className="w-40" onClick={onClose}>
          <img 
            src="/logo.jpeg" 
            alt="KodeToCareer Logo" 
            className="w-full h-auto max-h-12 object-contain" 
          />
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-textPrimary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all group",
              isActive 
                ? "bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/20" 
                : "text-textSecondary hover:bg-gray-50 hover:text-textPrimary"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-textPrimary")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-gray-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-[15px] font-semibold text-textSecondary hover:bg-red-50 hover:text-danger rounded-xl transition-all w-full group"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-danger transition-colors" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
