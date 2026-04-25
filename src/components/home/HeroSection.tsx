import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_PHRASES = [
  { id: 1, text: "Created for daily living" },
  { id: 2, text: "Discover good things" },
  { id: 3, text: "Words for daily inspiration" }
];

interface HeroSectionProps {
  featuredProducts?: any[];
  onQuickView?: (product: any) => void;
  headline?: string;
  tagline?: string;
}

const HeroSection = ({ headline, tagline }: HeroSectionProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 5000); // 5 seconds per phrase
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      style={{ backgroundColor: '#f3f2ee' }}
      className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Static Background Image with Subtle Animation */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="/brand_intro.png"
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f3f2ee]/40" />
      </div>

      {/* Text Slider Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={HERO_PHRASES[current].id}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 md:space-y-10"
          >
            <h1 className="font-mona text-[10px] md:text-[12px] font-black tracking-[0.5em] uppercase text-black/30">
               Good Things Co.
            </h1>
            
            <h2 className="font-serif text-5xl sm:text-7xl md:text-[10vw] font-medium text-black leading-[1] tracking-tighter italic">
              {headline && current === 0 ? headline : HERO_PHRASES[current].text}
            </h2>

            {tagline && (
              <p className="font-poppins text-sm md:text-base text-black/40 max-w-lg mx-auto">
                {tagline}
              </p>
            )}

            <div className="pt-10 md:pt-16">
               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="inline-flex flex-col items-center gap-4 text-black/20"
               >
                  <span className="font-mona text-[9px] font-black tracking-widest uppercase">Explore</span>
                  <div className="w-[1px] h-12 bg-black/10" />
               </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Dots (Subtle) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {HERO_PHRASES.map((word, i) => (
          <button
            key={word.id}
            onClick={() => setCurrent(i)}
            className={`h-[1px] transition-all duration-700 ${i === current ? 'w-12 bg-black' : 'w-4 bg-black/10'}`}
          />
        ))}
      </div>

      {/* Decorative Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
         <span className="font-serif text-[45vw] text-black italic">Good</span>
      </div>
    </section>
  );
};

export default HeroSection;