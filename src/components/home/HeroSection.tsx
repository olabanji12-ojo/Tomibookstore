import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_PHRASES = [
  { id: 1, text: "Thoughtful goods" },
  { id: 2, text: "Meaningful Custom Work" },
  { id: 3, text: "Design at Scale" }
];

interface HeroSectionProps {
  headline?: string;
  tagline?: string;
}

const HeroSection = ({ headline, tagline }: HeroSectionProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
    exit: {
      opacity: 0,
      transition: { 
        staggerChildren: 0.02, 
        staggerDirection: -1,
      }
    }
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const currentText = HERO_PHRASES[current].text;

  return (
    <section
      id="home"
      style={{ backgroundColor: '#f3f2ee' }}
      className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Static Background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          src="/brand_intro.png"
          alt=""
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f3f2ee]/30" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-[95vw] md:max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* 1. STATIC HEADLINE */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="mb-6 md:mb-10"
        >
            <p className="font-mona text-[10px] md:text-[12px] font-black tracking-[0.5em] uppercase text-black/30 mb-4 md:mb-8">
               Good Things Co.
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-[6vw] font-medium text-black leading-tight tracking-tight italic">
               Live inspired, every day.
            </h1>
        </motion.div>

        {/* 2. DYNAMIC SUB-TEXT (Typing Animation) */}
        <div className="min-h-[1.5em] flex items-start justify-center">
            <AnimatePresence mode="wait">
            <motion.div
                key={current}
                variants={container}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-wrap justify-center pointer-events-none"
            >
                {currentText.split(" ").map((word, wordIndex) => (
                    <span key={wordIndex} className="whitespace-nowrap mx-[0.2em] flex">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                        key={charIndex}
                        variants={child}
                        className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[4vw] font-light text-black/40 italic leading-none"
                        >
                        {char}
                        </motion.span>
                    ))}
                    </span>
                ))}
            </motion.div>
            </AnimatePresence>
        </div>

        {/* 3. OPTIONAL SETTINGS TAGLINE */}
        {tagline && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="font-poppins text-sm md:text-base text-black/40 max-w-lg mx-auto mt-12"
          >
            {tagline}
          </motion.p>
        )}

        {/* 4. EXPLORE INDICATOR */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="pt-16 md:pt-24"
        >
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex flex-col items-center gap-4 text-black/20"
            >
                <span className="font-mona text-[9px] font-black tracking-widest uppercase">Explore Content</span>
                <div className="w-[1px] h-12 bg-black/10" />
            </motion.div>
        </motion.div>
      </div>
      
      {/* Ghost Texture Background */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none select-none flex items-center justify-center">
         <span className="font-serif text-[45vw] text-black italic">Intent</span>
      </div>
    </section>
  );
};

export default HeroSection;