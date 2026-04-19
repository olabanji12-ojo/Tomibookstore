import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Product } from '../../types';
import { products as HERO_PRODUCTS } from '../../data/books';

const INTRO_SLIDE = {
  id: 'intro',
  name: 'Thoughtful goods for inspired living',
  description: 'Designed to help you live with purpose, give with meaning and enjoy everyday moments.',
  image: '/brand_intro.png',
  price: 0,
  isIntro: true
};

const ALL_SLIDES = [INTRO_SLIDE, ...HERO_PRODUCTS];

// ─── Animation Variants ────────────────────────────────────────────────────────

const textVariants = {
  enter:  { y: 24, opacity: 0 },
  center: { y: 0,  opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit:   { y: -16, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const imageVariants = {
  enter:  { scale: 0.88, opacity: 0 },
  center: { scale: 1,    opacity: 1, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit:   { scale: 1.05, opacity: 0, transition: { duration: 0.3,  ease: 'easeIn' as const } },
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  onQuickView: (product: Product) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const HeroSection = ({ onQuickView }: HeroSectionProps) => {
  const [current, setCurrent]       = useState(0);
  const [autoPlay, setAutoPlay]     = useState(true);

  const slide = ALL_SLIDES[current];

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % ALL_SLIDES.length),
    []
  );

  // ── Auto-play: Dynamic interval ─────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return;
    const duration = current === 0 ? 5000 : 4000;
    const id = setInterval(next, duration);
    return () => clearInterval(id);
  }, [autoPlay, next, current]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDot  = (i: number) => { setCurrent(i); setAutoPlay(false); };

  return (
    <section
      id="home"
      style={{ backgroundColor: '#f3f2ee' }}
      className="relative w-full min-h-[calc(100vh-129px)] flex items-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {(slide as any).isIntro ? (
          // ─── Intro Slide Layout (Full Background) ─────────────────
          <motion.div
            key="intro-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" /> {/* Very light overlay for contrast */}
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex items-center pt-24 md:pt-0">
              <div className="w-full max-w-[1400px] mx-auto px-12 md:px-20 text-center md:text-left">
                <div className="max-w-2xl">
                  <motion.div
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <p
                      className="text-[9px] tracking-[0.4em] uppercase text-black/40 mb-8"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Good Things Come to Those Who Seek
                    </p>

                    <h1
                      className="text-4xl md:text-6xl lg:text-7xl font-black text-black
                                 leading-[0.95] tracking-[-0.04em] mb-8 font-mona uppercase"
                    >
                      {slide.name}
                    </h1>

                    <p
                      className="text-[12px] md:text-[14px] text-black/70 leading-[1.8] max-w-lg mx-auto md:mx-0 mb-12"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                    >
                      {slide.description}
                    </p>

                    <button 
                      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                      className="flex items-center justify-center gap-4 bg-black text-white px-10 py-5 md:px-14 md:py-6 rounded-full font-mona text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl group cursor-pointer mx-auto md:mx-0"
                    >
                      Discover Good things
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </button>
                    
                    {/* Dots for Intro */}
                    <div className="flex items-center gap-3 mt-16 md:mt-24 justify-center md:justify-start">
                      {ALL_SLIDES.map((_, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleDot(i)}
                          className={`rounded-full transition-all duration-400 cursor-pointer ${
                            i === current
                              ? 'w-8 h-[2px] bg-black'
                              : 'w-4 h-[2px] bg-black/20 hover:bg-black/40'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // ─── Product Slide Layout (Split Grid) ─────────────────────
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[1400px] mx-auto px-12 md:px-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-16 md:py-0 min-h-[calc(100vh-129px)]">
              <div className="order-1 md:order-2 flex justify-center items-center">
                <motion.div
                  key={slide.id + '-cover'}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative"
                >
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[65%] h-10 blur-3xl opacity-20 rounded-full bg-black/10" />
                  <div
                    className="relative w-[220px] md:w-[280px] lg:w-[320px] aspect-[2/3] rounded-[1px]"
                    style={{
                      boxShadow: '10px 18px 55px rgba(0,0,0,0.12), 3px 6px 16px rgba(0,0,0,0.06), -1px 0 0 rgba(0,0,0,0.03)',
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover rounded-[1px]"
                    />
                  </div>
                </motion.div>
              </div>

              <div className="order-2 md:order-1 text-center md:text-left">
                <motion.div
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <p
                    className="text-[9px] tracking-[0.4em] uppercase text-black/25 mb-8"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Stories that stay with you
                  </p>

                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-black
                               leading-[1.05] tracking-[-0.03em] mb-6 font-mona uppercase"
                  >
                    {slide.name}
                  </h1>

                  <p
                    className="text-[13px] text-black/50 leading-[1.8] max-w-sm mx-auto md:mx-0 mb-10"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
                  >
                    {slide.description}
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
                    <p
                      className="text-[14px] font-black text-black/80"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      ₦{slide.price.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => onQuickView(slide as Product)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-4 bg-black text-white px-12 py-5 rounded-full font-mona text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 group cursor-pointer"
                    >
                      Experience Selection
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </button>
                  </div>

                  {/* Dots for Products */}
                  <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                    {ALL_SLIDES.map((_, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleDot(i)}
                        className={`rounded-full transition-all duration-400 cursor-pointer ${
                          i === current
                            ? 'w-8 h-[2px] bg-black'
                            : 'w-4 h-[2px] bg-black/10 hover:bg-black/30'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
