import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PILLAR_DATA = [
  {
    id: 'shop',
    title: 'SHOP',
    description: 'Everyday pieces you can use, wear, give, and live with.',
    href: '/shop'
  },
  {
    id: 'create',
    title: 'CREATE',
    description: 'Tailor made concepts for brands, businesses, and events.',
    href: '/personalize'
  },
  {
    id: 'read',
    title: 'READ',
    description: 'Ideas and inspiration for living and building with delight.',
    href: '/journal'
  }
];

const BrandPillars = () => {
  return (
    <section className="bg-white py-16 md:py-32 px-6 md:px-12 border-b border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-24 md:mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl font-medium text-black mb-6"
          >
            Designed for living.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-poppins text-black/40 text-sm md:text-base tracking-wide"
          >
            A thoughtful collection of goods and ideas for your everyday.
          </motion.p>
        </div>

        {/* Triple Grid - Matching CategoryBar style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-16">
          {PILLAR_DATA.map((item, idx) => (
            <Link to={item.href} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-[#fdfdfd] border border-black/[0.06] p-8 md:p-12 lg:p-10 xl:p-16 min-h-[400px] flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-xl group h-full"
              >
                {/* Title Content */}
                <div className="mb-8">
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl font-black text-black tracking-tighter leading-[0.9] md:leading-[0.85] transition-all">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="font-poppins text-xs md:text-sm text-black/40 leading-relaxed italic">
                  {item.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPillars;