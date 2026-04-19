import HeroSection from '../components/home/HeroSection';
import EntryPaths from '../components/home/EntryPaths';
import Philosophy from '../components/home/Philosophy';
import FeaturedCollection from '../components/home/FeaturedCollection';
import TrustSection from '../components/home/TrustSection';
import type { Product } from '../types';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

const Home = ({ onQuickView }: HomeProps) => {
  return (
    <main className="overflow-x-hidden">
      {/* 01. Hero */}
      <HeroSection onQuickView={onQuickView} />
      
      {/* 02. Entry Points */}
      <EntryPaths />

      {/* 03. Philosophy */}
      <Philosophy />

      {/* 04. Featured Collection */}
      <FeaturedCollection onQuickView={onQuickView} />

      {/* 05. Trust Section */}
      <TrustSection />

      {/* 06. Newsletter is already at bottom of Footer.tsx */}
    </main>
  );
};

export default Home;
