import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    id: '01',
    title: 'Shop',
    description: 'Thoughtful goods for inspired living.',
    href: '/shop',
    image: 'https://images.unsplash.com/photo-1513519247388-19345420d517?auto=format&fit=crop&q=80',
    color: 'bg-[#faf9f6]'
  },
  {
    id: '02',
    title: 'Create',
    description: 'Thoughtfully made for intentional brands and events.',
    href: '/personalize',
    image: 'https://images.unsplash.com/photo-1523450001312-faa4e2e31f0f?auto=format&fit=crop&q=80',
    color: 'bg-[#f7f5f0]'
  },
  {
    id: '03',
    title: 'Read',
    description: 'Words for daily inspiration.',
    href: '/journal',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80',
    color: 'bg-[#f5f3ee]'
  },
  {
    id: '04',
    title: 'Design',
    description: 'Inspiring experiences at scale, for businesses, spaces, and projects.',
    href: '/contact',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    color: 'bg-[#f0ede6]'
  }
];

const BrandPillars = () => {
  return (
    <section className="bg-[#f3f2ee] pb-24 md:pb-40 px-4 md:px-8">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {PILLARS.map((pillar) => (
          <Link 
            key={pillar.id}
            to={pillar.href}
            className="group block relative overflow-hidden"
          >
            <motion.div 
              whileHover={{ scale: 0.99 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`${pillar.color} rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center aspect-[4/5] md:aspect-[5/4] transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 relative`}
            >
              {/* Pillar Header */}
              <div className="absolute top-10 left-10 right-10 flex justify-between items-start w-[calc(100%-5rem)]">
                 <span className="font-mona text-[10px] font-black text-black/20 tracking-widest">{pillar.id}</span>
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/5 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                 </div>
              </div>

              {/* Pillar Content */}
              <div className="space-y-6 md:space-y-10 flex flex-col items-center">
                <h3 className="font-serif text-5xl md:text-8xl font-medium text-black tracking-tighter italic">
                   {pillar.title}
                </h3>
                <p className="font-poppins text-base md:text-xl text-black/40 max-w-sm leading-relaxed font-light mx-auto">
                   {pillar.description}
                </p>
                
                {/* Visual Accent */}
                <div className="pt-8 flex flex-col items-center gap-4">
                   <div className="h-[1px] w-12 bg-black/10 group-hover:w-24 transition-all duration-700" />
                   <span className="font-mona text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-40 transition-opacity duration-700">Explore</span>
                </div>
              </div>

              {/* Faint Background Text for Texture */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <span className="font-serif text-[25vw] text-black whitespace-nowrap italic">{pillar.title}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

    </section>
  );
};

export default BrandPillars;
