import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative w-full h-[50vh] md:h-[70vh] bg-[#f3f2ee] overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/gift_entry.png" 
          alt="Curated Gifts" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-3xl"
        >
          <h1 className="font-serif text-3xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8 drop-shadow-sm">
             Good for you, <br />
             <span className="italic">Made to inspire.</span>
          </h1>

          <Link 
            to="/shop"
            className="inline-block border border-white px-12 py-4 font-mona text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all duration-500"
          >
            Shop
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;