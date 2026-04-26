import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShoppingBag, Plus, Minus, Trash2, Truck, Rocket } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { decrementProductStock, createOrder } from '../../firebase/helpers';
import type { CartItem, Product } from '../../types';

interface CheckoutModalProps {
  mode: 'cart' | 'quickview';
  focusedBook: Product | null;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  onFormDataChange: (data: any) => void;
  onClose: () => void;
  onSuccess: () => void;
  onAddToCart: (product: Product) => void; 
}

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery', price: 2500, time: '3-5 business days', icon: Truck },
  { id: 'express', name: 'Premium Courier', price: 6500, time: '1-2 business days', icon: Rocket },
];

const CheckoutModal = ({ 
  mode,
  focusedBook,
  items, 
  onUpdateQuantity,
  onRemove,
  formData, 
  onFormDataChange,
  onClose, 
  onSuccess,
  onAddToCart,
}: CheckoutModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_OPTIONS[0]);

  // Initialize EmailJS with Public Key
  useEffect(() => {
    emailjs.init('FTDSG45GkUUjDvpp4');
  }, []);

  // ── Cumulative Bag Logic ──
  const displayItems = items;

  const isFocusedInCart = useMemo(() => {
    return items.some(item => item.product.id === focusedBook?.id);
  }, [items, focusedBook]);

  const showQuickViewHeader = mode === 'quickview' && focusedBook && !isFocusedInCart;

  const subtotal = displayItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalPrice = subtotal + shippingMethod.price;

  // ── Paystack Integration ──────────────────────────────────────────────────
  const config = useMemo(() => ({
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: totalPrice * 100, // Now includes shipping
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
        custom_fields: [
            { display_name: "Name", variable_name: "name", value: formData.name },
            { display_name: "Address", variable_name: "address", value: `${formData.address}, ${formData.city}, ${formData.state}` },
            { display_name: "Phone", variable_name: "phone", value: formData.phone },
            { display_name: "Shipping", variable_name: "shipping_method", value: shippingMethod.name }
        ]
    }
  }), [formData.email, formData.name, formData.address, formData.city, formData.state, formData.phone, totalPrice, shippingMethod]);

  const initializePayment = usePaystackPayment(config);

  const sendEmailReceipt = useCallback(async (orderId: string) => {
    const currentItems = [...displayItems];
    const currentSubtotal = subtotal;
    const currentTotal = totalPrice;
    const currentShipping = shippingMethod;
    const customer = { ...formData };

    // 1. Prepare HTML list for legacy templates
    const cartHtml = currentItems.map(item => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 5px; font-family: 'Poppins', sans-serif; font-size: 14px; width: 55%;">${item.product.name}</td>
        <td style="padding: 12px 5px; font-family: 'Poppins', sans-serif; font-size: 14px; width: 15%; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 5px; font-family: 'Poppins', sans-serif; font-size: 14px; width: 30%; text-align: right;">NGN ${item.product.price.toLocaleString()}</td>
      </tr>
    `).join('');

    // 2. Prepare Items Array for loop-based templates
    const itemsArray = currentItems.map(item => ({
       name: item.product.name,
       quantity: item.quantity,
       price: (item.product.price * item.quantity).toLocaleString(),
       image_url: item.product.image
    }));

    const commonParams = {
      order_id: orderId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_address: `${customer.address}, ${customer.city}, ${customer.state}`,
      customer_phone: customer.phone,
      subtotal: currentSubtotal.toLocaleString(),
      shipping_cost: currentShipping.price.toLocaleString(),
      shipping_method: currentShipping.name,
      total_amount: currentTotal.toLocaleString(),
      cart_html: cartHtml, // Legacy support
      items: itemsArray,   // New logic support
      orders: itemsArray   // Compatibility with your provided HTML {{#orders}}
    };

    try {
      // 📦 STEP 1: SEND TO CUSTOMER (Template A)
      await emailjs.send(
        'service_f3axqod',
        'template_gu7klzn',
        {
          ...commonParams,
          email: customer.email, // Use 'email' key to match dashboard {{email}}
          subject_line: "Order Confirmation - Good Things Co."
        },
        { publicKey: 'FTDSG45GkUUjDvpp4' }
      );

      // 🚨 STEP 2: SEND TO OWNER / YOU (New Template B)
      await emailjs.send(
        'service_f3axqod',
        'template_nvh2rjo', 
        { 
          ...commonParams, 
          email: 'emmanuelojo291@gmail.com', // Match dashboard {{email}}
          subject_line: `[FULFILLMENT REQ] Order #${orderId}`
        },
        { publicKey: 'FTDSG45GkUUjDvpp4' }
      );

      console.log('Dual branding emails successfully dispatched.');
    } catch (error) {
      console.error('Email pipeline error:', error);
    }
  }, [formData, displayItems, subtotal, totalPrice, shippingMethod]);

  const handlePaystackSuccess = useCallback(async (reference: any) => {
    sendEmailReceipt(reference.reference);
    
    try {
      const orderData = {
        orderId: reference.reference,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
        items: displayItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingMethod: shippingMethod.name,
        shippingCost: shippingMethod.price,
        subtotal: subtotal,
        total: totalPrice,
        status: 'Pending' as const,
        paymentRef: reference.reference,
        createdAt: new Date().toISOString()
      };

      await Promise.all([
        createOrder(orderData),
        ...displayItems.map(item => decrementProductStock(item.product.id, item.quantity))
      ]);
    } catch (err) {
      console.error('Failed to finalize order details:', err);
    }

    setIsSuccess(true);
    onSuccess();
    Swal.fire({
      icon: 'success',
      title: 'Order Completed',
      text: 'Your artifacts are being prepared.',
      background: '#ffffff',
      color: '#000000',
      confirmButtonColor: '#000000',
    });
  }, [onSuccess, sendEmailReceipt, displayItems, formData, subtotal, totalPrice, shippingMethod]);

  const handlePaystackClose = useCallback(() => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Payment cancelled.',
      showConfirmButton: false,
      timer: 3000,
    });
  }, []);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '');
  const canGoToStep2 = (formData.name || '').trim().length >= 3 && isEmailValid;
  const canGoToStep3 = 
    canGoToStep2 && 
    (formData.phone || '').trim().length >= 10 && 
    (formData.address || '').trim().length > 5 &&
    (formData.city || '').trim().length >= 2 &&
    (formData.state || '').trim().length >= 2;

  const handlePurchaseButton = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGoToStep3) {
        initializePayment({ 
            onSuccess: handlePaystackSuccess, 
            onClose: handlePaystackClose 
        });
    }
  };

  useEffect(() => {
    if (displayItems.length === 0 && !isSuccess && !showQuickViewHeader) {
      onClose();
    }
  }, [displayItems.length, isSuccess, showQuickViewHeader, onClose]);

  if (displayItems.length === 0 && !isSuccess && !showQuickViewHeader) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 px-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          className="relative w-full max-w-[1100px] h-[92vh] sm:h-auto sm:max-h-[90vh] bg-[#f3f2ee] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] sm:rounded-none z-[70]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[80] p-2 bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-white transition-all cursor-pointer shadow-sm"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {!isSuccess ? (
            <div className="flex-1 overflow-y-auto overflow-x-hidden md:flex md:flex-row h-full">
              
              {/* ── LEFT SECTION: Summary ── */}
              <div className="w-full md:w-[38%] bg-black/[0.02] border-b md:border-b-0 md:border-r border-black/[0.05] p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center gap-4 mb-10">
                  <ShoppingBag size={18} strokeWidth={1.5} className="text-black/30" />
                  <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                    Selection ({displayItems.length + (showQuickViewHeader ? 1 : 0)})
                  </h3>
                </div>

                <div className="space-y-8">
                  {/* Quick View Item (If not in cart) */}
                  {showQuickViewHeader && focusedBook && (
                    <div className="flex gap-6 items-start animate-fade-in group/item bg-white/40 p-4 -mx-4 rounded-2xl border border-black/5 shadow-sm">
                      <div className="w-16 h-20 flex-shrink-0 bg-white">
                        <img src={focusedBook.image} alt={focusedBook.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-mona text-xs font-black text-black leading-none mb-3 uppercase truncate">{focusedBook.name}</h4>
                         <button
                           onClick={() => onAddToCart(focusedBook)}
                           className="w-full py-3 bg-black text-white font-mona text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                         >
                           <Plus size={12} />
                           Add — ₦{focusedBook.price.toLocaleString()}
                         </button>
                      </div>
                    </div>
                  )}

                  {displayItems.map((item) => (
                    <div key={item.product.id} className="flex gap-6 items-start group/item">
                      <div className="w-16 h-20 flex-shrink-0 bg-white">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover shadow-md rounded-[1px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4 mb-2">
                          <h4 className="font-mona text-xs font-black text-black leading-snug uppercase tracking-tight truncate">{item.product.name}</h4>
                          <button onClick={() => onRemove(item.product.id)} className="text-black/10 hover:text-black transition-colors"><Trash2 size={12} /></button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 border border-black/5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="text-black/30 hover:text-black"><Minus size={10} strokeWidth={3} /></button>
                                <span className="font-poppins text-[10px] font-bold text-black min-w-[12px] text-center">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="text-black/30 hover:text-black"><Plus size={10} strokeWidth={3} /></button>
                            </div>
                            <span className="font-poppins text-xs font-bold text-black">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-black/5 space-y-4 font-sans">
                  <div className="flex justify-between items-center text-black/40">
                    <span className="font-poppins text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-poppins text-[12px] font-bold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-black/40">
                    <span className="font-poppins text-[10px] font-bold uppercase tracking-widest">{shippingMethod.name}</span>
                    <span className="font-poppins text-[12px] font-bold">₦{shippingMethod.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-black/5">
                    <span className="font-mona text-[12px] font-black uppercase tracking-[0.3em] text-black">Total</span>
                    <span className="font-mona text-2xl font-black text-black">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT SECTION: 3-Step Flow ── */}
              <div className="w-full md:w-[62%] p-8 md:p-16 bg-white/40 flex flex-col">
                
                <div className="flex items-center gap-4 mb-14 overflow-x-auto pb-2 no-scrollbar">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-4 shrink-0">
                      <div className={`flex items-center gap-3 transition-colors ${currentStep === step ? 'text-black' : 'text-black/15'}`}>
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mona text-[10px] font-black ${currentStep === step ? 'border-black bg-black text-white' : 'border-black/5'}`}>
                          {step}
                        </span>
                        <span className="font-mona text-[10px] font-black uppercase tracking-[0.3em]">
                          {step === 1 ? 'Identity' : step === 2 ? 'Logistics' : 'Review'}
                        </span>
                      </div>
                      {step < 3 && <div className="w-8 h-[1px] bg-black/5" />}
                    </div>
                  ))}
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                        <div className="space-y-2">
                          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">Your Identity</h2>
                          <p className="font-poppins text-[10px] tracking-[0.2em] text-black/30 font-bold uppercase italic">Order details will be sent here</p>
                        </div>
                        <div className="space-y-10">
                          <InputField label="FullName" placeholder="e.g. Kolawole Davies" value={formData.name} onChange={(val: string) => onFormDataChange({...formData, name: val})} />
                          <InputField label="Contact Email" type="email" placeholder="you@domain.com" value={formData.email} onChange={(val: string) => onFormDataChange({...formData, email: val})} />
                        </div>
                        <button onClick={() => setCurrentStep(2)} disabled={!canGoToStep2} className="w-full h-16 bg-black text-white font-poppins text-[11px] font-black tracking-[0.5em] uppercase disabled:opacity-20 mt-12 shadow-xl shadow-black/10">Continue to Logistics</button>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                        <div className="space-y-2">
                          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">Logistics</h2>
                          <p className="font-poppins text-[10px] tracking-[0.2em] text-black/30 font-bold uppercase italic">Boutique fulfillment preferences</p>
                        </div>

                        <div className="space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {SHIPPING_OPTIONS.map((option) => {
                               const Icon = option.icon;
                               return (
                                 <button
                                   key={option.id}
                                   onClick={() => setShippingMethod(option)}
                                   className={`p-6 border text-left transition-all ${shippingMethod.id === option.id ? 'border-black bg-black text-white shadow-xl' : 'border-black/5 bg-white/50 text-black/40 hover:border-black/20'}`}
                                 >
                                   <Icon size={20} strokeWidth={1} className="mb-4" />
                                   <p className="font-mona text-[11px] font-black uppercase tracking-widest">{option.name}</p>
                                   <p className="font-poppins text-[9px] uppercase tracking-widest mt-1 opacity-60">{option.time}</p>
                                   <p className="font-poppins text-xs font-bold mt-4">₦{option.price.toLocaleString()}</p>
                                 </button>
                               );
                             })}
                          </div>

                          <div className="space-y-8 pt-6 border-t border-black/5">
                            <InputField label="WhatsApp Number" type="tel" placeholder="+234..." value={formData.phone} onChange={(val: string) => onFormDataChange({...formData, phone: val})} />
                            <div className="space-y-3">
                                <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.5em] text-black/30">Shipping Address</label>
                                <textarea value={formData.address} onChange={(e) => onFormDataChange({...formData, address: e.target.value})} placeholder="Street name and number" className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none resize-none" rows={2} />
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <InputField label="City" placeholder="e.g. Ikeja" value={formData.city} onChange={(val: string) => onFormDataChange({...formData, city: val})} />
                                <InputField label="State" placeholder="e.g. Lagos" value={formData.state} onChange={(val: string) => onFormDataChange({...formData, state: val})} />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button onClick={() => setCurrentStep(1)} className="px-8 h-16 border border-black/10 font-poppins text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Back</button>
                          <button onClick={() => setCurrentStep(3)} disabled={!canGoToStep3} className="flex-1 h-16 bg-black text-white font-poppins text-[11px] font-black tracking-[0.5em] uppercase disabled:opacity-20 shadow-xl shadow-black/10">Review & Payment</button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                        <div className="space-y-2">
                          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">Review & Pay</h2>
                          <p className="font-poppins text-[10px] tracking-[0.2em] text-black/30 font-bold uppercase italic">One last check</p>
                        </div>

                        <div className="bg-black/[0.03] p-8 space-y-6 rounded-2xl border border-black/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.3em] text-black/30 mb-2">Deliver To</p>
                                    <p className="font-mona text-xs font-black text-black uppercase tracking-tight">{formData.name}</p>
                                    <p className="font-poppins text-[10px] text-black/60 leading-relaxed mt-1">{formData.address}, {formData.city}, {formData.state}</p>
                                </div>
                                <button onClick={() => setCurrentStep(2)} className="font-poppins text-[10px] font-bold uppercase tracking-widest text-black/40 underline underline-offset-4 cursor-pointer">Edit</button>
                            </div>
                            <div className="h-px bg-black/5" />
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.3em] text-black/30 mb-1">Logistics</p>
                                    <p className="font-poppins text-[10px] text-black/60">{shippingMethod.name} ({shippingMethod.price > 0 ? `₦${shippingMethod.price.toLocaleString()}` : 'Free'})</p>
                                </div>
                                <button onClick={() => setCurrentStep(2)} className="font-poppins text-[10px] font-bold uppercase tracking-widest text-black/40 underline underline-offset-4 cursor-pointer">Edit</button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                          <button onClick={() => setCurrentStep(2)} className="px-8 h-16 border border-black/10 font-poppins text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Back</button>
                          <button onClick={handlePurchaseButton} className="flex-1 h-16 bg-black text-white font-poppins text-[11px] font-black tracking-[0.5em] uppercase transition-all shadow-xl shadow-black/20 cursor-pointer">PURCHASE — ₦{totalPrice.toLocaleString()}</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white h-full font-mona">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
                <CheckCircle2 size={80} strokeWidth={1} className="text-black mb-10" />
              </motion.div>
              <div className="space-y-4 mb-16">
                  <h2 className="font-mona text-5xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none">ORDER RECEIVED</h2>
                  <p className="font-poppins text-[10px] text-black/40 uppercase tracking-[0.4em] font-bold italic">Artifacts are being prepared.</p>
              </div>
              <button onClick={onClose} className="px-16 py-6 bg-black text-white font-mona text-[10px] font-black uppercase tracking-[0.3em] rounded-xl">CONTINUE SEEKING</button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function InputField({ label, placeholder, value, onChange, type = "text" }: any) {
    return (
        <div className="space-y-3 group">
            <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.5em] text-black/30 group-focus-within:text-black transition-colors">{label}</label>
            <input required type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-base md:text-sm focus:border-black outline-none transition-all placeholder:text-black/10" />
        </div>
    );
}

export default CheckoutModal;