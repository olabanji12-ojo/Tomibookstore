import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_PHRASES = [
  { id: 1, text: "Live inspired, every day" },
  { id: 2, text: "Thoughtful goods" },
  { id: 3, text: "Meaningful Custom Work" },
  { id: 4, text: "Design at Scale" }
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
        transitionEnd: { display: "none" }
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

  // Prioritize HERO_PHRASES but allow settings to act as a fallback if desired.
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

      {/* Typing Text Container */}
      <div className="relative z-10 w-full max-w-[95vw] md:max-w-6xl mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={container}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-8 md:gap-12"
          >
            <motion.p 
              variants={child}
              className="font-mona text-[10px] md:text-[12px] font-black tracking-[0.5em] uppercase text-black/30"
            >
               Good Things Co.
            </motion.p>
            
            <motion.h2 
              className="font-serif text-[10vw] sm:text-7xl md:text-[8vw] font-medium text-black leading-[1.1] tracking-tighter italic flex flex-wrap justify-center"
            >
              {currentText.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="whitespace-nowrap mx-[0.15em] flex">
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                       key={charIndex}
                       variants={child}
                       className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h2>

            {(tagline || (current === 0 && headline)) && (
              <motion.p variants={child} className="font-poppins text-sm md:text-base text-black/40 max-w-lg mx-auto">
                {tagline || headline}
              </motion.p>
            )}

            <motion.div 
               variants={child}
               className="pt-10 md:pt-16"
            >
               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="inline-flex flex-col items-center gap-4 text-black/20"
               >
                  <span className="font-mona text-[9px] font-black tracking-widest uppercase">Explore</span>
                  <div className="w-[1px] h-12 bg-black/10" />
               </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none flex items-center justify-center">
         <span className="font-serif text-[45vw] text-black italic">Intent</span>
      </div>
    </section>
  );
};

export default HeroSection;