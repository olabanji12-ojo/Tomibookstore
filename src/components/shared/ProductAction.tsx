import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

interface ProductActionProps {
  product: Product;
  variant?: 'large' | 'small';
}

export default function ProductAction({ product, variant = 'small' }: ProductActionProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const isSelected = quantity > 0;

  // Formatting based on variant (Hero vs Shop Card)
  const isLarge = variant === 'large';
  
  return (
    <div className={`relative ${isLarge ? 'w-full md:w-auto' : 'w-full'}`}>
      <AnimatePresence mode="wait">
        {!isSelected ? (
          <motion.button
            key="acquire"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className={`
              flex items-center justify-center gap-3 w-full bg-black text-white 
              font-mona font-black uppercase tracking-[0.3em] overflow-hidden group
              ${isLarge ? 'px-10 py-5 text-[9px]' : 'py-3 md:py-4 text-[8px] md:text-[10px] rounded-xl md:rounded-2xl'}
              hover:bg-neutral-800 transition-all shadow-xl shadow-black/10
            `}
          >
            <span className="relative z-10">{isLarge ? 'Experience Curation' : 'Acquire'}</span>
            <ArrowRight size={isLarge ? 12 : 14} className="group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        ) : (
          <motion.div
            key="stepper"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              flex items-center justify-between bg-white border border-black/10 shadow-lg p-1 overflow-hidden
              ${isLarge ? 'w-full md:w-[220px] rounded-full' : 'w-full rounded-xl md:rounded-2xl'}
            `}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, -1);
              }}
              className="p-3 hover:bg-black/5 rounded-full transition-colors group"
            >
              <Minus size={isLarge ? 14 : 12} className="text-black/40 group-hover:text-black" />
            </button>
            
            <div className="flex flex-col items-center">
                <span className="font-mona text-[10px] font-black text-black">
                  {quantity}
                </span>
                <span className="font-poppins text-[7px] text-black/20 font-bold uppercase tracking-widest">
                  In Bag
                </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, 1);
              }}
              className="p-3 hover:bg-black/5 rounded-full transition-colors group"
            >
              <Plus size={isLarge ? 14 : 12} className="text-black/40 group-hover:text-black" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
