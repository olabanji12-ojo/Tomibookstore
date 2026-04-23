import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getDashboardStats } from '../firebase/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    inventoryCount: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getDashboardStats();
      if (res.success && res.stats) {
        setStats({
          totalRevenue: res.stats.todayRevenue,
          pendingOrders: res.stats.pendingOrders,
          inventoryCount: res.stats.productsCount,
          lowStockItems: 0, // Simplified for now
          newRequests: res.stats.newRequests
        } as any);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="font-mona text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">Overview</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">Operational Pulse</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-8 py-4 rounded-3xl border border-black/5 flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             <span className="font-mona text-[10px] font-black uppercase tracking-widest">System Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard 
          label="Today's Revenue" 
          value={`₦${stats.totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp size={16} />}
          subValue="Paid via Paystack" 
        />
        <StatCard 
          label="Pending Orders" 
          value={stats.pendingOrders.toString()} 
          icon={<ShoppingCart size={16} />}
          subValue="Awaiting fulfillment" 
        />
        <StatCard 
          label="New Requests" 
          value={(stats as any).newRequests?.toString() || '0'} 
          icon={<Package size={16} />}
          subValue="Form submissions" 
        />
        <StatCard 
          label="Inventory" 
          value={stats.inventoryCount.toString()} 
          icon={<Package size={16} />}
          subValue="Active pieces" 
        />
      </div>

      <div className="mt-12 md:mt-16 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-black/5 p-8 md:p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
        {loading ? (
             <div className="flex items-center justify-center gap-3">
               <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
               <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s]" />
               <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
             </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-[#f3f2ee] rounded-full mx-auto flex items-center justify-center mb-8">
              <LayoutDashboard size={32} className="text-black/10" />
            </div>
            <h3 className="font-mona text-xl font-black text-black uppercase tracking-tight mb-4">Welcome to your Dashboard</h3>
            <p className="font-poppins text-sm text-black/40 max-w-sm mx-auto leading-relaxed">
              Your store is currently live. You can manage your products, track orders, and monitor your boutique's performance from here.
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

function StatCard({ label, value, subValue, icon }: { label: string, value: string, subValue: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-black/5 shadow-sm group hover:border-black/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <p className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">{label}</p>
        <div className="text-black/10 group-hover:text-black transition-colors">{icon}</div>
      </div>
      <p className="font-mona text-4xl font-black text-black mb-4">{value}</p>
      <p className="font-poppins text-[10px] text-black/20 font-bold uppercase tracking-wider group-hover:text-black/40 transition-colors">{subValue}</p>
    </div>
  );
}

export default AdminDashboard;
