import { Link } from 'react-router-dom';
import { Camera, X, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#eeebe4] py-20 px-8 md:px-12 border-t border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <h2 className="font-poppins text-2xl font-black tracking-widest text-black">
              BOOKSAW
            </h2>
            <p className="font-poppins text-xs text-black/50 leading-relaxed max-w-[200px]">
              Curated stories for the modern reader. <br />
              Delivered across Nigeria.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-8 items-center md:items-start">
            <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
              EXPLORE
            </h3>
            <nav className="flex flex-col gap-4 font-poppins text-[13px] font-medium text-black/60">
              <Link to="/" className="hover:text-black transition-colors cursor-pointer">Home</Link>
              <Link to="/contact" className="hover:text-black transition-colors cursor-pointer">Contact Us</Link>
            </nav>
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-8 items-center md:items-start">
            <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
              FOLLOW US
            </h3>
            <div className="flex flex-col gap-4 font-poppins text-[13px] font-medium text-black/60">
              <a href="#" className="flex items-center gap-3 hover:text-black transition-colors cursor-pointer">
                <Camera size={14} strokeWidth={1.5} /> Instagram
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-black transition-colors cursor-pointer">
                <X size={14} strokeWidth={1.5} /> Twitter (X)
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-black transition-colors cursor-pointer">
                <MessageCircle size={14} strokeWidth={1.5} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-8 items-center md:items-start">
            <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
              NEWSLETTER
            </h3>
            <div className="w-full max-w-sm md:max-w-none relative">
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-black/10 py-3 pr-10 font-poppins text-sm focus:border-black outline-none transition-colors"
                style={{ fontSize: '16px' }} // Prevent mobile zoom
              />
              <button className="absolute right-0 bottom-3 text-black/20 hover:text-black transition-colors cursor-pointer">
                <Send size={18} strokeWidth={1.2} />
              </button>
            </div>
            <p className="font-poppins text-[9px] text-black/30 tracking-widest uppercase">
              Get the latest arrivals in your inbox.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-black/5 flex flex-col items-center gap-4 text-center">
          <p className="font-poppins text-[10px] tracking-[0.2em] uppercase text-black/30 font-bold">
            © 2026 BOOKSAW. Built by Emman.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
