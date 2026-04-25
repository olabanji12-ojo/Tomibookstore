import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
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

  const totalPrice = displayItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // ── Paystack Integration ──────────────────────────────────────────────────
  const config = useMemo(() => ({
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: totalPrice * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
        custom_fields: [
            { display_name: "Name", variable_name: "name", value: formData.name },
            { display_name: "Address", variable_name: "address", value: `${formData.address}, ${formData.city}, ${formData.state}` },
            { display_name: "Phone", variable_name: "phone", value: formData.phone }
        ]
    }
  }), [formData.email, formData.name, formData.address, formData.city, formData.state, formData.phone, totalPrice]);

  const initializePayment = usePaystackPayment(config);

  const sendEmailReceipt = useCallback(async (orderId: string) => {
    const currentItems = [...displayItems];
    const currentTotal = totalPrice;
    const customer = { ...formData }; // Capture data immediately

    const cartHtml = currentItems.map(item => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 5px; font-family: 'Poppins', sans-serif; font-size: 14px; width: 55%;">${item.product.name}</td>
        <td style="padding: 12px 5px; font-family: 'Poppins', sans-serif; font-size: 14px; width: 15%; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 5px; font-family: 'Poppins', sans-serif; font-size: 14px; width: 30%; text-align: right;">NGN ${item.product.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const templateParams = {
      customer_name: customer.name,
      customer_email: customer.email,
      to_email: customer.email,
      customer_address: `${customer.address}, ${customer.city}, ${customer.state}`,
      order_id: orderId,
      cart_html: cartHtml,
      subtotal: currentTotal.toLocaleString(),
      shipping_cost: "0",
      total_amount: currentTotal.toLocaleString()
    };

    console.log('Sending receipt to:', customer.email, 'with params:', templateParams);

    try {
      // 1. Send receipt to Customer
      const customerEmailPromise = emailjs.send(
        'service_f3axqod',
        'template_gu7klzn',
        {
          ...templateParams,
          subject_line: "Your Good Things Co. Order Confirmation"
        },
        { publicKey: 'FTDSG45GkUUjDvpp4' }
      );

      // 2. Send distinct Alert to Owner
      const ownerEmailPromise = emailjs.send(
        'service_f3axqod',
        'template_gu7klzn',
        { 
          ...templateParams, 
          customer_name: `[NEW SALE] ${customer.name}`,
          to_email: 'emmanuelojo291@gmail.com',
          subject_line: "🚨 NEW ORDER RECEIVED - ACTION REQUIRED"
        },
        { publicKey: 'FTDSG45GkUUjDvpp4' }
      );

      await Promise.all([customerEmailPromise, ownerEmailPromise]);
      console.log('Dual emails sent successfully');
    } catch (error) {
      console.error('Failed to send emails:', error);
    }
  }, [formData, displayItems, totalPrice]);

  const handlePaystackSuccess = useCallback(async (reference: any) => {
    // 1. Send the email receipt
    sendEmailReceipt(reference.reference);
    
    // 2. Log Order to Firestore & Decrement stock
    try {
      const orderData = {
        orderId: reference.reference, // Use Paystack ref as order ID
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
        total: totalPrice,
        status: 'Pending' as const,
        paymentRef: reference.reference
      };

      await Promise.all([
        createOrder(orderData),
        ...displayItems.map(item => decrementProductStock(item.product.id, item.quantity))
      ]);
    } catch (err) {
      console.error('Failed to finalize order details:', err);
    }

    // 3. Original success logic
    setIsSuccess(true);
    onSuccess();
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: 'Your order has been placed successfully.',
      background: '#ffffff',
      color: '#000000',
      confirmButtonColor: '#000000',
    });
  }, [onSuccess, sendEmailReceipt, displayItems]);

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

  // ── Validation Logic ──────────────────────────────────────────────────────
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
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 32, stiffness: 280, mass: 0.9 }}
          className="relative w-full max-w-[1100px] h-[92vh] sm:h-auto sm:max-h-[90vh] bg-[#f3f2ee] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] sm:rounded-none z-[70]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[80] p-2 bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-white transition-all cursor-pointer shadow-sm"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {!isSuccess ? (
            <div className="flex-1 overflow-y-auto overflow-x-hidden md:flex md:flex-row h-full">
              
              {/* ── LEFT SECTION: Summary ── */}
              <div className="w-full md:w-[40%] bg-black/[0.02] border-b md:border-b-0 md:border-r border-black/[0.05] p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center gap-4 mb-10">
                  <ShoppingBag size={18} strokeWidth={1.5} className="text-black/30" />
                  <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                    {mode === 'quickview' ? 'Selection + Bag' : 'Your Selection'} ({displayItems.length + (showQuickViewHeader ? 1 : 0)})
                  </h3>
                </div>

                <div className="space-y-8">
                  {/* Quick View Item (If not in cart) */}
                  {showQuickViewHeader && focusedBook && (
                    <div className="flex gap-6 items-start animate-fade-in group/item bg-white/40 p-4 -mx-4 rounded-2xl border border-black/5 shadow-sm">
                    <div className="w-20 md:w-28 flex-shrink-0">
                      <div className="aspect-[4/5] bg-white overflow-hidden rounded-[2px] shadow-md mb-2">
                        <img 
                          src={focusedBook.image} 
                          alt={focusedBook.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Mini Gallery for QuickView */}
                      {focusedBook.images && focusedBook.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-1">
                          {focusedBook.images.slice(0, 4).map((img, idx) => (
                            <div key={idx} className="aspect-square bg-white border border-black/5 overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4 mb-2">
                          <h4 className="font-mona text-sm font-black text-black leading-snug uppercase tracking-tight">
                            {focusedBook.name}
                          </h4>
                          <span className="bg-black text-white px-2 py-0.5 rounded text-[7px] font-black tracking-widest uppercase">
                            New Find
                          </span>
                        </div>
                        <p className="font-poppins text-[9px] text-black/40 uppercase tracking-widest mb-4">
                           {focusedBook.author}
                        </p>
                        
                        <button
                          onClick={() => onAddToCart(focusedBook)}
                          className="w-full py-3 bg-black text-white font-mona text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={12} />
                          Add to Bag — ₦{focusedBook.price.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  )}

                  {displayItems.map((item) => (
                    <div key={item.product.id} className="flex gap-6 items-start animate-fade-in group/item">
                      <div className="w-16 md:w-24 aspect-[4/5] flex-shrink-0 bg-white">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover shadow-md rounded-[1px]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4 mb-2">
                          <h4 className="font-mona text-xs font-black text-black leading-snug uppercase tracking-tight truncate">
                            {item.product.name}
                          </h4>
                          <button 
                            onClick={() => onRemove(item.product.id)}
                            className="text-black/10 hover:text-black transition-colors"
                          >
                            <Trash2 size={12} strokeWidth={2} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 border border-black/5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                <button 
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="text-black/30 hover:text-black transition-colors"
                                >
                                    <Minus size={10} strokeWidth={3} />
                                </button>
                                <span className="font-poppins text-[10px] font-bold text-black min-w-[12px] text-center">
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="text-black/30 hover:text-black transition-colors"
                                >
                                    <Plus size={10} strokeWidth={3} />
                                </button>
                            </div>
                            <span className="font-poppins text-xs font-bold text-black">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-black/5">
                  <div className="flex justify-between items-center mb-6 pt-6 border-t border-black/5">
                    <span className="font-mona text-[12px] font-black uppercase tracking-[0.3em] text-black">Grand Total</span>
                    <span className="font-mona text-2xl font-black text-black">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT SECTION: 3-Step Flow ── */}
              <div className="w-full md:w-[60%] p-8 md:p-16 bg-white/40 flex flex-col">
                
                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-14 overflow-x-auto pb-2 no-scrollbar">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-4 shrink-0">
                      <div className={`flex items-center gap-3 transition-colors ${currentStep === step ? 'text-black' : 'text-black/15'}`}>
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mona text-[10px] font-black ${currentStep === step ? 'border-black bg-black text-white' : 'border-black/5'}`}>
                          {step}
                        </span>
                        <span className="font-mona text-[10px] font-black uppercase tracking-[0.3em]">
                          {step === 1 ? 'Identity' : step === 2 ? 'Delivery' : 'Review'}
                        </span>
                      </div>
                      {step < 3 && <div className="w-8 h-[1px] bg-black/5" />}
                    </div>
                  ))}
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                      >
                        <div className="space-y-2">
                          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">Your Identity</h2>
                          <p className="font-poppins text-[10px] tracking-[0.2em] text-black/30 font-bold uppercase">Basic info for your boutique order</p>
                        </div>

                        <div className="space-y-10">
                          <InputField 
                            label="FullName" 
                            placeholder="e.g. Kolawole Davies" 
                            value={formData.name}
                            onChange={(val: string) => onFormDataChange({...formData, name: val})}
                          />
                          <InputField 
                            label="Contact Email" 
                            type="email"
                            placeholder="you@domain.com" 
                            value={formData.email}
                            onChange={(val: string) => onFormDataChange({...formData, email: val})}
                          />
                        </div>

                        <button
                          onClick={() => setCurrentStep(2)}
                          disabled={!canGoToStep2}
                          className="w-full h-16 bg-black text-white font-poppins text-[11px] font-black tracking-[0.5em] uppercase disabled:opacity-20 transition-all shadow-xl shadow-black/10 mt-12"
                        >
                          Continue to Delivery
                        </button>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                      >
                        <div className="space-y-2">
                          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">Delivery</h2>
                          <p className="font-poppins text-[10px] tracking-[0.2em] text-black/30 font-bold uppercase">Where should we send your pieces?</p>
                        </div>

                        <div className="space-y-10">
                          <InputField 
                            label="WhatsApp Number" 
                            type="tel"
                            placeholder="+234..." 
                            value={formData.phone}
                            onChange={(val: string) => onFormDataChange({...formData, phone: val})}
                          />
                          <div className="space-y-3">
                              <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.5em] text-black/30">Shipping Address</label>
                              <textarea 
                                value={formData.address}
                                onChange={(e) => onFormDataChange({...formData, address: e.target.value})}
                                placeholder="Street name and number"
                                className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-colors resize-none"
                                rows={2}
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-10">
                              <InputField label="City" placeholder="e.g. Ikeja" value={formData.city} onChange={(val: string) => onFormDataChange({...formData, city: val})} />
                              <InputField label="State" placeholder="e.g. Lagos" value={formData.state} onChange={(val: string) => onFormDataChange({...formData, state: val})} />
                          </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                          <button onClick={() => setCurrentStep(1)} className="px-8 h-16 border border-black/10 font-poppins text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all text-black/40">Back</button>
                          <button
                            onClick={() => setCurrentStep(3)}
                            disabled={!canGoToStep3}
                            className="flex-1 h-16 bg-black text-white font-poppins text-[11px] font-black tracking-[0.5em] uppercase disabled:opacity-20 transition-all shadow-xl shadow-black/10"
                          >
                            Review & Payment
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                      >
                        <div className="space-y-2">
                          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">Review & Pay</h2>
                          <p className="font-poppins text-[10px] tracking-[0.2em] text-black/30 font-bold uppercase">One last check before finalizing</p>
                        </div>

                        <div className="bg-black/[0.03] p-8 space-y-6 rounded-2xl">
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
                                    <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.3em] text-black/30 mb-1">Contact Details</p>
                                    <p className="font-poppins text-[10px] text-black/60">{formData.email} • {formData.phone}</p>
                                </div>
                                <button onClick={() => setCurrentStep(1)} className="font-poppins text-[10px] font-bold uppercase tracking-widest text-black/40 underline underline-offset-4 cursor-pointer">Edit</button>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                          <button onClick={() => setCurrentStep(2)} className="px-8 h-16 border border-black/10 font-poppins text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all text-black/40">Back</button>
                          <button
                            onClick={handlePurchaseButton}
                            className="flex-1 h-16 bg-black text-white font-poppins text-[11px] font-black tracking-[0.5em] uppercase transition-all shadow-xl shadow-black/20 cursor-pointer"
                          >
                            PURCHASE — ₦{totalPrice.toLocaleString()}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            /* Success Screen - BOUTIQUE IDENTITY STRATEGY */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white h-full sm:h-auto">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <CheckCircle2 size={80} strokeWidth={1} className="text-black mb-10" />
              </motion.div>
              
              <div className="space-y-4 mb-16">
                  <h2 className="font-mona text-5xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none">ORDER RECEIVED</h2>
                  <p className="font-poppins text-[10px] text-black/40 uppercase tracking-[0.4em] font-bold italic">Artifacts are being prepared.</p>
              </div>

              {/* Boutique Identity Invitation */}
              <div className="max-w-md w-full bg-black/[0.03] p-10 rounded-[2rem] border border-black/5 mb-12">
                  <h4 className="font-serif text-lg font-black text-black uppercase tracking-tight mb-4">A copy of your receipt has been sent.</h4>
                  <p className="font-sans text-xs text-black/50 leading-relaxed mb-10">
                      We've dispatched a confirmation to <span className="text-black font-bold italic">{formData.email}</span>. Your artifacts are being carefully prepared for shipment.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                      {/* Optional WhatsApp Shortcut */}
                      <button 
                        onClick={() => {
                          const msg = encodeURIComponent(`Hi Goodthingsco! I just placed an order (#${config?.reference || 'Order'}) and I'm so excited! Just wanted to say hi.`);
                          window.open(`https://wa.me/2348061486696?text=${msg}`, '_blank');
                        }}
                        className="w-full py-5 bg-[#25D366] text-white font-mona text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-green-500/20"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        CHAT ON WHATSAPP
                      </button>

                      <button 
                        onClick={onClose}
                        className="w-full py-5 bg-black text-white font-mona text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-xl shadow-xl shadow-black/10"
                      >
                        CONTINUE SHOPPING
                      </button>
                      <button 
                        onClick={onClose}
                        className="font-sans text-[9px] font-bold text-black/30 uppercase tracking-[0.2em] hover:text-black transition-colors"
                      >
                        Skip for now, keep seeking good things
                      </button>
                  </div>
              </div>

              <div className="w-16 h-px bg-black/10 mx-auto" />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── Reusable Component ───────────────────────────────────────────────────────

function InputField({ label, placeholder, value, onChange, type = "text" }: any) {
    return (
        <div className="space-y-3 group">
            <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.5em] text-black/30 group-focus-within:text-black transition-colors">{label}</label>
            <input 
                required
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-base md:text-sm focus:border-black outline-none transition-all placeholder:text-black/10"
            />
        </div>
    );
}

export default CheckoutModal;