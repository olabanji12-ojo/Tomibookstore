import { motion } from 'framer-motion';
import type { Product } from '../../types';

interface FeaturedCollectionProps {
  featuredProducts: Product[];
  onQuickView: (product: Product) => void;
}

const FeaturedCollection = ({ featuredProducts, onQuickView }: FeaturedCollectionProps) => {
  // We'll focus on the first featured product to create the Bento Masterpiece
  const mainProduct = featuredProducts[0];

  if (!mainProduct) return null;

  // Ensure we have 3 images to work with, or fall back to placeholders
  const displayImages = [
    mainProduct.image,
    mainProduct.images?.[1] || mainProduct.image,
    mainProduct.images?.[2] || mainProduct.image
  ];

  return (
    <section className="py-20 md:py-32 bg-[#ede9e1]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-stretch">
          
          {/* Left: Large Vertical Feature (Spans 7/12 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => onQuickView(mainProduct)}
            className="md:col-span-7 relative group cursor-pointer"
          >
            <div className="aspect-[3/4] md:aspect-auto md:h-full bg-white/40 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-sm group-hover:shadow-2xl transition-all duration-700">
               <motion.img 
                 src={displayImages[0]} 
                 alt={mainProduct.name}
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-x-0 bottom-10 px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/80 backdrop-blur-md py-4 rounded-2xl text-center font-mona text-[10px] font-black uppercase tracking-[0.3em]">
                     View Archives
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Right: Stacked Square Features (Spans 5/12 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            
            {/* Top Right Square */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => onQuickView(mainProduct)}
              className="flex-1 relative group cursor-pointer"
            >
              <div className="aspect-square bg-white/40 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-sm group-hover:shadow-xl transition-all duration-700">
                 <motion.img 
                   src={displayImages[1]} 
                   alt=""
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 shadow-inner"
                 />
              </div>
            </motion.div>

            {/* Bottom Right Square (With Sample Badge Style) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={() => onQuickView(mainProduct)}
              className="flex-1 relative group cursor-pointer"
            >
              <div className="aspect-square bg-white/40 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-sm group-hover:shadow-xl transition-all duration-700">
                 <motion.img 
                   src={displayImages[2]} 
                   alt=""
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 />
                 
                 {/* Premium Sample Badge Overlay */}
                 <div className="absolute bottom-10 left-10">
                    <div className="bg-black/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full">
                       <span className="font-mona text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                          {mainProduct.category || 'Featured'}
                       </span>
                    </div>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Product Details - Master Centered Info */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="mt-16 text-center space-y-4"
        >
           <h3 className="font-serif text-4xl md:text-6xl font-medium italic text-black tracking-tight leading-none">
              {mainProduct.name}
           </h3>
           <p className="font-mona text-[11px] font-black tracking-[0.4em] uppercase text-black/40">
              {mainProduct.description.split('.')[0]}
           </p>
           <div className="pt-6">
              <span className="font-mona text-2xl font-black text-black">
                ₦{mainProduct.price.toLocaleString()}
              </span>
           </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedCollection;