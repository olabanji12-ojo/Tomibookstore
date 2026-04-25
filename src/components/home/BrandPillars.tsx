import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    id: '01',
    title: 'Shop',
    description: 'Thoughtful goods for inspired living.',
    href: '/shop',
    accent: 'border-black/5'
  },
  {
    id: '02',
    title: 'Create',
    description: 'Thoughtfully made for intentional brands and events.',
    href: '/personalize',
    accent: 'border-black/5'
  },
  {
    id: '03',
    title: 'Read',
    description: 'Words for daily inspiration.',
    href: '/journal',
    accent: 'border-black/5'
  },
  {
    id: '04',
    title: 'Design',
    description: 'Inspiring experiences at scale, for businesses, spaces, and projects.',
    href: '/contact',
    accent: 'border-black/5'
  }
];

const BrandPillars = () => {
  return (
    <section className="bg-[#f3f2ee] pb-24 md:pb-40 px-4 md:px-8">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {PILLARS.map((pillar) => (
          <Link 
            key={pillar.id}
            to={pillar.href}
            className="group block relative overflow-hidden"
          >
            <motion.div 
              whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
              transition={{ duration: 0.5 }}
              className={`border ${pillar.accent} rounded-[2rem] md:rounded-[3rem] p-10 md:p-24 flex flex-col items-center justify-center text-center aspect-[4/5] md:aspect-[5/3] transition-all duration-700 hover:border-black/20 relative group`}
            >
              {/* Pillar ID */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2">
                 <span className="font-mona text-[10px] font-black text-black/10 tracking-[0.5em] uppercase">{pillar.id}</span>
              </div>

              {/* Arrow Indicator */}
              <div className="absolute top-10 right-10 w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/20 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500">
                <ArrowUpRight size={18} strokeWidth={1.5} />
              </div>

              {/* Pillar Content */}
              <div className="space-y-6 md:space-y-10 flex flex-col items-center relative z-10">
                <h3 className="font-serif text-5xl md:text-8xl font-medium text-black tracking-tighter italic leading-none">
                   {pillar.title}
                </h3>
                <p className="font-poppins text-base md:text-xl text-black/40 max-w-sm leading-relaxed font-light mx-auto">
                   {pillar.description}
                </p>
                
                {/* Visual Accent */}
                <div className="pt-8 flex flex-col items-center gap-4">
                   <div className="h-[1px] w-8 bg-black/10 group-hover:w-20 transition-all duration-700" />
                   <span className="font-mona text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-40 transition-opacity duration-700">Open Archive</span>
                </div>
              </div>

              {/* Large Background Ghost Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                 <motion.span 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    transition={{ duration: 2 }}
                    className="font-serif text-[30vw] text-black/[0.02] whitespace-nowrap italic select-none"
                 >
                    {pillar.title}
                 </motion.span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandPillars;
