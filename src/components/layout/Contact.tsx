import { useState } from 'react';
import { Mail, MessageCircle, Instagram, Send } from 'lucide-react';

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
    setIsSubmitted(true);
    // Logic to clear form or send email could go here
    setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' });
  };

  return (
    <section id="contact" className="bg-[#f3f2ee] py-24 px-8 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-mona text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
            Get In Touch
          </h2>
          <div className="w-16 h-[2px] bg-black mx-auto mt-6 opacity-10"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-20">
          {/* Left Column: Info */}
          <div className="w-full md:w-1/3 flex flex-col gap-10 text-center md:text-left">
            <div>
              <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-6">Contact Info</h3>
              <div className="space-y-6">
                <a href="mailto:hello@booksaw.com" className="flex items-center gap-4 group justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <span className="font-poppins text-sm font-medium text-black/60 group-hover:text-black transition-colors">hello@booksaw.com</span>
                </a>

                {/* WhatsApp Link - Very important for Nigeria */}
                <a 
                  href="https://wa.me/2348000000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group justify-center md:justify-start"
                >
                  <div className="w-10 h-10 rounded-full border border-green-500/20 bg-green-500/5 flex items-center justify-center group-hover:bg-green-500 group-hover:shadow-lg transition-all">
                    <MessageCircle size={16} strokeWidth={1.5} className="text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-poppins text-sm font-bold text-green-700 group-hover:text-green-900 transition-colors">WhatsApp Chat</span>
                </a>

                <a href="#" className="flex items-center gap-4 group justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                    <Instagram size={16} strokeWidth={1.5} />
                  </div>
                  <span className="font-poppins text-sm font-medium text-black/60 group-hover:text-black transition-colors">@booksaw_ng</span>
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-4">Location</h3>
              <p className="font-poppins text-xs text-black/40 leading-relaxed">
                Victoria Island, Lagos, <br />
                Nigeria.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full md:w-2/3">
            {!isSubmitted ? (
               <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Emeka Johnson"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="client@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors cursor-pointer appearance-none"
                    >
                      <option>Order Inquiry</option>
                      <option>Bulk Purchase</option>
                      <option>Media/Press</option>
                      <option>Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:border-black outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <button 
                      type="submit"
                      className="w-full md:w-auto px-12 py-5 bg-black text-white font-poppins text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:gap-5 transition-all cursor-pointer shadow-xl shadow-black/10"
                    >
                      Send Message
                      <Send size={14} />
                    </button>
                  </div>
               </form>
            ) : (
              <div className="bg-white/50 border border-black/5 p-12 md:p-20 text-center rounded-[2px] backdrop-blur-sm animate-in zoom-in-95 duration-500">
                 <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
                   <Send size={24} />
                 </div>
                 <h2 className="font-mona text-2xl font-black text-black uppercase tracking-tight mb-4">Message Sent!</h2>
                 <p className="font-poppins text-sm text-black/50 leading-relaxed mb-10 max-w-sm mx-auto">
                   We've received your inquiry and our curator will get back to you within 24 hours.
                 </p>
                 <button 
                   onClick={() => setIsSubmitted(false)}
                   className="font-poppins text-[9px] font-bold uppercase tracking-[0.3em] border-b border-black pb-1 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                 >
                   Send another message
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
