import HeroSection from '../components/home/HeroSection';
import PartnerLogos from '../components/home/PartnerLogos';
import FeaturedBooks from '../components/home/FeaturedBooks';
import type { Book } from '../types';

interface HomeProps {
  onAddToCart: (book: Book) => void;
  onQuickView: (book: Book) => void;
}

const Home = ({ onAddToCart, onQuickView }: HomeProps) => {
  return (
    <main>
      <HeroSection onQuickView={onQuickView} />
      <PartnerLogos />
      <FeaturedBooks onAddToCart={onAddToCart} onQuickView={onQuickView} />
    </main>
  );
};

export default Home;
