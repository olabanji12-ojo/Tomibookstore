import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetaTags from '../components/shared/MetaTags';
import HeroSection from '../components/home/HeroSection';

import Philosophy from '../components/home/Philosophy';
import FeaturedCollection from '../components/home/FeaturedCollection';
import TrustSection from '../components/home/TrustSection';
import BrandPillars from '../components/home/BrandPillars';
import { getProducts, getSiteSettings } from '../firebase/helpers';
import type { Product } from '../types';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

const Home = ({ onQuickView }: HomeProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [prodRes, setRes] = await Promise.all([
        getProducts(),
        getSiteSettings()
      ]);
      
      if (prodRes.success) {
        const featured = prodRes.products.filter(p => p.featured);
        setFeaturedProducts(featured);
      }
      if (setRes.success) {
        setSettings(setRes.settings);
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
      <HeroSection 
        headline={settings?.hero_headline}
        tagline={settings?.hero_tagline}
      />
      
      {/* 02. Philosophy */}
      <Philosophy manifesto={settings?.manifesto} />

      {/* 03. Brand Pillars - SHOP, CREATE, READ, DESIGN */}
      <BrandPillars />

      {/* 04. Selection Trigger (Featured Selection) */}
      <section className="bg-[#ede9e1] py-32 px-10 text-center">
        <div className="max-w-[1000px] mx-auto">
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

      {/* 05. Trust Section */}
      <TrustSection />
    </main>
  );
};

export default Home;
