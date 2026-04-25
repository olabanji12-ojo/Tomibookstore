import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Product } from '../../types';

const INTRO_SLIDE = {
  id: 'intro',
  name: 'Live inspired. Choose good things.',
  description: 'Thoughtful products. Custom pieces. Creative direction.',
  image: '/brand_intro.png',
  price: 0,
  isIntro: true
};

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

const containerVariants = {
  center: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  enter: { opacity: 0, y: 12 },
  center: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  featuredProducts: Product[];
  onQuickView: (product: Product) => void;
  headline?: string;
  tagline?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const HeroSection = ({ featuredProducts, onQuickView, headline, tagline }: HeroSectionProps) => {
  const [current, setCurrent]       = useState(0);
  const [autoPlay, setAutoPlay]     = useState(true);

  const ALL_SLIDES = [
    { ...INTRO_SLIDE, name: headline || INTRO_SLIDE.name, description: tagline || INTRO_SLIDE.description },
    ...featuredProducts
  ];
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
      className="relative w-full min-h-[100dvh] md:min-h-screen flex items-center overflow-hidden"
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
            {/* Background Image Layer */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={slide.image || '/brand_intro.png'}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Very subtle vignette to ensure text contrast while keeping image clear */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent md:from-black/10" />
            </div>

            {/* Content Overlay Layer */}
            <div className="relative z-10 w-full h-full flex items-center">
              <div className="w-full max-w-[1400px] mx-auto px-10 md:px-20 text-center pb-20 md:pb-0">
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    variants={containerVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <motion.p
                      variants={letterVariants}
                      className="text-[9px] md:text-[11px] tracking-[0.4em] uppercase text-black/50 mb-8 md:mb-10 font-sans font-bold"
                    >
                      Est. 2026 — Curated Sanctuary
                    </motion.p>

                    <motion.h1
                      className="text-4xl md:text-6xl lg:text-[80px] font-medium text-black
                                 leading-[1.1] tracking-[-0.02em] mb-10 md:mb-12 font-display flex flex-wrap justify-center italic"
                    >
                      {slide.name.split(' ').map((word, wIdx) => (
                        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.3em]">
                          {word.split('').map((char, cIdx) => (
                            <motion.span
                              key={cIdx}
                              variants={letterVariants}
                              className="inline-block"
                            >
                              {char}
                            </motion.span>
                          ))}
                        </span>
                      ))}
                    </motion.h1>

                    <motion.p
                      variants={letterVariants}
                      className="text-[14px] md:text-[16px] text-black/40 leading-relaxed max-w-md mx-auto mb-14 md:mb-16 font-sans font-medium italic"
                    >
                      {slide.description}
                    </motion.p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                      <motion.button 
                        variants={letterVariants}
                        onClick={() => window.location.href = '/shop'}
                        className="flex items-center justify-center bg-black text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all group cursor-pointer shadow-xl"
                      >
                        Shop Ready
                      </motion.button>
                      <motion.button 
                        variants={letterVariants}
                        onClick={() => window.location.href = '/personalize'}
                        className="flex items-center justify-center bg-white text-black border border-black/10 px-8 py-4 md:px-10 md:py-5 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all group cursor-pointer shadow-xl"
                      >
                        Create Something
                      </motion.button>
                      <motion.button 
                        variants={letterVariants}
                        onClick={() => window.location.href = '/contact'}
                        className="flex items-center justify-center bg-[#ede9e1] text-black/60 border border-black/5 px-8 py-4 md:px-10 md:py-5 rounded-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] hover:text-black transition-all group cursor-pointer shadow-sm"
                      >
                        Get Direction
                      </motion.button>
                    </div>
                    
                    {/* Dots for Intro */}
                    <div className="flex items-center gap-3 mt-16 md:mt-24 justify-center">
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
            className="w-full max-w-[1400px] mx-auto px-10 md:px-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-24 md:py-0 min-h-screen">
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
                    className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-8 font-sans font-bold"
                  >
                    Stories that stay with you
                  </p>

                  <h1
                    className="text-5xl md:text-6xl lg:text-8xl font-black text-black
                               leading-[1] tracking-[-0.04em] mb-8 font-display uppercase"
                  >
                    {slide.name}
                  </h1>

                  <p
                    className="text-[14px] text-black/50 leading-[1.8] max-w-sm mx-auto md:mx-0 mb-12 font-sans"
                  >
                    {slide.description}
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 mb-16">
                    <p
                      className="text-[16px] font-black text-black/80 font-sans"
                    >
                      ₦{slide.price.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => onQuickView(slide as Product)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-6 border border-black/15 text-black px-14 py-5 rounded-full font-sans text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all shadow-xl shadow-black/10 group cursor-pointer"
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
