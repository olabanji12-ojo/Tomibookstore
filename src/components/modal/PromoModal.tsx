import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { claimPromo } from '../../firebase/helpers';
import toast from 'react-hot-toast';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoText: string;
}

const PromoModal = ({ isOpen, onClose, promoText }: PromoModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await claimPromo(email);
    if (res.success && res.code) {
      setClaimedCode(res.code);
      toast.success('Code claimed successfully!');
    } else {
      toast.error(res.error as string || 'Offer has ended or is unavailable.');
      onClose();
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#f3f2ee] rounded-[2.5rem] overflow-hidden shadow-2xl p-10 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-black/20 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {!claimedCode ? (
              <>
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Sparkles size={24} className="text-white" />
                </div>
                
                <h3 className="font-mona text-2xl font-black text-black uppercase tracking-tighter mb-4 leading-tight">
                  Exclusive Invitation
                </h3>
                
                <p className="font-poppins text-xs text-black/40 mb-8 leading-relaxed">
                  {promoText}. Enter your email to claim your unique artifact code.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="curator@example.com"
                    className="w-full bg-white border border-black/5 px-6 py-4 rounded-2xl font-poppins text-sm focus:border-black outline-none transition-all text-center"
                  />
                  <button
                    disabled={loading}
                    className="w-full py-5 bg-black text-white font-mona text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'Validating...' : (
                      <>
                        Claim My Code
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10"
              >
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="font-mona text-2xl font-black text-black uppercase tracking-tighter mb-4">You're In.</h3>
                <p className="font-poppins text-[10px] text-black/40 uppercase tracking-widest mb-10">Use this code at checkout</p>
                
                <div className="bg-white border-2 border-dashed border-black/10 py-6 px-10 rounded-2xl mb-8">
                  <span className="font-mona text-4xl font-black text-black tracking-widest">{claimedCode}</span>
                </div>

                <button
                  onClick={onClose}
                  className="font-mona text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors"
                >
                  Return to Boutique
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;
