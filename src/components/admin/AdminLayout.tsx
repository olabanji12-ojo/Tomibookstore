import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutAdmin } from '../../firebase/helpers';
import { LayoutDashboard, ShoppingBag, PieChart, LogOut, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      toast.success('Logged out.');
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ee] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col fixed inset-y-0 shadow-sm z-20">
        <div className="p-8 border-b border-black/5">
          <h1 className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-1">
            Good Things
          </h1>
          <p className="font-mona text-xs font-black text-black">ADMIN CONSOLE</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <AdminNavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" />
          <AdminNavLink to="/admin/products" icon={<ShoppingBag size={18} />} label="Products" />
          <AdminNavLink to="/admin/orders" icon={<PieChart size={18} />} label="Orders" />
        </nav>

        <div className="p-6 border-t border-black/5 space-y-4">
          <Link 
            to="/" 
            className="flex items-center gap-4 px-4 py-3 text-black/40 hover:text-black transition-colors"
          >
            <ExternalLink size={18} />
            <span className="font-poppins text-[11px] font-bold uppercase tracking-wider">Live Site</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span className="font-poppins text-[11px] font-bold uppercase tracking-wider">Secure Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

interface AdminNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function AdminNavLink({ to, icon, label }: AdminNavLinkProps) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-4 px-4 py-4 rounded-2xl text-black/40 hover:text-black hover:bg-black/[0.02] transition-all group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em]">{label}</span>
    </Link>
  );
}

export default AdminLayout;
