import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import type { Book } from '../../types';
import { books as HERO_SLIDES } from '../../data/books';

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
  onQuickView: (book: Book) => void;
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
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  // ── Auto-play: 5 s interval ─────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [autoPlay, next]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handlePrev = () => { prev(); setAutoPlay(false); };
  const handleNext = () => { next(); setAutoPlay(false); };
  const handleDot  = (i: number) => { setCurrent(i); setAutoPlay(false); };

  return (
    <section
      id="home"
      style={{ backgroundColor: '#f3f2ee' }}
      className="relative w-full min-h-[calc(100vh-129px)] flex items-center overflow-hidden"
    >
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 flex items-center justify-center cursor-pointer
                   text-black/20 hover:text-black/60 transition-colors duration-200"
      >
        <ChevronLeft size={24} strokeWidth={1.2} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 flex items-center justify-center cursor-pointer
                   text-black/20 hover:text-black/60 transition-colors duration-200"
      >
        <ChevronRight size={24} strokeWidth={1.2} />
      </button>

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
                  className="relative w-[190px] md:w-[240px] lg:w-[280px] aspect-[2/3] rounded-[2px]"
                  style={{
                    boxShadow:
                      '10px 18px 55px rgba(0,0,0,0.16), 3px 6px 16px rgba(0,0,0,0.08), -1px 0 0 rgba(0,0,0,0.05)',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-[2px]"
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
                  className="text-[9px] tracking-[0.4em] uppercase text-black/25 mb-7"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  0{current + 1}&nbsp;&nbsp;/&nbsp;&nbsp;0{HERO_SLIDES.length}
                </p>

                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black
                             leading-[1.08] tracking-[-0.02em] mb-5 font-poppins"
                >
                  {slide.title}
                </h1>

                <p
                  className="text-[10px] tracking-[0.22em] uppercase text-black/30 mb-6"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  by {slide.author}
                </p>

                <p
                  className="text-[13.5px] text-black/45 leading-[1.8] max-w-sm mx-auto md:mx-0 mb-7"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}
                >
                  {slide.description}
                </p>

                <p
                  className="text-[12px] tracking-[0.12em] text-black/50 mb-8"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  ₦{slide.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>

                <button
                  onClick={() => onQuickView(slide)}
                  className="inline-flex items-center gap-3
                             border border-black/80 text-black
                             text-[10px] tracking-[0.25em] uppercase
                             px-8 py-3.5 cursor-pointer
                             hover:bg-black hover:text-[#f3f2ee]
                             transition-all duration-300 ease-in-out group
                             mx-auto md:mx-0"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Read More
                  <ArrowRight
                    size={11}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                {/* Pagination Dots */}
                <div className="flex items-center gap-2 mt-10 justify-center md:justify-start">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleDot(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        i === current
                          ? 'w-5 h-[5px] bg-black'
                          : 'w-[5px] h-[5px] bg-black/20 hover:bg-black/40'
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
