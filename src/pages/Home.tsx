import { useState, useEffect } from 'react';
import MetaTags from '../components/shared/MetaTags';
import HeroSection from '../components/home/HeroSection';
import EntryPaths from '../components/home/EntryPaths';
import Philosophy from '../components/home/Philosophy';
import FeaturedCollection from '../components/home/FeaturedCollection';
import TrustSection from '../components/home/TrustSection';
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
        featuredProducts={featuredProducts} 
        onQuickView={onQuickView} 
        headline={settings?.hero_headline}
        tagline={settings?.hero_tagline}
      />
      
      {/* 02. Entry Points */}
      <EntryPaths />

      {/* 03. Philosophy */}
      <Philosophy manifesto={settings?.manifesto} />

      {/* 04. Featured Collection */}
      <FeaturedCollection featuredProducts={featuredProducts} onQuickView={onQuickView} />

      {/* 05. Trust Section */}
      <TrustSection />

      {/* 06. Newsletter is already at bottom of Footer.tsx */}
    </main>
  );
};

export default Home;
