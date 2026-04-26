import type { Product } from '../../types';

interface FeaturedCollectionProps {
  featuredProducts: Product[];
  onQuickView: (product: Product) => void;
}

const FeaturedCollection = ({ featuredProducts, onQuickView }: FeaturedCollectionProps) => {
  const mainProduct = featuredProducts[0];

  if (!mainProduct) return null;

  const displayImages = [
    mainProduct.image,
    mainProduct.images?.[1] || mainProduct.image,
    mainProduct.images?.[2] || mainProduct.image
  ];

  return (
    <div className="w-full">
      {/* Bento Grid Layout - Responsive 7:5 Split for ALL devices */}
      <div className="grid grid-cols-12 gap-3 md:gap-6 items-stretch">
        
        {/* Left: Large Vertical Feature (Spans 7/12 cols) */}
        <div 
          onClick={() => onQuickView(mainProduct)}
          className="col-span-12 md:col-span-7 relative group cursor-pointer"
        >
          <div className="aspect-[3/4] md:h-full bg-white/40 rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-sm transition-all duration-700">
             <img 
               src={displayImages[0]} 
               alt={mainProduct.name}
               className="w-full h-full object-cover"
             />
             
             {/* Mobile-Friendly Label */}
             <div className="absolute inset-x-0 bottom-6 md:bottom-10 px-4 md:px-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/80 backdrop-blur-md py-3 md:py-4 rounded-xl md:rounded-2xl text-center font-mona text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                   View Archives
                </div>
             </div>
          </div>
        </div>

        {/* Right: Stacked Features (Spans 5/12 cols) */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-3 md:gap-6">
          
          {/* Top Right Square */}
          <div 
            onClick={() => onQuickView(mainProduct)}
            className="aspect-square relative group cursor-pointer"
          >
            <div className="h-full bg-white/40 rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-sm transition-all duration-700">
               <img 
                 src={displayImages[1]} 
                 alt=""
                 className="w-full h-full object-cover"
               />
            </div>
          </div>

          {/* Bottom Right Square */}
          <div 
            onClick={() => onQuickView(mainProduct)}
            className="aspect-square relative group cursor-pointer"
          >
            <div className="h-full bg-white/40 rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-sm transition-all duration-700">
               <img 
                 src={displayImages[2]} 
                 alt=""
                 className="w-full h-full object-cover"
               />
               
               {/* Premium Badge Overlay (Visible on all devices) */}
               <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10">
                  <div className="bg-black/10 backdrop-blur-md border border-white/20 px-3 md:px-6 py-1.5 md:py-2 rounded-full">
                     <span className="font-mona text-[7px] md:text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                        {mainProduct.category || 'Featured'}
                     </span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;