import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetch = async () => {
      const [prodRes, setRes] = await Promise.all([
        getProducts(),
        getSiteSettings()
      ]);
      
      if (prodRes.success && prodRes.products.length > 0) {
        const featured = prodRes.products.filter(p => p.featured);
        // Fallback: Use the first product if no features are set in DB
        setFeaturedProducts(featured.length > 0 ? featured : [prodRes.products[0]]);
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
        headline="Live inspired, every day."
        tagline={settings?.hero_tagline}
      />
      
      {/* 02. Philosophy */}
      <Philosophy manifesto={settings?.manifesto} />

      {/* 03. Brand Pillars - SHOP, CREATE, READ, DESIGN */}
      <BrandPillars />

      {/* 04. Featured Selection (Bento Gallery) */}
      <section className="bg-[#ede9e1] py-20 px-10 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 space-y-4">
             <p className="font-poppins text-[9px] font-bold tracking-[0.4em] uppercase text-black/30">
                The Current Series
             </p>
             <h2 className="font-serif text-3xl md:text-5xl font-medium text-black italic tracking-tight">
                Featured Selection
             </h2>
             <div className="flex justify-center pt-2">
                <div className="w-12 h-[1px] bg-black/10" />
             </div>
          </div>

          <FeaturedCollection featuredProducts={featuredProducts} onQuickView={onQuickView} />
        </div>
      </section>

      {/* 05. Trust Section */}
      <TrustSection />
    </main>
  );
};

export default Home;
