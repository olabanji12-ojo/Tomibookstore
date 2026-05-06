import { motion } from 'framer-motion';

const FoundersNote = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <p className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-12">The Vision</p>
          
          <div className="w-full max-w-md aspect-[4/5] bg-[#f3f2ee] overflow-hidden rounded-[2.5rem] mb-16 shadow-2xl shadow-black/5">
            <img 
              src="/Goodthings1.jpg" 
              alt="The Vision" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-[1.3] text-black mb-12 italic max-w-3xl">
            Created for people choosing joy, purpose, and possibility every day.
          </h2>

          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-[1px] bg-black/20" />
            <div>
              <p className="font-serif text-2xl text-black">Sisi Tomilayo</p>
              <p className="font-mona text-[9px] font-black uppercase tracking-widest text-black/30 mt-2">Founder & Curator</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FoundersNote;
