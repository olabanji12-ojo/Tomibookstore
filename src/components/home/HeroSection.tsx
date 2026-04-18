import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import type { Product } from '../../types';
import { products as HERO_SLIDES } from '../../data/books';

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

  const slide = HERO_SLIDES[current];

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % HERO_SLIDES.length),
    []
  );

  // ── Auto-play: 4 s interval ─────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [autoPlay, next]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDot  = (i: number) => { setCurrent(i); setAutoPlay(false); };

  return (
    <section
      id="home"
      style={{ backgroundColor: '#f3f2ee' }}
      className="relative w-full min-h-[calc(100vh-129px)] flex items-center overflow-hidden"
    >
      <div className="w-full max-w-[1400px] mx-auto px-12 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-16 md:py-0 min-h-[calc(100vh-129px)]">

          <div className="order-1 md:order-2 flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-cover'}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative"
              >
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[65%] h-10 blur-3xl opacity-20 rounded-full bg-black/10"
                />

                <div
                  className="relative w-[220px] md:w-[280px] lg:w-[320px] aspect-[2/3] rounded-[1px]"
                  style={{
                    boxShadow:
                      '10px 18px 55px rgba(0,0,0,0.12), 3px 6px 16px rgba(0,0,0,0.06), -1px 0 0 rgba(0,0,0,0.03)',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className="w-full h-full object-cover rounded-[1px]"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-2 md:order-1 text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
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
                    onClick={() => onQuickView(slide)}
                    className="inline-flex items-center gap-4
                               bg-black text-white
                               text-[9px] font-black tracking-[0.3em] uppercase
                               px-10 py-5 cursor-pointer
                               hover:bg-neutral-800
                               transition-all duration-300 ease-in-out group
                               mx-auto md:mx-0"
                  >
                    Experience Curation
                    <ArrowRight
                      size={12}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                  {HERO_SLIDES.map((_, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleDot(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-400 cursor-pointer ${
                        i === current
                          ? 'w-8 h-[2px] bg-black'
                          : 'w-4 h-[2px] bg-black/10 hover:bg-black/30'
                      }`}
                    />
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
