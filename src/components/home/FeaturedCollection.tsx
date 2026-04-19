import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { products } from '../../data/books';
import ProductAction from '../shared/ProductAction';

interface FeaturedCollectionProps {
  onQuickView: (product: Product) => void;
}

const FeaturedCollection = ({ onQuickView }: FeaturedCollectionProps) => {
  return (
    <section className="py-24 bg-[#f3f2ee]">
      <div className="max-w-[1000px] mx-auto px-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <p className="font-poppins text-[9px] font-bold tracking-[0.4em] uppercase text-black/30 mb-2">
            The Current Series
          </p>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full h-[1px] bg-black/5 top-1/2 -translate-y-1/2" />
            <h2 className="font-mona text-2xl md:text-3xl font-black text-black relative bg-[#f3f2ee] px-10 uppercase tracking-tighter">
              Featured Items
            </h2>
          </div>
        </div>

        {/* Products Grid - Centered 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-24">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              
              {/* Image Frame/Container */}
              <div 
                onClick={() => onQuickView(product)}
                className="aspect-[4/5] bg-white/40 flex items-center justify-center p-8 mb-6 relative overflow-hidden transition-all duration-500 hover:shadow-xl border border-black/[0.03]"
              >
                
                {/* Product Image */}
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
                />

                <div 
                   className="absolute bottom-10 left-0 w-full px-6
                              opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-500 ease-out z-10"
                   onClick={(e) => {
                     e.stopPropagation();
                     onQuickView(product);
                   }}
                >
                  <button className="w-full py-4 bg-black text-white font-mona text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-neutral-800 transition-all shadow-xl">
                    View Selection
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 
                  onClick={() => onQuickView(product)}
                  className="font-mona text-xs font-bold text-black mb-1 hover:text-black/60 transition-colors duration-300 cursor-pointer uppercase tracking-tight"
                >
                  {product.name}
                </h3>
                <p className="font-poppins text-[9px] tracking-[0.1em] text-black/40 uppercase mb-3">
                  {product.author}
                </p>
                <p className="font-poppins text-xs font-black text-black/80">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
