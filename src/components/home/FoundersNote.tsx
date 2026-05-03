import { motion } from 'framer-motion';

const FoundersNote = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <p className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8">The Vision</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-[1.2] text-black mb-10 italic">
              "Created for people choosing joy, purpose, and possibility every day."
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-12 h-[1px] bg-black/20" />
              <div>
                <p className="font-serif text-xl text-black">Sisi Tomilayo</p>
                <p className="font-mona text-[9px] font-black uppercase tracking-widest text-black/30 mt-1">Founder & Curator</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 aspect-[4/5] bg-[#f3f2ee] overflow-hidden rounded-[2rem]"
          >
            {/* Using a lifestyle placeholder that represents the founder's aesthetic */}
            <img 
              src="/banji1.jpg" 
              alt="Sisi Tomilayo - Vision" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FoundersNote;
