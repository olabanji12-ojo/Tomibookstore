import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import ExploreCategories from './ExploreCategories';

const PILLARS = [
  {
    id: '01',
    title: 'Shop',
    description: 'Everyday pieces you can use, wear, give, and live with.',
    href: '/shop',
    color: '#f7f6f2' // Soft Bone
  },
  {
    id: '02',
    title: 'Create',
    description: 'Tailor made concepts for brands, businesses, and events.',
    href: '/personalize',
    color: '#fdfdfd' // Clean Paper
  },
  {
    id: '03',
    title: 'Read',
    description: 'Ideas and inspiration for living and building with delight and possibility every day.',
    href: '/journal',
    color: '#faf9f6' // Warm Alabaster
  },
  {
    id: '04',
    title: 'Contact',
    description: 'An idea, a question, or something you’d like to create — let’s begin.',
    href: '/contact',
    color: '#f2f0ea' // Light Stonewash
  }
];

const PillarCard = ({ 
  pillar, 
  isExpanded, 
  onToggle 
}: { 
  pillar: typeof PILLARS[0], 
  isExpanded?: boolean, 
  onToggle?: () => void 
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"]
  });

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.92]);
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.4, 0.7, 1, 0.7, 0.4]);
  const shadow = useTransform(scrollYProgress, [0.4, 0.5, 0.6], 
    ["rgba(0,0,0,0)", "0 40px 80px -15px rgba(0,0,0,0.1)", "rgba(0,0,0,0)"]
  );

  const isHomePillar = pillar.title === 'Shop';

  return (
    <motion.div 
      ref={containerRef}
      style={{ scale, opacity, boxShadow: shadow }}
      className="relative w-full z-10"
    >
      <div 
        style={{ backgroundColor: pillar.color }}
        className={`rounded-[3rem] p-12 md:p-28 flex flex-col transition-all duration-700 relative overflow-hidden border border-black/[0.03]
                   ${isExpanded ? 'h-auto pb-32' : 'aspect-[4/5] md:aspect-[5/3] items-center justify-center text-center'}`}
      >
        {/* Pillar ID */}
        <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2">
           <span className="font-mona text-[10px] md:text-[12px] font-black text-black/10 tracking-[0.5em] uppercase">{pillar.id}</span>
        </div>

        {/* Arrow Indicator (Only if not toggling) */}
        {!onToggle && (
          <Link to={pillar.href} className="absolute top-10 md:top-14 right-10 md:right-14 w-12 h-12 rounded-full border border-black/5 flex items-center justify-center text-black/20 hover:text-black hover:border-black transition-all duration-500">
            <ArrowUpRight size={20} strokeWidth={1.5} />
          </Link>
        )}

        {/* Pillar Content */}
        <div className={`space-y-8 md:space-y-12 flex flex-col relative z-20 w-full 
                        ${isExpanded ? 'items-start text-left' : 'items-center text-center'}`}>
          <div className="max-w-7xl w-full mx-auto">
            <div className={`flex flex-col ${isExpanded ? 'items-start' : 'items-center'}`}>
              <h3 className="font-serif text-6xl md:text-[120px] font-medium text-black tracking-tighter italic leading-[0.8] mb-8 md:mb-12">
                 {pillar.title}
              </h3>
              <p className={`font-poppins text-base md:text-2xl text-black/40 leading-relaxed font-light max-w-2xl
                            ${isExpanded ? '' : 'mx-auto px-6'}`}>
                 {pillar.description}
              </p>
              
              {/* Visual Accent / Toggle */}
              {isHomePillar ? (
                <button 
                  onClick={onToggle}
                  className="pt-12 flex flex-col items-center md:items-start gap-6 group cursor-pointer"
                >
                   <div className="h-[1px] w-12 bg-black/10 group-hover:w-24 transition-all duration-700" />
                   <div className="flex items-center gap-3">
                      <span className="font-mona text-[10px] font-black tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                        {isExpanded ? 'Close Narrative' : 'Open Narrative'}
                      </span>
                      {isExpanded ? <ChevronUp size={14} className="opacity-40" /> : <ChevronDown size={14} className="opacity-40" />}
                   </div>
                </button>
              ) : (
                <Link to={pillar.href} className="pt-12 flex flex-col items-center gap-6 group">
                   <div className="h-[1px] w-12 bg-black/10 group-hover:w-24 transition-all duration-700" />
                   <span className="font-mona text-[10px] font-black tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-700">Open Narrative</span>
                </Link>
              )}
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden w-full"
                >
                  <ExploreCategories />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Background Ghost Text */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] transition-opacity duration-700
                        ${isExpanded ? 'opacity-0' : 'opacity-[0.02]'}`}>
           <span className="font-serif text-[45vw] text-black whitespace-nowrap italic">{pillar.title}</span>
        </div>
      </div>
    </motion.div>
  );
};

const BrandPillars = () => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const togglePillar = (id: string) => {
    setExpandedPillar(expandedPillar === id ? null : id);
  };

  return (
    <section className="bg-[#f3f2ee] pb-40 md:pb-80 px-4 md:px-12 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-16 md:gap-32">
        {PILLARS.map((pillar) => (
          <PillarCard 
            key={pillar.id} 
            pillar={pillar} 
            isExpanded={expandedPillar === pillar.id}
            onToggle={pillar.title === 'Shop' ? () => togglePillar(pillar.id) : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default BrandPillars;