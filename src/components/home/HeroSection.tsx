import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_PHRASES = [
  "designed for your everyday life"
];

const LIFESTYLE_IMAGES = [
  { url: '/brand_intro.png', alt: 'Boutique Collection' },
  { url: '/gift_entry.png', alt: 'Curated Gifts' },
  { url: '/wear_entry.png', alt: 'Fashion & Wear' },
  { url: '/space_entry.png', alt: 'Home & Space' }
];

const HeroSection = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Typewriter logic
  useEffect(() => {
    const handleType = () => {
      const currentFullText = HERO_PHRASES[currentPhraseIndex];
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);
        if (displayText === currentFullText) {
          setTypingSpeed(3000);
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

  // Slideshow logic
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % LIFESTYLE_IMAGES.length);
    }, 5000);
    return () => clearInterval(imageTimer);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] md:h-[90vh] bg-[#f3f2ee] overflow-hidden"
    >
      <div className="w-full h-full md:grid md:grid-cols-2">
        
        {/* LEFT: TEXT CONTENT AREA */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-8 md:relative md:inset-auto md:z-auto md:items-start md:px-24 md:py-32 order-2 md:order-1 text-center md:text-left md:bg-[#f3f2ee] bg-transparent">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="max-w-full md:max-w-xl lg:max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-[5.5vw] xl:text-[5.5rem] font-black text-black leading-[0.95] md:leading-[0.85] tracking-tighter mb-10">
               Good for you, <br />
               <span className="italic leading-none">Made to inspire.</span>
            </h1>

            {/* Typewriter */}
            <div className="min-h-[40px]">
              <h2 className="font-serif text-lg md:text-2xl lg:text-3xl font-light text-black/60 italic leading-none relative">
                  {displayText}
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block w-[2px] h-[0.9em] bg-black/30 ml-1 align-middle"
                  />
              </h2>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: IMAGE AREA (Slideshow) */}
        <div className="absolute inset-0 md:relative h-full order-1 md:order-2 overflow-hidden bg-black/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              src={LIFESTYLE_IMAGES[currentImageIndex].url}
              alt={LIFESTYLE_IMAGES[currentImageIndex].alt}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Mobile Overlay Only */}
          <div className="absolute inset-0 bg-white/40 md:hidden" />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;