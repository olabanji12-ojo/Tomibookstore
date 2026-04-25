import { motion } from 'framer-motion';
import type { Product } from '../../types';

interface FeaturedCollectionProps {
  featuredProducts: Product[];
  onQuickView: (product: Product) => void;
}

const FeaturedCollection = ({ featuredProducts, onQuickView }: FeaturedCollectionProps) => {
  return (
    <section className="py-24 bg-[#f3f2ee]">
      <div className="max-w-[1000px] mx-auto px-10">
        


        {/* Products Grid - Ultra-Compressed Editorial Asymmetrical Logic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-6 sm:gap-x-4 lg:gap-x-0 items-start">
          {featuredProducts.map((product, idx) => {
             // Editorial mapping for first 4 items (ultra-compressed offsets)
             const layouts = [
               { span: 'lg:col-span-7', start: 'lg:col-start-1', aspect: 'aspect-[4/5]', mt: 'lg:mt-0' },
               { span: 'lg:col-span-4', start: 'lg:col-start-9', aspect: 'aspect-[2/3]', mt: 'lg:mt-8' },
               { span: 'lg:col-span-5', start: 'lg:col-start-2', aspect: 'aspect-square', mt: 'lg:mt-[-15px]' },
               { span: 'lg:col-span-6', start: 'lg:col-start-7', aspect: 'aspect-[4/5]', mt: 'lg:mt-[-5px]' }
             ];
             const layout = layouts[idx % layouts.length];

             return (
               <div 
                 key={product.id} 
                 className={`group cursor-pointer ${layout.span} ${layout.start} ${layout.mt} relative z-10 transition-all duration-700 hover:z-20`}
               >
                 {/* Image Frame/Container */}
                 <div 
                   onClick={() => onQuickView(product)}
                   className={`${layout.aspect} bg-white/40 flex items-center justify-center p-4 sm:p-8 mb-8 relative overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-black/[0.02]`}
                 >
                   
                   {/* Product Image */}
                   <motion.img
                     src={product.image || 'https://via.placeholder.com/400x500?text=No+Image'}
                     alt={product.name}
                     className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                   />

                   <div 
                      className="absolute bottom-10 left-0 w-full px-8
                                 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                                 transition-all duration-500 ease-out z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                   >
                     <button className="w-full py-5 bg-black text-white font-sans text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-neutral-900 transition-all shadow-2xl">
                       View Archives
                     </button>
                   </div>
                 </div>

                 {/* Product Info - Minimal editorial labels */}
                 <div className="text-left px-2">
                   <div className="flex justify-between items-baseline mb-2">
                     <h3 
                       onClick={() => onQuickView(product)}
                       className="font-display text-xl md:text-2xl font-medium text-black hover:text-black/60 transition-colors duration-300 cursor-pointer italic"
                     >
                       {product.name}
                     </h3>
                     <p className="font-sans text-[12px] font-black text-black/80">
                       ₦{product.price.toLocaleString()}
                     </p>
                   </div>
                   <p className="font-sans text-[9px] tracking-[0.2em] text-black/20 uppercase font-bold">
                     {product.author || product.category}
                   </p>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;