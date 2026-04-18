import HeroSection from '../components/home/HeroSection';
import EntryPaths from '../components/home/EntryPaths';
import Philosophy from '../components/home/Philosophy';
import FeaturedCollection from '../components/home/FeaturedCollection';
import TrustSection from '../components/home/TrustSection';
import type { Book } from '../types';

interface HomeProps {
  onAddToCart: (product: Book) => void;
  onQuickView: (product: Book) => void;
}

const Home = ({ onAddToCart, onQuickView }: HomeProps) => {
  return (
    <main className="overflow-x-hidden">
      {/* 01. Hero */}
      <HeroSection onQuickView={onQuickView} />
      
      {/* 02. Entry Points */}
      <EntryPaths />

      {/* 03. Philosophy */}
      <Philosophy />

      {/* 04. Featured Collection */}
      <FeaturedCollection 
        onAddToCart={onAddToCart} 
        onQuickView={onQuickView} 
      />

      {/* 05. Trust Section */}
      <TrustSection />

      {/* 06. Newsletter is already at bottom of Footer.tsx */}
    </main>
  );
};

export default Home;
