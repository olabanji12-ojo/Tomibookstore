import { Link } from 'react-router-dom';
import { Camera, Mail, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#ede9e1] py-24 px-8 md:px-12 border-t border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <h2 className="font-poppins text-2xl font-black tracking-widest text-black">
              BOOKSAW
            </h2>
            <p className="font-poppins text-xs text-black/50 leading-relaxed max-w-[200px]">
              Stories that stay with you. <br />
              Curated for the modern reader.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-8 items-center md:items-start">
            <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
              QUICK LINKS
            </h3>
            <nav className="flex flex-col gap-4 font-poppins text-[13px] font-medium text-black/60">
              <Link to="/" className="hover:text-black transition-colors cursor-pointer">Home</Link>
              <Link to="/contact" className="hover:text-black transition-colors cursor-pointer">Contact Us</Link>
            </nav>
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-8 items-center md:items-start">
            <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
              CONNECT
            </h3>
            <div className="flex justify-center md:justify-start gap-6">
              <a 
                href="https://www.instagram.com/shopgoodthingsco?igsh=cG12ZG5hMTkzN2U3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/40 hover:bg-black hover:text-white transition-all duration-300"
              >
                <Camera size={16} strokeWidth={1.5} />
              </a>
              <a 
                href="https://wa.me/2348028970296" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/40 hover:bg-black hover:text-white transition-all duration-300"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/40 hover:bg-black hover:text-white transition-all duration-300"
              >
                <Mail size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-8 items-center md:items-start">
            <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
              NEWSLETTER
            </h3>
            <div className="w-full max-w-sm md:max-w-none relative group">
              <input 
                type="email" 
                placeholder="Join the curated list"
                className="w-full bg-transparent border-b border-black/10 py-3 pr-10 font-poppins text-sm focus:border-black outline-none transition-colors"
                style={{ fontSize: '16px' }}
              />
              <button className="absolute right-0 bottom-3 text-black/20 hover:text-black transition-colors cursor-pointer">
                <Send size={18} strokeWidth={1.2} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-black/5 flex flex-col items-center gap-4 text-center">
          <p className="font-poppins text-[9px] tracking-[0.2em] uppercase text-black/30 font-bold">
            © 2026 BOOKSAW. Built by Olabanji.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
