import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { label: 'SHOP BESTSELLERS', path: '/shop?category=bestsellers' },
  { label: 'SHOP GIFT SETS', path: '/shop?category=gifts' },
  { label: 'EVERYDAY ESSENTIALS', path: '/shop?category=essentials' }
];

const CategoryBar = () => {
  return (
    <section className="bg-white py-6 md:py-10 border-b border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link 
                to={cat.path} 
                className="block border border-black/10 px-2 md:px-4 py-4 md:py-5 rounded-none font-mona text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black hover:bg-black hover:text-white transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis bg-[#fdfdfd]"
              >
                {cat.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
