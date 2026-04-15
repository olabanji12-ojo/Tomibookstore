import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import type { Book } from '../../types';

// ─── Slide Data ────────────────────────────────────────────────────────────────

const HERO_SLIDES: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    description:
      'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results — used by millions worldwide.',
    image: '/book1.jpg',
    price: 24.99,
  },
  {
    id: '2',
    title: 'The Great Alone',
    author: 'Kristin Hannah',
    description:
      'A powerful, sweeping story of human resilience and survival in the unforgiving wilderness of 1970s Alaska.',
    image: '/book6.jpg',
    price: 21.99,
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description:
      'A brief history of humankind. From foragers to AI — every revolution that shaped the world we live in today.',
    image: '/book3.jpg',
    price: 22.99,
  },
  {
    id: '4',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description:
      'Between life and death there is a library. A luminous novel about all the lives we could have lived — and the one we choose.',
    image: '/book4.jpg',
    price: 19.99,
  },
];

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
  onBookSelect: (book: Book) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const HeroSection = ({ onBookSelect }: HeroSectionProps) => {
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

      {/* ── Floating Left Arrow ─────────────────────────────────────────────── */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 flex items-center justify-center cursor-pointer
                   text-black/20 hover:text-black/60 transition-colors duration-200"
      >
        <ChevronLeft size={24} strokeWidth={1.2} />
      </button>

      {/* ── Floating Right Arrow ────────────────────────────────────────────── */}
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 flex items-center justify-center cursor-pointer
                   text-black/20 hover:text-black/60 transition-colors duration-200"
      >
        <ChevronRight size={24} strokeWidth={1.2} />
      </button>

      {/* ── Content Grid ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1400px] mx-auto px-12 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-16 md:py-0 min-h-[calc(100vh-129px)]">

          {/* ── BOOK IMAGE (mobile: top / desktop: right) ─────────────────── */}
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
                {/* Ambient shadow beneath cover */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[65%] h-10 blur-3xl opacity-20 rounded-full bg-black/10"
                />

                {/* Book cover */}
                <div
                  className="relative w-[190px] md:w-[240px] lg:w-[280px] aspect-[2/3] rounded-[2px]"
                  style={{
                    boxShadow:
                      '10px 18px 55px rgba(0,0,0,0.16), 3px 6px 16px rgba(0,0,0,0.08), -1px 0 0 rgba(0,0,0,0.05)',
                  }}
                >
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-[2px]"
                    />
                  ) : (
                    /* Placeholder until real cover images are provided */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,0.35)" strokeWidth="0.8">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      <p
                        className="text-white/25 text-[8px] tracking-[0.3em] uppercase"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Cover
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── TEXT BLOCK (mobile: bottom / desktop: left) ───────────────── */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Slide counter */}
                <p
                  className="text-[9px] tracking-[0.4em] uppercase text-black/25 mb-7"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  0{current + 1}&nbsp;&nbsp;/&nbsp;&nbsp;0{HERO_SLIDES.length}
                </p>

                {/* Title */}
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black
                             leading-[1.08] tracking-[-0.02em] mb-5 font-poppins"
                >
                  {slide.title}
                </h1>

                {/* Author */}
                <p
                  className="text-[10px] tracking-[0.22em] uppercase text-black/30 mb-6"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  by {slide.author}
                </p>

                {/* Description */}
                <p
                  className="text-[13.5px] text-black/45 leading-[1.8] max-w-sm mx-auto md:mx-0 mb-7"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}
                >
                  {slide.description}
                </p>

                {/* Price */}
                <p
                  className="text-[12px] tracking-[0.12em] text-black/50 mb-8"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  ₦{slide.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>

                {/* CTA — passes slide data to modal handler */}
                <button
                  onClick={() => onBookSelect(slide)}
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
