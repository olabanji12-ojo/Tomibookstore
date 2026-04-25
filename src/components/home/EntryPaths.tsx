import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ENTRY_PATHS = [
  {
    title: 'Ready Things',
    subtitle: 'Thoughtful pieces, ready to go.',
    image: '/gift_entry.png',
    path: '/shop',
    btnText: 'Shop Now'
  },
  {
    title: 'Made for You',
    subtitle: 'Designed around your moment.',
    image: '/space_entry.png',
    path: '/personalize',
    btnText: 'Start a Project'
  },
  {
    title: 'By Direction',
    subtitle: 'Clarity for what you’re creating.',
    image: '/wear_entry.png',
    path: '/contact',
    btnText: 'Book a Session'
  }
];

const EntryPaths = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 md:py-48 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {ENTRY_PATHS.map((path, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <div 
                className="flex flex-col gap-6 group cursor-pointer"
                onClick={() => navigate(path.path)}
              >
                {/* Image Container (4:5 Ratio) */}
                <div className="aspect-[3/4] overflow-hidden relative grayscale-[30%] group-hover:grayscale-0 transition-all duration-700">
                  <img 
                    src={path.image} 
                    alt={path.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left">
                  <p className="font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-black/20 mb-3">
                    {path.subtitle}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-medium text-black tracking-tight mb-6 group-hover:opacity-40 transition-opacity italic">
                    {path.title}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 font-sans text-[9px] font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
                    {path.btnText || 'EXPLORE'} <div className="h-[1px] w-4 bg-black/10 group-hover:w-8 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EntryPaths;
