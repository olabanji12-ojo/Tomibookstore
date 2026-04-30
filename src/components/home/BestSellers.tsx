import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../../firebase/helpers';
import type { Product } from '../../types';

interface BestSellersProps {
  onQuickView: (product: Product) => void;
}

const BestSellers = ({ onQuickView }: BestSellersProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      const res = await getProducts();
      if (res.success && res.products) {
        // Look for bestSeller flag, or just take top 4
        const bestSellers = res.products.filter(p => (p as any).bestSeller).slice(0, 4);
        if (bestSellers.length > 0) {
          setProducts(bestSellers);
        } else {
          setProducts(res.products.slice(0, 4));
        }
      }
      setLoading(false);
    };
    fetchBestSellers();
  }, []);

  if (loading || products.length < 3) return null;

  const [main, second, third] = products;

  return (
    <div className="w-full">
      {/* Bento Grid: One large, two small stacked */}
      <div className="grid grid-cols-12 gap-3 md:gap-6 aspect-[4/5] sm:aspect-[4/3] w-full">
        
        {/* Left Master Tile (Product 1) */}
        <div 
          onClick={() => onQuickView(main)}
          className="col-span-7 h-full relative group cursor-pointer"
        >
          <div className="w-full h-full bg-[#f7f6f2] rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] transition-all duration-700">
             <img 
               src={main.image} 
               alt={main.name}
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
             />
             
             {/* Info Overlay */}
             <div className="absolute inset-x-0 bottom-0 p-4 md:p-10 bg-gradient-to-t from-black/20 to-transparent">
                <h5 className="font-serif text-xl md:text-4xl font-medium text-white italic">{main.name}</h5>
                <p className="font-mona text-[8px] md:text-[10px] font-black text-white/80 uppercase tracking-widest mt-2">
                   {main.category} — ${main.price}
                </p>
             </div>
          </div>
        </div>

        {/* Right Column (Stacked Products 2 & 3) */}
        <div className="col-span-5 h-full flex flex-col gap-3 md:gap-6">
          
          {/* Top Right (Product 2) */}
          <div 
            onClick={() => onQuickView(second)}
            className="flex-1 min-h-0 relative group cursor-pointer"
          >
            <div className="w-full h-full bg-[#fdfdfd] rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] transition-all duration-700">
               <img 
                 src={second.image} 
                 alt={second.name}
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors" />
               <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                  <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full font-mona text-[7px] md:text-[9px] font-black uppercase tracking-widest text-black">
                     {second.name}
                  </span>
               </div>
            </div>
          </div>

          {/* Bottom Right (Product 3) */}
          <div 
            onClick={() => onQuickView(third)}
            className="flex-1 min-h-0 relative group cursor-pointer"
          >
            <div className="w-full h-full bg-[#f2f0ea] rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] transition-all duration-700">
               <img 
                 src={third.image} 
                 alt={third.name}
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors" />
               <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                  <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full font-mona text-[7px] md:text-[9px] font-black uppercase tracking-widest text-black">
                     {third.name}
                  </span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BestSellers;
