import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VisionSection = () => {
  return (
    <section className="bg-[#fcfbf9] py-24 md:py-48 px-6 md:px-12 overflow-hidden border-b border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-[55%] aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-neutral-200"
          >
            <img 
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1600" 
              alt="Our Vision"
              className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>

          {/* Text Side */}
          <div className="w-full md:w-[45%] flex flex-col items-center md:items-start text-center md:text-left">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8"
            >
              The Vision
            </motion.p>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl font-black text-black leading-[1.1] mb-10 italic tracking-tighter"
            >
              Curating the art of <br /> intentional living.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 flex flex-col items-center md:items-start"
            >
              <p className="font-poppins text-black/60 text-sm md:text-base leading-relaxed max-w-md">
                We believe that the objects we surround ourselves with define the quality of our daily experience. Every piece in our collection is chosen for its ability to bring both function and delight to your space.
              </p>
              <p className="font-poppins text-black/60 text-sm md:text-base leading-relaxed max-w-md italic">
                Our vision is to help you build a home and a life that feels authentic, considered, and beautifully yours.
              </p>

              <div className="pt-8 w-full flex justify-center md:justify-start">
                <Link 
                  to="/about" 
                  className="group flex flex-col md:flex-row items-center gap-4 text-black font-mona text-[11px] font-black uppercase tracking-[0.3em]"
                >
                  Read Our Story
                  <span className="w-12 h-[1px] bg-black group-hover:w-20 transition-all duration-300"></span>
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisionSection;
