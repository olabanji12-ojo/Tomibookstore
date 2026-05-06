import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../../firebase/helpers';
import type { Product } from '../../types';
import { ArrowRight } from 'lucide-react';

const ShopTrioPreview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await getProducts();
      if (res.success && res.products) {
        // Just take 3 featured or top products
        const featured = res.products.filter(p => p.featured).slice(0, 3);
        if (featured.length === 3) {
          setProducts(featured);
        } else {
          setProducts(res.products.slice(0, 3));
        }
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex gap-8 mt-12 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 space-y-4">
          <div className="aspect-[4/5] bg-black/5 rounded-2xl" />
          <div className="h-4 bg-black/5 w-1/2 rounded" />
          <div className="h-10 bg-black/5 w-full rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full mt-12 md:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden mb-8 border border-black/[0.03] shadow-sm group-hover:shadow-xl transition-all duration-700">
              <img 
                src={product.image || product.images?.[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-2xl text-black">{product.name}</h4>
              <p className="font-poppins text-xs text-black/40 leading-relaxed line-clamp-2">
                {product.description}
              </p>
              <p className="font-mona text-sm font-black text-black">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <Link 
          to="/shop"
          className="bg-black text-white px-16 py-5 font-mona text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center gap-3 group"
        >
          Shop All
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ShopTrioPreview;
