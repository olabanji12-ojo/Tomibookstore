import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HERO_PHRASES = [
  "Thoughtful goods",
  "Meaningful Custom Work",
  "Design at Scale"
];

const HeroSection = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const currentFullText = HERO_PHRASES[currentPhraseIndex];
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);
        if (displayText === currentFullText) {
          setTypingSpeed(2500);
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
          setTypingSpeed(500);
        }
      }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhraseIndex, typingSpeed]);

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] md:min-h-screen bg-[#f3f2ee] flex flex-col md:flex-row overflow-hidden"
    >
      {/* BACKGROUND IMAGE (Full screen on mobile, Right side on desktop) */}
      <div className="absolute inset-0 md:relative md:w-1/2 h-full order-1 md:order-2 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/brand_intro.png"
          alt="Boutique Collection"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/[0.05]" />
      </div>

      {/* TEXT CONTENT AREA (Centered overlay on mobile, Left col on desktop) */}
      <div className="relative z-10 w-full h-full md:w-1/2 flex flex-col justify-center items-center md:items-start px-8 md:px-24 py-20 md:py-32 order-2 md:order-1 text-center md:text-left">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="max-w-xl flex flex-col items-center md:items-start"
        >
          {/* Desktop Only Intro - REMOVED */}
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[7.5vw] font-black text-black leading-[0.95] md:leading-[0.85] tracking-tighter mb-10">
             Live inspired, <br />
             <span className="italic whitespace-nowrap leading-none">Everyday.</span>
          </h1>

          {/* Mobile Only Typewriter */}
          <div className="md:hidden min-h-[40px] mb-8">
            <h2 className="font-serif text-2xl font-light text-black/60 italic leading-none relative">
                {displayText}
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block w-[2px] h-[0.9em] bg-black/30 ml-1 align-middle"
                />
            </h2>
          </div>

          {/* Desktop Only Body - REMOVED */}

          {/* Action Grid (Rectangular Buttons - Stacked on mobile, single row on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3 w-full max-w-3xl">
            <Link 
              to="/shop?category=FASHION" 
              className="border border-black/40 px-2 md:px-4 py-4 md:py-5 rounded-none font-mona text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black hover:bg-black hover:text-white transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis"
            >
              FASHION
            </Link>
            <Link 
              to="/shop?category=GIFTING" 
              className="border border-black/40 px-2 md:px-4 py-4 md:py-5 rounded-none font-mona text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black hover:bg-black hover:text-white transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis"
            >
              GIFTS
            </Link>
            <Link 
              to="/shop?category=HOME" 
              className="border border-black/40 px-2 md:px-4 py-4 md:py-5 rounded-none font-mona text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black hover:bg-black hover:text-white transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis"
            >
              HOME
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;