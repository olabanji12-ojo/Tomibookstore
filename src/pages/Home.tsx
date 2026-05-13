import { useState, useEffect } from 'react';
import MetaTags from '../components/shared/MetaTags';
import HeroSection from '../components/home/HeroSection';
import CategoryBar from '../components/home/CategoryBar';
import BrandPillars from '../components/home/BrandPillars';
import ProductTrioSection from '../components/home/ProductTrioSection';
import VisionSection from '../components/home/VisionSection';
import TrustSection from '../components/home/TrustSection';
import { getProducts } from '../firebase/helpers';
import type { Product } from '../types';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

const Home = ({ onQuickView }: HomeProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      await getProducts();
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
    <main className="overflow-x-hidden bg-white">
      <MetaTags
        title="Inspired Living"
        description="Thoughtful goods for inspired living. Designed to help you live with purpose and enjoy everyday moments."
      />

      {/* 01. Hero */}
      <HeroSection />

      {/* 02. Category Navigation Strip */}
      <CategoryBar />

      {/* 03. Brand Pillars - SHOP, CREATE, READ */}
      <BrandPillars />

      {/* 04. Featured Selection */}
      <ProductTrioSection
        title="Featured Selection"
        ctaText="Shop All"
        ctaLink="/shop"
        bgColor="#f7f6f2"
        cardBorderColor="#ffffff"
        filterFn={(products: Product[]) => products.filter(p => p.featured)}
        onQuickView={onQuickView}
      />

      {/* 05. Best Sellers */}
      <ProductTrioSection
        title="Best Sellers"
        ctaText="Shop Best Sellers"
        ctaLink="/shop?filter=bestSeller"
        bgColor="#ffffff"
        fallbackStartIndex={3}
        filterFn={(products: Product[]) => products.filter(p => p.bestSeller === true)}
        onQuickView={onQuickView}
      />

      {/* 06. Curated Kits */}
      <ProductTrioSection
        title="Curated Kits"
        ctaText="Explore Kits"
        ctaLink="/shop?category=GIFTING"
        bgColor="#faf9f6"
        cardBorderColor="#ffffff"
        fallbackStartIndex={6}
        filterFn={(products: Product[]) => products.filter(p => p.category?.toUpperCase() === 'GIFTING')}
        onQuickView={onQuickView}
      />

      {/* 07. Our Vision */}
      <VisionSection />

      {/* 08. Trust Section */}
      <TrustSection />
    </main>
  );
};

export default Home;
