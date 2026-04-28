import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DISCOVERY_ITEMS = [
  {
    title: 'FASHION',
    desc: 'Versatile pieces for everyday you.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800',
    href: '/shop?category=FASHION'
  },
  {
    title: 'GIFTS',
    desc: 'Thoughtful finds for every moment.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
    href: '/shop?category=GIFTING'
  },
  {
    title: 'HOME',
    desc: 'Pieces that make your space, yours.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=800',
    href: '/shop?category=HOME'
  }
];

const DiscoveryGrid = () => {
  return (
    <section className="hidden md:block w-full bg-[#f3f2ee] md:bg-white px-2 md:px-8 pb-12 md:pb-24">
      <div className="w-full">
        <div className="pt-10 mb-12 w-full text-center">
            <h4 className="font-mona text-[12px] md:text-[16px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-black/60">
              Explore What Inspires Your Everyday
            </h4>
        </div>
        
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {DISCOVERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[1.2/1] md:aspect-[1.3/1] overflow-hidden bg-neutral-100"
            >
              <Link to={item.href} className="block w-full h-full">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                
                {/* Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-10 flex flex-col items-start text-white z-20">
                  <h5 className="font-serif text-lg md:text-5xl font-bold tracking-tight mb-1 italic leading-none">{item.title}</h5>
                  <p className="hidden md:block font-poppins text-[10px] text-white/80 uppercase tracking-widest mb-6 max-w-[200px] leading-relaxed">{item.desc}</p>
                  
                  <div className="border border-white/60 px-3 py-1.5 md:px-8 md:py-4 rounded-none backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                    <span className="font-mona text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Shop Now</span>
                  </div>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoveryGrid;
