import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BUNDLES = [
  {
    id: 'starter-pack',
    title: 'Starter Pack for Inspired Living',
    description: 'A curated selection of our core essentials to kickstart your journey.',
    price: '₦25,000',
    image: '/book1.jpg'
  },
  {
    id: 'thoughtful-gift',
    title: 'Thoughtful Gift Box',
    description: 'Perfectly paired items designed to bring joy to someone special.',
    price: '₦35,000',
    image: '/book2.jpg'
  },
  {
    id: 'workday-reset',
    title: 'Workday Reset Kit',
    description: 'Elevate your workspace with tools for focus and creativity.',
    price: '₦18,500',
    image: '/book3.jpg'
  }
];

const BundleShowcase = () => {
  return (
    <section className="py-32 bg-[#f9f8f6]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4">Elevated Pairings</p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-black italic">The Curated Kits</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {BUNDLES.map((bundle, idx) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link to={`/shop?category=bundles&id=${bundle.id}`}>
                <div className="aspect-[4/5] bg-white rounded-[2rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={bundle.image} 
                    alt={bundle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-serif text-2xl text-black mb-2 group-hover:italic transition-all">{bundle.title}</h3>
                <p className="font-poppins text-xs text-black/40 leading-relaxed mb-4">{bundle.description}</p>
                <p className="font-mona text-sm font-black text-black">{bundle.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundleShowcase;
