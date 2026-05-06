import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { label: 'SHOP BESTSELLERS', path: '/shop?category=bestsellers' },
  { label: 'SHOP GIFT SETS', path: '/shop?category=gifts' },
  { label: 'EVERYDAY ESSENTIALS', path: '/shop?category=essentials' }
];

const CategoryBar = () => {
  return (
    <section className="bg-white py-16 md:py-32 border-b border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 lg:gap-16">
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
                className="block border border-black/[0.06] px-8 py-8 md:py-10 rounded-none font-mona text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-black hover:bg-black hover:text-white transition-all text-center bg-[#fdfdfd] shadow-sm hover:shadow-xl"
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
