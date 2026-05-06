import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../../firebase/helpers';
import type { Product } from '../../types';

interface ProductTrioSectionProps {
  label: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  filterFn: (products: Product[]) => Product[];
  onQuickView: (product: Product) => void;
  bgColor?: string;
  cardBorderColor?: string;
  fallbackStartIndex?: number;
}

const ProductTrioSection = ({
  label,
  title,
  ctaText,
  ctaLink,
  filterFn,
  onQuickView,
  bgColor = '#f7f6f2',
  cardBorderColor = '#f7f6f2',
  fallbackStartIndex = 0
}: ProductTrioSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await getProducts();
      if (res.success && res.products) {
        let filtered = filterFn(res.products).slice(0, 3);

        // If filter returns nothing OR we just want to ensure variety for design purposes
        if (filtered.length === 0) {
          filtered = res.products.slice(fallbackStartIndex, fallbackStartIndex + 3);
        }

        // Final Design Fallback: Force unique Unsplash images if products are missing or duplicated
        const placeholderImages = [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1594913785162-e678ac052429?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1616489953149-808605486801?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1515549832467-d65c6978469a?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1596462502278-27bfac44221d?auto=format&fit=crop&q=80&w=800'
        ];

        const designProducts = filtered.map((p, i) => ({
          ...p,
          // Use unique placeholder based on section index + product index
          image: p.image || placeholderImages[(fallbackStartIndex + i) % placeholderImages.length]
        }));

        setProducts(designProducts);
      }
      setLoading(false);
    };
    fetch();
  }, [fallbackStartIndex]);

  if (loading) {
    return (
      <section style={{ backgroundColor: bgColor }} className="py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="h-4 w-40 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-black/5 rounded mb-16 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/60 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-black/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-black/5 rounded w-3/4" />
                  <div className="h-4 bg-black/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section style={{ backgroundColor: bgColor }} className="py-24 md:py-32 px-6 md:px-16 border-b border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto">

        {/* Section Title */}
        <div className="mb-12 md:mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-medium text-black italic tracking-tight"
          >
            {title}
          </motion.h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => onQuickView(product)}
              className={`bg-white border-[12px] cursor-pointer group hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden`}
              style={{ borderColor: cardBorderColor }}
            >
              {/* Framed Product Image */}
              <div className="p-3 md:p-6 pb-0">
                <div className="aspect-[4/3] md:aspect-square overflow-hidden bg-[#f7f6f2]">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
              </div>

              {/* Product Title */}
              <div className="px-4 py-4 md:px-6 md:py-6 text-center">
                <h4 className="font-serif text-xl md:text-3xl font-black text-black leading-tight tracking-tighter mx-auto">
                  {product.name}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to={ctaLink}
            className="bg-black text-white px-14 py-5 font-mona text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {ctaText}
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductTrioSection;
