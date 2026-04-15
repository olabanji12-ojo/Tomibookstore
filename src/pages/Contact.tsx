import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Content:', formData);
    setIsSubmitted(true);
    // Success state resets form after short delay or keeps it clear
    setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' });
  };

  return (
    <section className="bg-[#f3f2ee] min-h-screen pt-24 pb-20 px-8 md:px-12">
      <div className="max-w-[1200px] mx-auto pb-20">
        
        {/* Header Section */}
        <div className="text-center mb-20 md:mb-32">
          <h1 className="font-mona text-4xl md:text-6xl font-black text-black uppercase tracking-tight mb-6">
            Get In Touch
          </h1>
          <p className="font-poppins text-sm md:text-base text-black/40 max-w-lg mx-auto leading-relaxed">
            Have a question about an order or a bulk purchase? <br className="hidden md:block"/> 
            We're here to help you curate your perfect collection.
          </p>
          <div className="w-16 h-px bg-black/10 mx-auto mt-10" />
        </div>

        <div className="flex flex-col md:flex-row gap-20 lg:gap-32">
          
          {/* Left Column: Trust Info */}
          <div className="w-full md:w-[40%] flex flex-col gap-12 text-center md:text-left">
            <div>
              <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8 underline decoration-black/5 underline-offset-8">
                The Details
              </h3>
              
              <div className="space-y-10">
                {/* Email Link */}
                <a href="mailto:hello@booksaw.com" className="flex flex-col gap-2 group hover:opacity-70 transition-opacity">
                  <span className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-black/20">Email Us</span>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Mail size={16} strokeWidth={1} className="text-black/40" />
                    <span className="font-poppins text-base font-medium text-black">hello@booksaw.com</span>
                  </div>
                </a>

                {/* WhatsApp Link (Priority) */}
                <div className="pt-2">
                   <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-black/20 mb-4 text-center md:text-left">Immediate Response</p>
                   <a 
                    href="https://wa.me/2348000000000?text=Hello%20BookSaw%2C%20I%20have%20a%20question..." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center md:justify-start gap-4 bg-white border border-green-500/10 px-8 py-5 rounded-[4px] shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all group"
                  >
                    <MessageCircle size={20} className="text-green-600 fill-green-600/10" />
                    <span className="font-poppins text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-green-700">Chat with us on WhatsApp</span>
                  </a>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <span className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-black/20">Studio</span>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <MapPin size={16} strokeWidth={1} className="text-black/40" />
                    <span className="font-poppins text-base font-medium text-black">Victoria Island, Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="w-full md:w-[60%] bg-white/40 backdrop-blur-sm p-8 md:p-16 rounded-[2px] shadow-sm border border-white/20">
            {!isSubmitted ? (
               <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                  <div className="space-y-3">
                    <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">FullName</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Kolawole Davies"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-all placeholder:text-black/10"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="yourname@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-all placeholder:text-black/10"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Reason for inquiry</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none cursor-pointer appearance-none transition-all"
                    >
                      <option>Order Inquiry</option>
                      <option>Bulk Purchase</option>
                      <option>Media/Press</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Please tell us what you need..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-all resize-none placeholder:text-black/10"
                    />
                  </div>

                  <div className="mt-4">
                    <button 
                      type="submit"
                      className="relative overflow-hidden group w-full md:w-auto px-14 py-6 bg-black text-white font-poppins text-[10px] font-bold uppercase tracking-[0.5em] transition-all cursor-pointer shadow-2xl"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Send Message
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                      {/* Slide-up hover effect */}
                      <div className="absolute inset-0 bg-neutral-800 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
                    </button>
                  </div>
               </form>
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center"
                >
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20">
                    <Send size={24} />
                  </div>
                  <h2 className="font-mona text-2xl font-black text-black uppercase tracking-tight mb-4">Thank You!</h2>
                  <p className="font-poppins text-sm text-black/50 leading-relaxed mb-12 max-w-xs mx-auto">
                    We've captured your message. Our curator will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] border-b border-black/20 pb-1 cursor-pointer hover:border-black transition-all text-black/40 hover:text-black"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
