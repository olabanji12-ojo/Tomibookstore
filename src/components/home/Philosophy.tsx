import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
  }
};

const Philosophy = ({ manifesto }: { manifesto?: string }) => {
  const defaultManifesto = "\"We only stock what we love. Everything else is just noise.\"";
  const displayManifesto = manifesto || defaultManifesto;

  return (
    <section className="py-40 md:py-64 bg-[#ede9e1]">
      <div className="max-w-[1000px] mx-auto px-8 md:px-12 text-center">
        <div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-[11px] font-bold tracking-[0.5em] uppercase text-black/30 block mb-16"
          >
            The Curation Manifesto
          </motion.span>
          
          <motion.h2 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-[1] uppercase tracking-tighter flex flex-wrap justify-center italic"
          >
            {displayManifesto.split(' ').map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-[0.3em] whitespace-nowrap"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="w-16 h-px bg-black/10 mx-auto mt-12 origin-center" 
          />
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
