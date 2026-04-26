import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_PHRASES = [
  "Thoughtful goods",
  "Meaningful Custom Work",
  "Design at Scale"
];

interface HeroSectionProps {
  headline?: string;
  tagline?: string;
}

const HeroSection = ({ headline, tagline }: HeroSectionProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const currentFullText = HERO_PHRASES[currentPhraseIndex];
      
      if (!isDeleting) {
        // TYPING PHASE
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        setTypingSpeed(100); // Regular typing speed

        if (displayText === currentFullText) {
          // Finished typing, pause before deleting
          setTypingSpeed(2500); // Wait 2.5 seconds at full text
          setIsDeleting(true);
        }
      } else {
        // DELETING PHASE
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        setTypingSpeed(50); // Faster backspacing

        if (displayText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
          setTypingSpeed(500); // Short pause before typing next
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhraseIndex, typingSpeed]);

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
           className="mb-8 md:mb-12"
        >
            <p className="font-mona text-[10px] md:text-[12px] font-black tracking-[0.5em] uppercase text-black/30 mb-6 md:mb-10">
               Good Things Co.
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-[7vw] font-medium text-black leading-tight tracking-tight italic">
               {headline || "Live inspired, every day."}
            </h1>
        </motion.div>

        {/* 2. DYNAMIC SUB-TEXT (Typewriter & Backspace) */}
        <div className="min-h-[1.5em] flex items-center justify-center">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[4vw] font-light text-black/50 italic leading-none relative">
                {displayText}
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block w-[2px] h-[0.9em] bg-black/30 ml-1 align-middle"
                />
            </h2>
        </div>

        {/* 3. OPTIONAL SETTINGS TAGLINE */}
        {tagline && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="font-poppins text-sm md:text-base text-black/40 max-w-lg mx-auto mt-14"
          >
            {tagline}
          </motion.p>
        )}

        {/* 4. EXPLORE INDICATOR */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-20 md:pt-28"
        >
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex flex-col items-center gap-4 text-black/20"
            >
                <span className="font-mona text-[9px] font-black tracking-widest uppercase">Explore Narrative</span>
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