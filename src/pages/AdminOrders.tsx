import { useState, useEffect } from 'react';
import { ShoppingBag, Search, ExternalLink, User, Mail, MapPin } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getOrders, updateOrderStatus } from '../firebase/helpers';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getOrders();
    if (res.success) {
      setOrders(res.orders || []);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      toast.success(`Order set to ${newStatus}`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="font-mona text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">Order History</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">Transaction Tracking</p>
        </div>
        
        <div className="relative group">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
          <input 
            type="text"
            placeholder="Find by Transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-black/5 rounded-full pl-14 pr-8 py-4 font-poppins text-[11px] focus:border-black outline-none transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="space-y-8">
        {loading ? (
           <div className="bg-white p-20 rounded-[2.5rem] border border-black/5 text-center">
             <div className="flex items-center justify-center gap-3">
               <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
               <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s]" />
               <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
             </div>
           </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border border-black/5 text-center">
            <div className="w-16 h-16 bg-[#f3f2ee] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={24} className="text-black/10" />
            </div>
            <h3 className="font-mona text-sm font-black text-black uppercase tracking-widest">No transactions found</h3>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm group">
              {/* Order Header */}
              <div className="p-6 md:p-12 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mona text-lg font-black text-black uppercase tracking-tight">#{order.orderId}</p>
                      <span className={`px-4 py-1.5 rounded-full font-mona text-[8px] font-black uppercase tracking-widest 
                        ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-widest">
                       {order.createdAt?.toDate()?.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id!, e.target.value as any)}
                    className="bg-[#f3f2ee] px-6 py-4 rounded-2xl font-poppins text-[10px] font-black uppercase tracking-widest focus:ring-0 outline-none cursor-pointer border-none"
                  >
                    <option value="Pending">Mark Pending</option>
                    <option value="Packed">Mark Packed</option>
                    <option value="Shipped">Mark Shipped</option>
                    <option value="Delivered">Mark Delivered</option>
                    <option value="Cancelled">Cancel Order</option>
                  </select>
                  <a 
                    href={`https://dashboard.paystack.com/#/transactions/${order.paymentRef}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-white border border-black/5 rounded-2xl text-black hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              {/* Order Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-black/5">
                {/* Items */}
                <div className="lg:col-span-2 p-6 md:p-12">
                   <div className="space-y-6">
                     <p className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-8">Purchase Summary</p>
                     {order.items.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between group/item">
                         <div className="flex items-center gap-4">
                           <span className="w-6 h-6 bg-[#f3f2ee] rounded-full flex items-center justify-center font-mona text-[9px] font-black text-black/40">{item.quantity}</span>
                           <p className="font-mona text-[11px] font-black text-black uppercase tracking-tight">{item.productName}</p>
                         </div>
                         <p className="font-poppins text-[11px] font-bold text-black/60 tracking-wider">₦{(item.price * item.quantity).toLocaleString()}</p>
                       </div>
                     ))}
                     <div className="pt-8 mt-8 border-t border-dashed border-black/10 flex justify-between items-center">
                        <p className="font-mona text-[11px] font-black text-black uppercase tracking-[0.2em]">Total Transaction</p>
                        <p className="font-mona text-xl md:text-2xl font-black text-black uppercase tracking-tighter">₦{order.total.toLocaleString()}</p>
                     </div>
                   </div>
                </div>

                {/* Customer Info */}
                <div className="bg-black/[0.01] p-6 md:p-12 space-y-8">
                  <p className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Delivery Dossier</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <User size={14} className="text-black/30 mt-0.5" />
                      <div>
                        <p className="font-mona text-[10px] font-black text-black uppercase tracking-widest">{order.customerName}</p>
                        <p className="font-poppins text-[10px] text-black/40 mt-1">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail size={14} className="text-black/30 mt-0.5" />
                      <p className="font-poppins text-[10px] text-black/40">{order.customerEmail}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin size={14} className="text-black/30 mt-0.5" />
                      <p className="font-poppins text-[10px] text-black/60 leading-relaxed max-w-[200px]">{order.shippingAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
