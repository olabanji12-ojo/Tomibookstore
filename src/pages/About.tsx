import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/shared/MetaTags';

const About = () => {
  return (
    <main className="bg-[#f3f2ee] min-h-screen">
      <MetaTags 
        title="Our Story" 
        description="We believe everyday life should feel intentional, delightful, and inspiring. Learn about the philosophy behind Good Things Co."
      />

      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-20 md:pb-32 px-8">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mona text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase text-black/20 block mb-10 text-center">
              The Philosophy
            </span>
            <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-black text-black leading-[0.9] tracking-tighter mb-16">
              WE BELIEVE <br />
              EVERYDAY LIFE <br />
              SHOULD FEEL <br />
              <span className="italic uppercase">INTENTIONAL.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 md:py-40 px-8 border-t border-black/[0.03]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12 w-full"
          >
             <h2 className="font-serif text-3xl md:text-5xl font-medium text-black leading-tight italic">
               "We believe everyday life should feel intentional, delightful, and inspiring."
             </h2>
             <div className="w-16 h-px bg-black/10 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-10 mt-20"
          >
            <p className="font-poppins text-xl md:text-2xl text-black/60 leading-relaxed font-light">
              Good Things Co exists to create pieces that are good for you — things you can use, wear, give, and live with.
            </p>
            <p className="font-poppins text-xl md:text-2xl text-black/60 leading-relaxed font-light">
              Everything we make is designed with intention and made to inspire how you show up in your everyday life.
            </p>

            <div className="pt-10 flex justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-4 bg-black text-white px-10 py-6 rounded-full font-mona text-[11px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl"
              >
                LEARN MORE <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Break */}
      <section className="h-[60vh] md:h-[80vh] bg-black relative overflow-hidden">
         <img 
            src="/brand_intro.png" 
            alt="Process" 
            className="w-full h-full object-cover opacity-60 grayscale"
         />
         <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="font-serif text-[15vw] text-white italic opacity-20 select-none">Intent</h3>
         </div>
      </section>
    </main>
  );
};

export default About;
