import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../../firebase/helpers';
import type { Product } from '../../types';

export const SHOP_CATEGORIES = [
  {
    id: 'fashion',
    title: 'FASHION',
    description: 'Versatile, minimal pieces for everyday wear',
    image: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800',
    slug: 'FASHION'
  },
  {
    id: 'gifting',
    title: 'GIFTING',
    description: 'Thoughtful finds for every moment',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
    slug: 'GIFTING'
  },
  {
    id: 'home',
    title: 'HOME',
    description: 'Pieces that make your space, yours',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=800',
    slug: 'HOME'
  },
  {
    id: 'office',
    title: 'OFFICE',
    description: 'Tools for your thoughts and plans',
    image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=800',
    slug: 'OFFICE'
  },
  {
    id: 'accessories',
    title: 'ACCESSORIES',
    description: 'The details that complete you',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    slug: 'BAGS & ACCESSORIES'
  }
];

const ExploreCategories = () => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const res = await getProducts();
      if (res.success && res.products) {
        const mapping: Record<string, string> = {};
        SHOP_CATEGORIES.forEach(cat => {
          const product = res.products.find((p: Product) => 
            p.category?.toUpperCase() === cat.slug.toUpperCase() && 
            (p.image || (p.images && p.images[0]))
          );
          if (product) {
            mapping[cat.id] = product.image || (product.images && product.images[0]);
          }
        });
        setCategoryImages(mapping);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="w-full mt-12 md:mt-24">
      <div className="mb-12 flex items-center justify-between">
        <h4 className="font-mona text-[10px] font-black tracking-[0.4em] uppercase text-black/30">Shop By Category</h4>
        <div className="h-px flex-1 bg-black/5 ml-8" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {SHOP_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <Link to={`/shop?category=${encodeURIComponent(cat.slug)}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-neutral-100 mb-6 flex items-center justify-center">
                <img 
                  src={categoryImages[cat.id] || cat.image} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'; 
                  }}
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                   <div className="border border-white/40 px-6 py-3 rounded-full backdrop-blur-md">
                      <span className="font-mona text-[9px] font-black uppercase tracking-[0.4em] text-white">
                        Explore
                      </span>
                   </div>
                </div>

                <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors" />
              </div>
              
              <div className="space-y-1">
                <h5 className="font-mona text-[11px] font-black uppercase tracking-widest text-black group-hover:opacity-60 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">
                  {cat.title}
                </h5>
                <p className="font-poppins text-[10px] text-black/40 leading-tight md:leading-relaxed max-w-[200px] line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreCategories;
