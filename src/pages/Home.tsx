import HeroSection from '../components/home/HeroSection';
import PartnerLogos from '../components/home/PartnerLogos';
import FeaturedBooks from '../components/home/FeaturedBooks';
import type { Book } from '../types';

interface HomeProps {
  onAddToCart: (book: Book) => void;
}

const Home = ({ onAddToCart }: HomeProps) => {
  return (
    <main>
      <HeroSection onBookSelect={onAddToCart} />
      <PartnerLogos />
      <FeaturedBooks onBookSelect={onAddToCart} />
    </main>
  );
};

export default Home;
