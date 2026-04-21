import { LayoutDashboard } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h1 className="font-mona text-4xl font-black text-black uppercase tracking-tighter">Overview</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">Operational Pulse</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-8 py-4 rounded-3xl border border-black/5 flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             <span className="font-mona text-[10px] font-black uppercase tracking-widest">System Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Total Sales" value="₦0" subValue="+0% vs last week" />
        <StatCard label="Orders" value="0" subValue="Pending fulfillment" />
        <StatCard label="Inventory" value="0" subValue="Items in boutique" />
      </div>

      <div className="mt-16 bg-white rounded-[2.5rem] border border-black/5 p-12 text-center">
        <div className="w-20 h-20 bg-[#f3f2ee] rounded-full mx-auto flex items-center justify-center mb-8">
          <LayoutDashboard size={32} className="text-black/10" />
        </div>
        <h3 className="font-mona text-xl font-black text-black uppercase tracking-tight mb-4">Welcome to your Dashboard</h3>
        <p className="font-poppins text-sm text-black/40 max-w-sm mx-auto leading-relaxed">
          Your inventory and order history will appear here once you've synchronized your data.
        </p>
      </div>
    </AdminLayout>
  );
};

function StatCard({ label, value, subValue }: { label: string, value: string, subValue: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
      <p className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-4">{label}</p>
      <p className="font-mona text-4xl font-black text-black mb-4">{value}</p>
      <p className="font-poppins text-[10px] text-black/20 font-bold uppercase tracking-wider">{subValue}</p>
    </div>
  );
}

export default AdminDashboard;
