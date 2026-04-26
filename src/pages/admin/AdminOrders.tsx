import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, Package, Truck, CheckCircle, Phone, MapPin, Mail } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import MetaTags from '../../components/shared/MetaTags';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: string;
  items: OrderItem[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Shipped: 'bg-sky-100 text-sky-700 border-sky-200',
    Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ee] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f2ee] pb-24">
      <MetaTags title="Order Management | Admin" description="Manage your boutique orders and fulfillment status." />
      
      {/* Editorial Header */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-white/40 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <p className="font-mona text-[10px] font-black uppercase tracking-[0.5em] text-black/30">
                Command Center
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-medium italic text-black tracking-tighter">
                Fulfillment Management
              </h1>
           </div>
           <div className="flex gap-12">
              <div className="space-y-1">
                 <p className="font-mona text-[9px] font-black uppercase tracking-widest text-black/40">Total Active</p>
                 <p className="font-mona text-3xl font-black text-black">{orders.filter(o => o.status !== 'Delivered').length}</p>
              </div>
              <div className="space-y-1">
                 <p className="font-mona text-[9px] font-black uppercase tracking-widest text-black/40">Revenue Flow</p>
                 <p className="font-mona text-3xl font-black text-black">₦{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</p>
              </div>
           </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-[3rem] border border-black/5">
               <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-black/10 mb-6" />
               <p className="font-serif text-2xl italic text-black/40">Awaiting your first boutique order...</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2rem] md:rounded-[3rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Order Summary Row */}
                <div 
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer"
                >
                  <div className="flex gap-6 items-center">
                    <div className={`p-4 rounded-3xl border ${statusStyles[order.status]}`}>
                      {order.status === 'Pending' ? <Package size={24} /> : order.status === 'Shipped' ? <Truck size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-mona text-lg font-black text-black leading-none mb-2">#{order.orderId.slice(-6)}</h3>
                      <p className="font-poppins text-xs text-black/40 uppercase font-black tracking-widest">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-12">
                    <div className="space-y-1">
                      <p className="font-mona text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Total Value</p>
                      <p className="font-poppins text-sm font-bold text-black font-sans">₦{order.total.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mona text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Created</p>
                      <p className="font-poppins text-sm text-black/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="px-6 py-2 rounded-full border border-black/5 font-mona text-[9px] font-black uppercase tracking-widest">
                       {order.items.length} {order.items.length === 1 ? 'Artifact' : 'Artifacts'}
                    </div>
                    {expandedOrder === order.id ? <ChevronUp size={20} className="text-black/20" /> : <ChevronDown size={20} className="text-black/20" />}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-black/5"
                    >
                      <div className="p-8 md:p-12 md:pt-0 grid grid-cols-1 md:grid-cols-3 gap-12">
                        
                        {/* Customer & Shipping */}
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <h4 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Delivery Log</h4>
                              <div className="space-y-3">
                                <div className="flex gap-3 text-black/60"><Mail size={14} className="mt-1" /> <span className="text-xs font-sans">{order.customerEmail}</span></div>
                                <div className="flex gap-3 text-black/60"><Phone size={14} className="mt-1" /> <span className="text-xs font-sans">{order.customerPhone}</span></div>
                                <div className="flex gap-3 text-black/60"><MapPin size={14} className="mt-1" /> <span className="text-xs font-sans leading-relaxed">{order.shippingAddress}</span></div>
                                <div className="flex gap-3 text-black/60"><Truck size={14} className="mt-1" /> <span className="text-xs font-bold uppercase tracking-widest text-black">{order.shippingMethod}</span></div>
                              </div>
                           </div>
                        </div>

                        {/* Order Items */}
                        <div className="md:col-span-1 space-y-6">
                           <h4 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Artifact Breakdown</h4>
                           <div className="space-y-4">
                              {order.items.map((item, idx) => (
                                 <div key={idx} className="flex justify-between items-center bg-black/[0.02] p-4 rounded-2xl">
                                    <div>
                                       <p className="font-mona text-[11px] font-black text-black tracking-tight">{item.productName}</p>
                                       <p className="font-poppins text-[9px] text-black/40 font-bold uppercase">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-poppins text-xs font-bold text-black">₦{(item.price * item.quantity).toLocaleString()}</p>
                                 </div>
                              ))}
                              <div className="pt-4 flex justify-between items-center text-black/40 px-2 outline-none">
                                 <span className="font-mona text-[9px] font-black uppercase tracking-widest">Subtotal</span>
                                 <span className="text-xs font-bold">₦{order.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-black/40 px-2">
                                 <span className="font-mona text-[9px] font-black uppercase tracking-widest">Courier ({order.shippingMethod})</span>
                                 <span className="text-xs font-bold">₦{order.shippingCost.toLocaleString()}</span>
                              </div>
                           </div>
                        </div>

                        {/* Status Actions */}
                        <div className="space-y-6">
                           <h4 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Administrative Actions</h4>
                           <div className="flex flex-col gap-3">
                              <button 
                                onClick={() => updateStatus(order.id, 'Pending')}
                                className={`w-full py-4 rounded-2xl font-mona text-[9px] font-black uppercase tracking-[0.2em] transition-all ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white border border-black/5 text-black/20 hover:border-black/20'}`}
                              >
                                Mark as Pending
                              </button>
                              <button 
                                onClick={() => updateStatus(order.id, 'Shipped')}
                                className={`w-full py-4 rounded-2xl font-mona text-[9px] font-black uppercase tracking-[0.2em] transition-all ${order.status === 'Shipped' ? 'bg-sky-100 text-sky-700 border-sky-200' : 'bg-white border border-black/5 text-black/20 hover:border-black/20'}`}
                              >
                                Mark as Shipped
                              </button>
                              <button 
                                onClick={() => updateStatus(order.id, 'Delivered')}
                                className={`w-full py-4 rounded-2xl font-mona text-[9px] font-black uppercase tracking-[0.2em] transition-all ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white border border-black/5 text-black/20 hover:border-black/20'}`}
                              >
                                Mark as Delivered
                              </button>
                           </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminOrders;


