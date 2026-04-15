import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../App';
import type { Book } from '../../types';

interface CheckoutModalProps {
  mode: 'cart' | 'quickview';
  focusedBook: Book | null;
  items: CartItem[];
  onUpdateQuantity: (bookId: string, delta: number) => void;
  onRemove: (bookId: string) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onFormDataChange: (data: any) => void;
  onClose: () => void;
  onSuccess: () => void;
  onAddToCart?: (book: Book) => void; 
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
  onAddToCart
}: CheckoutModalProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const displayItems = mode === 'cart' ? items : (focusedBook ? [{ book: focusedBook, quantity: 1 }] : []);
  
  if (displayItems.length === 0 && !isSuccess) {
    onClose();
    return null;
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = 
    formData.name.trim().length > 2 && 
    isEmailValid && 
    formData.phone.trim().length >= 10 && 
    formData.address.trim().length > 5;

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    onSuccess();
  };

  const totalPrice = displayItems.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 px-0">
        
        {/* Backdrop - Visible Gap Area at top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container: Single Scroll Surface Architecture */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 300,
            mass: 0.8
          }}
          className="relative w-full max-w-[1000px] h-[92vh] sm:h-auto sm:max-h-[85vh] bg-[#f3f2ee] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] sm:rounded-none z-[70]"
        >
          {/* 1. Drag Handle / Top Spacing */}
          <div className="md:hidden w-12 h-1.5 bg-black/10 rounded-full mx-auto mt-4 mb-2 shrink-0" />

          {/* 2. Fixed Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[80] p-2 bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-white transition-all cursor-pointer shadow-sm"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {!isSuccess ? (
            <div className="flex-1 overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling:touch pb-40 md:pb-0">
              <div className="flex flex-col md:flex-row h-full">
                
                {/* ── LEFT SECTION: Books ── */}
                <div className="w-full md:w-[45%] bg-black/[0.02] border-b md:border-b-0 md:border-r border-black/[0.05] p-6 md:p-10">
                  <div className="mb-8 hidden md:block border-b border-black/5 pb-4">
                    <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                      Bag Selection
                    </h3>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    {mode === 'quickview' && focusedBook ? (
                      <div className="flex flex-col items-center text-center">
                          <img 
                            src={focusedBook.image} 
                            alt={focusedBook.title} 
                            className="h-72 md:h-80 object-contain shadow-2xl mb-8 rounded-[1px]"
                          />
                          <h2 className="font-mona text-2xl font-black text-black leading-tight uppercase tracking-tight mb-2">
                              {focusedBook.title}
                          </h2>
                          <p className="font-poppins text-[10px] font-medium text-black/40 uppercase tracking-[0.2em] mb-6">
                              by {focusedBook.author}
                          </p>
                          <p className="font-poppins text-[13px] text-black/60 leading-relaxed mb-8 italic">
                              {focusedBook.description}
                          </p>
                          <button 
                            onClick={() => onAddToCart?.(focusedBook)}
                            className="w-full md:w-auto bg-black text-white px-8 py-4 font-poppins text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer"
                          >
                            Add To Bag — ₦{focusedBook.price.toLocaleString()}
                          </button>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div key={item.book.id} className="flex gap-4 md:gap-6 items-start">
                          <div className="w-16 md:w-20 aspect-[2/3] flex-shrink-0">
                            <img 
                              src={item.book.image} 
                              alt={item.book.title} 
                              className="w-full h-full object-cover shadow-lg rounded-[1px]"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-mona text-sm font-bold text-black truncate pr-4">
                                {item.book.title}
                              </h4>
                              <button 
                                onClick={() => onRemove(item.book.id)}
                                className="text-black/20 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3 border border-black/10 rounded-full px-2 py-0.5 bg-white/30">
                                <button onClick={() => onUpdateQuantity(item.book.id, -1)} className="p-1 cursor-pointer"><Minus size={10} /></button>
                                <span className="w-4 text-center font-poppins text-[10px] font-bold">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.book.id, 1)} className="p-1 cursor-pointer"><Plus size={10} /></button>
                              </div>
                              <div className="font-poppins text-xs font-bold text-black">
                                ₦{(item.book.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Desktop Total Summary */}
                  <div className="mt-10 pt-6 border-t border-black/5 hidden md:flex justify-between items-center">
                      <span className="font-poppins text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Grand Total</span>
                      <span className="font-poppins text-xl font-bold text-black">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* ── RIGHT SECTION: Form ── */}
                <div className="w-full md:w-[55%] p-8 md:p-14 bg-white/40">
                  <div className="mb-10">
                    <h2 className="font-mona text-2xl font-black text-black leading-tight uppercase tracking-tight mb-2">
                      Finalize Order
                    </h2>
                    <p className="font-poppins text-[10px] tracking-[0.2em] text-black/40 uppercase font-bold">Priority Shipping in 48 Hours</p>
                  </div>

                  <form className="space-y-8 md:space-y-10">
                    <div className="space-y-2">
                      <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">FullName</label>
                      <input 
                        required
                        type="text"
                        placeholder="Emeka Johnson"
                        value={formData.name}
                        onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      <div className="space-y-2">
                        <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Contact Email</label>
                        <input 
                          required
                          type="email"
                          placeholder="client@gmail.com"
                          value={formData.email}
                          onChange={(e) => onFormDataChange({...formData, email: e.target.value})}
                          className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">WhatsApp Number</label>
                        <input 
                          required
                          type="tel"
                          placeholder="+234 801 234 5678"
                          value={formData.phone}
                          onChange={(e) => onFormDataChange({...formData, phone: e.target.value})}
                          className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Delivery Location</label>
                      <textarea 
                        required
                        rows={2}
                        placeholder="Full Street, Building, Landmark, State"
                        value={formData.address}
                        onChange={(e) => onFormDataChange({...formData, address: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:block pt-6">
                      <button
                        onClick={handleCompletePurchase}
                        disabled={!isFormValid || displayItems.length === 0}
                        className="w-full h-14 bg-black text-white font-poppins text-[10px] font-bold tracking-[0.5em] uppercase
                                   disabled:opacity-10 transition-all duration-500 cursor-pointer shadow-2xl shadow-black/10"
                      >
                        PURCHASE NOW — ₦{totalPrice.toLocaleString()}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* Success Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <CheckCircle2 size={80} strokeWidth={1} className="text-black mb-8" />
              </motion.div>
              <h2 className="font-mona text-4xl font-black text-black mb-4 uppercase tracking-tighter">SUCCESS!</h2>
              <p className="font-poppins text-sm text-black/50 max-w-xs mb-16">Your boutique order has been received. Expect arrival in 2 working days.</p>
              <button 
                onClick={onClose}
                className="font-poppins text-[10px] font-bold uppercase tracking-[0.4em] border-b border-black pb-1 cursor-pointer hover:opacity-50 transition-opacity"
              >
                Close Gallery
              </button>
            </div>
          )}

          {/* 3. FIXED MOBILE ACTION BAR (Always visible at bottom) */}
          {!isSuccess && (
            <div className="md:hidden absolute bottom-0 left-0 w-full p-6 bg-white border-t border-black/5 z-[90] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
              <button
                onClick={handleCompletePurchase}
                disabled={!isFormValid || displayItems.length === 0}
                className="w-full h-15 bg-black text-white font-poppins text-[10px] font-bold tracking-[0.4em] uppercase
                           disabled:opacity-20 transition-all cursor-pointer rounded-none active:scale-[0.98]"
              >
                PAY ₦{totalPrice.toLocaleString()} NOW
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
