import { motion } from 'framer-motion';

const Philosophy = () => {
  return (
    <section className="py-32 md:py-48 bg-[#ede9e1]">
      <div className="max-w-[1000px] mx-auto px-8 md:px-12 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="font-poppins text-[10px] font-bold tracking-[0.4em] uppercase text-black/20 block mb-12">
            The Curation Manifesto
          </span>
          <h2 className="font-mona text-3xl md:text-5xl lg:text-6xl font-black text-black leading-[1.1] uppercase tracking-tighter italic">
            "We only stock what we love. <br />
            Everything else is just noise."
          </h2>
          <div className="w-16 h-px bg-black/10 mx-auto mt-12" />
        </motion.div>
      </div>
    </section>
  );
};

export default Philosophy;
