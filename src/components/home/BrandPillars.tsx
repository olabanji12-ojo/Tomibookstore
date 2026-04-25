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

  // Scale: Pops to 1.02 in center, back to 0.95 at edges
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.96]);
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 20 });

  // Opacity: Clear in center, Dim at edges
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.3, 0.6, 1, 0.6, 0.3]);

  // Shadow: Only strong when active
  const shadow = useTransform(scrollYProgress, [0.4, 0.5, 0.6], 
    ["rgba(0,0,0,0)", "0 25px 50px -12px rgba(0,0,0,0.08)", "rgba(0,0,0,0)"]
  );

  return (
    <motion.div 
      ref={containerRef}
      style={{ scale, opacity, boxShadow: shadow }}
      className="relative w-full overflow-hidden"
    >
      <Link 
        to={pillar.href}
        className="block relative overflow-hidden"
      >
        <div 
          style={{ backgroundColor: pillar.color }}
          className="rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-28 flex flex-col items-center justify-center text-center aspect-[4/5] md:aspect-[5/3] transition-colors duration-700 hover:brightness-[0.98] relative group"
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
            <h3 className="font-serif text-5xl md:text-9xl font-medium text-black tracking-tighter italic leading-[0.9]">
               {pillar.title}
            </h3>
            <p className="font-poppins text-base md:text-2xl text-black/40 leading-relaxed font-light mx-auto">
               {pillar.description}
            </p>
            
            {/* Visual Accent */}
            <div className="pt-8 flex flex-col items-center gap-6">
               <div className="h-[1px] w-12 bg-black/10 group-hover:w-24 transition-all duration-700" />
               <span className="font-mona text-[10px] font-black tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-700">Open Narrative</span>
            </div>
          </div>

          {/* Background Texture Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.015]">
             <span className="font-serif text-[40vw] text-black whitespace-nowrap italic">{pillar.title}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BrandPillars = () => {
  return (
    <section className="bg-[#f3f2ee] pb-32 md:pb-64 px-4 md:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-12 md:gap-24">
        {PILLARS.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </section>
  );
};

export default BrandPillars;