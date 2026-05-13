import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const AuthorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal Content Container (needed for centering) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl h-full max-h-[80vh] md:h-[80vh] bg-[#fcfbf9] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000" 
                alt="Inspired Living" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto">
              <span className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4 block">The Founder</span>
              <h2 className="font-serif text-4xl md:text-6xl font-black text-black mb-8 leading-tight">Sisi Tomilayo</h2>
              
              <div className="space-y-6">
                <p className="font-poppins text-black/60 text-sm md:text-base leading-relaxed">
                  Sisi Tomilayo founded Good Things Co. with a simple yet profound vision: to create a space where every item tells a story of intentionality, joy, and the beauty of human possibility.
                </p>
                <p className="font-poppins text-black/60 text-sm md:text-base leading-relaxed">
                  With a background in curation and a deep love for literature, she believes that the objects we surround ourselves with are more than just things—they are the artifacts of our lives.
                </p>
                <p className="font-poppins text-black/40 text-sm md:text-base leading-relaxed italic">
                  "We don't just sell products; we create the artifacts of your life."
                </p>
              </div>

              <div className="mt-12 pt-12 border-t border-black/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-serif italic text-lg">S</div>
                    <div>
                        <p className="font-serif text-lg text-black">Stay Curious,</p>
                        <p className="font-mona text-[9px] font-black uppercase tracking-widest text-black/30">Tomilayo</p>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const VisionSection = () => {
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  return (
    <>
      <AuthorModal 
        isOpen={isAuthorModalOpen} 
        onClose={() => setIsAuthorModalOpen(false)} 
      />
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
              className="font-serif text-3xl md:text-5xl font-light leading-[1.3] text-black mb-12 italic max-w-3xl"
            >
              Created for people choosing joy, purpose, and possibility every day.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center md:items-start gap-8"
            >
              {/* Founder Signature Block */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="w-12 h-[1px] bg-black/20" />
                <div>
                  <p 
                    onClick={() => setIsAuthorModalOpen(true)}
                    className="font-serif text-2xl text-black cursor-pointer hover:text-black/60 transition-colors"
                  >
                    Sisi Tomilayo
                  </p>
                  <p className="font-mona text-[9px] font-black uppercase tracking-widest text-black/30 mt-2">Founder & Curator</p>
                </div>
              </div>

              <div className="pt-8">
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
    </>
  );
};

export default VisionSection;
