import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    id: '01',
    title: 'Shop',
    description: 'Thoughtful goods for inspired living.',
    href: '/shop',
    color: '#f7f6f2' // Soft Bone
  },
  {
    id: '02',
    title: 'Create',
    description: 'Thoughtfully made for intentional brands and events.',
    href: '/personalize',
    color: '#fdfdfd' // Clean Paper
  },
  {
    id: '03',
    title: 'Read',
    description: 'Words for daily inspiration.',
    href: '/journal',
    color: '#faf9f6' // Warm Alabaster
  },
  {
    id: '04',
    title: 'Design',
    description: 'Inspiring experiences at scale, for businesses, spaces, and projects.',
    href: '/contact',
    color: '#f2f0ea' // Light Stonewash
  }
];

const PillarCard = ({ pillar }: { pillar: typeof PILLARS[0] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"]
  });

  // More aggressive scale: starts at 0.9, pops to 1.05
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.92]);
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 20 });

  // Clearer Opacity: 40% when inactive, snaps to 100% at center
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.4, 0.7, 1, 0.7, 0.4]);

  // Pronounced shadow when active
  const shadow = useTransform(scrollYProgress, [0.4, 0.5, 0.6], 
    ["rgba(0,0,0,0)", "0 40px 80px -15px rgba(0,0,0,0.1)", "rgba(0,0,0,0)"]
  );

  return (
    <motion.div 
      ref={containerRef}
      style={{ scale, opacity, boxShadow: shadow }}
      className="relative w-full z-10"
    >
      <Link 
        to={pillar.href}
        className="block relative overflow-hidden"
      >
        <div 
          style={{ backgroundColor: pillar.color }}
          className="rounded-[3rem] p-12 md:p-28 flex flex-col items-center justify-center text-center aspect-[4/5] md:aspect-[5/3] transition-colors duration-700 hover:brightness-95 relative group overflow-hidden border border-black/[0.03]"
        >
          {/* Pillar ID */}
          <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2">
             <span className="font-mona text-[10px] md:text-[12px] font-black text-black/10 tracking-[0.5em] uppercase">{pillar.id}</span>
          </div>

          {/* Arrow Indicator */}
          <div className="absolute top-10 md:top-14 right-10 md:right-14 w-12 h-12 rounded-full border border-black/5 flex items-center justify-center text-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <ArrowUpRight size={20} strokeWidth={1.5} />
          </div>

          {/* Pillar Content */}
          <div className="space-y-8 md:space-y-12 flex flex-col items-center relative z-10 w-full max-w-lg">
            <h3 className="font-serif text-6xl md:text-[120px] font-medium text-black tracking-tighter italic leading-[0.8] mb-4">
               {pillar.title}
            </h3>
            <p className="font-poppins text-base md:text-2xl text-black/40 leading-relaxed font-light mx-auto px-6">
               {pillar.description}
            </p>
            
            {/* Visual Accent */}
            <div className="pt-8 flex flex-col items-center gap-6">
               <div className="h-[1px] w-12 bg-black/10 group-hover:w-24 transition-all duration-700" />
               <span className="font-mona text-[10px] font-black tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-700">Open Narrative</span>
            </div>
          </div>

          {/* Background Ghost Text - Larger & Subtle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
             <span className="font-serif text-[45vw] text-black whitespace-nowrap italic">{pillar.title}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BrandPillars = () => {
  return (
    <section className="bg-[#f3f2ee] pb-40 md:pb-80 px-4 md:px-12 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-16 md:gap-32">
        {PILLARS.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </section>
  );
};

export default BrandPillars;