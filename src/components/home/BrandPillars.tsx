import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import ExploreCategories from './ExploreCategories';

const PILLARS = [
  {
    id: '01',
    title: 'Shop',
    description: 'Everyday pieces you can use, wear, give, and live with.',
    href: '/shop',
    color: '#f7f6f2'
  },
  {
    id: '02',
    title: 'Create',
    description: 'Tailor made concepts for brands, businesses, and events.',
    href: '/personalize',
    color: '#fdfdfd'
  },
  {
    id: '03',
    title: 'Read',
    description: 'Ideas and inspiration for living and building with delight.',
    href: '/journal',
    color: '#faf9f6'
  },
  {
    id: '04',
    title: 'Contact',
    description: 'An idea, a question, or something you’d like to create.',
    href: '/contact',
    color: '#f2f0ea'
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
  const isHomePillar = pillar.title === 'Shop';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`relative w-full ${isExpanded ? 'col-span-2 lg:col-span-4' : 'col-span-1'}`}
    >
      <div 
        style={{ backgroundColor: pillar.color }}
        className={`rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] p-6 md:p-8 lg:p-12 flex flex-col transition-all duration-700 relative overflow-hidden border border-black/[0.03]
                   ${isExpanded ? 'min-h-[60vh] pb-20' : 'min-h-[300px] md:min-h-[400px] lg:min-h-[500px] items-center justify-center text-center'}`}
      >
        {/* Interaction Link */}
        {!isExpanded && (
          <Link to={pillar.href} className="absolute top-4 md:top-6 right-4 md:right-6 w-8 h-8 rounded-full border border-black/5 flex items-center justify-center text-black/20 hover:text-black transition-all">
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        )}

        {/* Content */}
        <div className={`flex flex-col relative z-20 w-full 
                        ${isExpanded ? 'items-start text-left' : 'items-center text-center'}`}>
          <h3 className={`font-serif font-medium text-black tracking-tight italic leading-none mb-3 md:mb-4
                         ${isExpanded ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>
             {pillar.title}
          </h3>
          <p className={`font-poppins text-black/40 font-light leading-relaxed
                        ${isExpanded ? 'text-sm md:text-lg max-w-xl' : 'text-[10px] md:text-xs px-2'}`}>
             {pillar.description}
          </p>
          
          {/* Toggle / Action */}
          {isHomePillar ? (
            <button 
              onClick={onToggle}
              className="mt-6 flex items-center gap-2 group cursor-pointer"
            >
               <span className="font-mona text-[8px] font-black tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                 {isExpanded ? 'Close' : 'Explore'}
               </span>
               {isExpanded ? <ChevronUp size={10} className="opacity-40" /> : <ChevronDown size={10} className="opacity-40" />}
            </button>
          ) : (
            <Link to={pillar.href} className="mt-6 font-mona text-[8px] font-black tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity">
               Discover
            </Link>
          )}
        </div>

        {/* Expansion */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-12"
            >
              <ExploreCategories />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Accent */}
        {!isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
             <span className="font-serif text-[25vw] text-black italic">{pillar.title}</span>
          </div>
        )}
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
    <section className="bg-white py-12 md:py-24 px-4 md:px-8 lg:px-12 relative">
      <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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