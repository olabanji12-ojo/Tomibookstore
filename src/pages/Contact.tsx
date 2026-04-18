import { useState } from 'react';
import Swal from 'sweetalert2';
import { MessageCircle, MapPin, Send, Camera, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) return false;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) return false;
    if (!formData.message.trim()) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill out all fields correctly.',
        background: '#ffffff',
        color: '#000000',
        confirmButtonColor: '#000000',
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('https://formspree.io/f/xdklqkde', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Thank you for your message. Our curator will get back to you soon!',
          background: '#ffffff',
          color: '#000000',
          confirmButtonColor: '#000000',
        });
        setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again or email us directly.',
        background: '#ffffff',
        color: '#000000',
        confirmButtonColor: '#000000',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="bg-[#f3f2ee] min-h-screen pt-24 pb-32 px-8 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        
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

        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          
          {/* Left Column: Info Section */}
          <div className="space-y-16 text-center md:text-left">
            <div className="space-y-8">
              <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30 underline decoration-black/5 underline-offset-8">
                Connect
              </h3>
              
              <div className="space-y-12">
                {/* Email */}
                <div className="group">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-black/20 mb-2">Email Us</p>
                  <a href="mailto:hello@goodthingsco.ltd" className="font-poppins text-xl md:text-2xl font-black text-black hover:opacity-60 transition-opacity">
                    hello@goodthingsco.ltd
                  </a>
                </div>

                {/* WhatsApp Link (Priority) */}
                <div className="pt-2">
                   <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-black/20 mb-6">Immediate Response</p>
                   <a 
                    href="https://wa.me/2348028970296?text=Hello%20Good%20Things%20Co%2C%20I%20have%20a%20question..." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center md:justify-start gap-4 bg-white border border-green-500/10 px-8 py-5 rounded-[4px] shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all group"
                  >
                    <MessageCircle size={20} className="text-green-600 fill-green-600/10" />
                    <span className="font-poppins text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-green-700">Chat with us on WhatsApp</span>
                  </a>
                </div>

                {/* Follow Us */}
                <div className="space-y-6">
                   <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-black/20">Follow Our Journey</p>
                   <div className="flex justify-center md:justify-start gap-6">
                      <a href="#" className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm">
                        <Camera size={18} strokeWidth={1.5} />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm">
                        <X size={18} strokeWidth={1.5} />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm">
                        <MapPin size={18} strokeWidth={1.5} />
                      </a>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="bg-white/40 backdrop-blur-sm p-8 md:p-16 rounded-[2.5rem] relative overflow-hidden group border border-white/20 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-3 group">
                  <label className="font-poppins text-[9px] font-black uppercase tracking-widest text-black/30 group-focus-within:text-black transition-colors">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-black/10 py-3 text-black font-poppins text-base md:text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/10"
                    placeholder="e.g. Kolawole Davies"
                  />
                </div>
                <div className="space-y-3 group">
                  <label className="font-poppins text-[9px] font-black uppercase tracking-widest text-black/30 group-focus-within:text-black transition-colors">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-black/10 py-3 text-black font-poppins text-base md:text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/10"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="font-poppins text-[9px] font-black uppercase tracking-widest text-black/30 group-focus-within:text-black transition-colors">Reason for inquiry</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/10 py-3 font-poppins text-base md:text-sm focus:outline-none focus:border-black cursor-pointer appearance-none transition-all text-black"
                >
                  <option>Order Inquiry</option>
                  <option>Bulk Purchase</option>
                  <option>Media/Press</option>
                </select>
              </div>

              <div className="space-y-3 group">
                <label className="font-poppins text-[9px] font-black uppercase tracking-widest text-black/30 group-focus-within:text-black transition-colors">Your Message</label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/10 py-3 text-black font-poppins text-base md:text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/10 resize-none"
                  placeholder="How can we help you today?"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="relative overflow-hidden group w-full py-6 bg-black text-white font-poppins text-[10px] font-black uppercase tracking-[0.4em] transition-all cursor-pointer shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSending ? 'Sending Inquiry...' : 'Send Message'}
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                {/* Slide-up hover effect */}
                <div className="absolute inset-0 bg-neutral-800 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
