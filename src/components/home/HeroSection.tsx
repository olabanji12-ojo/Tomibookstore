import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
      <div className="relative z-10 w-full max-w-[95vw] md:max-w-6xl mx-auto px-4 text-center flex flex-col items-center pt-20 md:pt-32">
        
        {/* 1. STATIC HEADLINE */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="mb-8 md:mb-12"
        >

            <h1 className="font-serif text-5xl sm:text-7xl md:text-[8vw] font-black text-black leading-[0.95] md:leading-[0.85] tracking-tighter">
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




      </div>
      
      {/* Ghost Texture Background */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none select-none flex items-center justify-center">
         <span className="font-serif text-[45vw] text-black italic">Intent</span>
      </div>
    </section>
  );
};

export default HeroSection;