import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetaTags from '../components/shared/MetaTags';
import HeroSection from '../components/home/HeroSection';
import CategoryBar from '../components/home/CategoryBar';
import BrandPillars from '../components/home/BrandPillars';
import FeaturedCollection from '../components/home/FeaturedCollection';
import BestSellers from '../components/home/BestSellers';
import TrustSection from '../components/home/TrustSection';
import { getProducts } from '../firebase/helpers';
import type { Product } from '../types';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

const Home = ({ onQuickView }: HomeProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCollection, setShowCollection] = useState(false);

  const [showBestSellers, setShowBestSellers] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [prodRes] = await Promise.all([
        getProducts()
      ]);
      
      if (prodRes.success && prodRes.products.length > 0) {
        const featured = prodRes.products.filter(p => p.featured);
        setFeaturedProducts(featured.length > 0 ? featured : [prodRes.products[0]]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ee] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s]" />
          <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-x-hidden">
      <MetaTags 
        title="Home" 
        description="Thoughtful goods for inspired living. Designed to help you live with purpose and enjoy everyday moments."
      />
      {/* 01. Hero */}
      <HeroSection />

      {/* 02. Category Navigation Strip */}
      <CategoryBar />
      
      {/* 03. Brand Pillars - SHOP, CREATE, READ, DESIGN */}
      <BrandPillars />

      {/* 04. Featured Selection Trigger */}
      <section className="bg-[#ede9e1] py-32 px-10 text-center relative border-b border-black/[0.03]">
        <div className="max-w-[1200px] mx-auto">
          <button 
            onClick={() => setShowCollection(!showCollection)}
            className="group flex flex-col items-center gap-8 mx-auto"
          >
            <div className="space-y-4">
              <p className="font-poppins text-[9px] font-bold tracking-[0.4em] uppercase text-black/30">
                The Current Series
              </p>
              <div className="flex items-center gap-6">
                <div className={`h-[1px] bg-black/10 transition-all duration-700 ${showCollection ? 'w-24' : 'w-12 group-hover:w-24'}`} />
                <h2 className="font-serif text-3xl md:text-5xl font-medium text-black italic tracking-tight">
                  {showCollection ? 'Close Selection' : 'Featured Selection'}
                </h2>
                <div className={`h-[1px] bg-black/10 transition-all duration-700 ${showCollection ? 'w-24' : 'w-12 group-hover:w-24'}`} />
              </div>
            </div>

            <div className="flex items-center gap-3 font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/40 group-hover:text-black transition-all animate-pulse">
              {showCollection ? 'Click to minimize' : 'Click to discover'}
            </div>
          </button>

          <AnimatePresence>
            {showCollection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden mt-16"
              >
                <FeaturedCollection featuredProducts={featuredProducts} onQuickView={onQuickView} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 05. Best Sellers Trigger */}
      <section className="bg-white py-32 px-10 text-center relative">
        <div className="max-w-[1200px] mx-auto">
          <button 
            onClick={() => setShowBestSellers(!showBestSellers)}
            className="group flex flex-col items-center gap-8 mx-auto"
          >
            <div className="space-y-4">
              <p className="font-poppins text-[9px] font-bold tracking-[0.4em] uppercase text-black/30">
                Community Favorites
              </p>
              <div className="flex items-center gap-6">
                <div className={`h-[1px] bg-black/10 transition-all duration-700 ${showBestSellers ? 'w-24' : 'w-12 group-hover:w-24'}`} />
                <h2 className="font-serif text-3xl md:text-5xl font-medium text-black italic tracking-tight">
                  {showBestSellers ? 'Close Favorites' : 'Best Sellers'}
                </h2>
                <div className={`h-[1px] bg-black/10 transition-all duration-700 ${showBestSellers ? 'w-24' : 'w-12 group-hover:w-24'}`} />
              </div>
            </div>

            <div className="flex items-center gap-3 font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/40 group-hover:text-black transition-all animate-pulse">
              {showBestSellers ? 'Click to minimize' : 'Click to discover'}
            </div>
          </button>

          <AnimatePresence>
            {showBestSellers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden mt-16"
              >
                <BestSellers onQuickView={onQuickView} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 06. Trust Section */}
      <TrustSection />
    </main>
  );
};

export default Home;
