import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../../firebase/helpers';
import type { Product } from '../../types';

const BundleShowcase = () => {
  const [bundles, setBundles] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      const res = await getProducts();
      if (res.success) {
        // Filter products that have 'Bundles' (case insensitive) in their category
        const bundleProducts = res.products.filter(p => 
          p.category?.toLowerCase() === 'bundles' || 
          p.category?.toLowerCase() === 'bundle'
        );
        setBundles(bundleProducts);
      }
      setLoading(false);
    };
    fetchBundles();
  }, []);

  if (loading || bundles.length === 0) return null;

  return (
    <section className="py-32 bg-[#f9f8f6]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4">Elevated Pairings</p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-black italic">The Curated Kits</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {bundles.map((bundle, idx) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link to={`/shop?category=bundles&id=${bundle.id}`}>
                <div className="aspect-[4/5] bg-white rounded-[2rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={bundle.image || bundle.images?.[0]} 
                    alt={bundle.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-serif text-2xl text-black mb-2 group-hover:italic transition-all">{bundle.name}</h3>
                <p className="font-poppins text-xs text-black/40 leading-relaxed mb-4 line-clamp-2">{bundle.description}</p>
                <p className="font-mona text-sm font-black text-black">₦{bundle.price.toLocaleString()}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundleShowcase;
