import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'SHOP', href: '/shop' },
  { label: 'PERSONALIZE', href: '/personalize' },
  { label: 'JOURNAL', href: '/journal' },
  { label: 'CONTACT', href: '/contact' },
];

interface NavbarProps {
  cartCount?: number;
  onCartClick?: () => void;
  isAdding?: boolean;
}

const Navbar = ({ cartCount = 0, onCartClick, isAdding }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f3f2ee]">
      <div className="border-b border-black/[0.04]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[95px] flex items-center justify-between">
          
          <Link to="/" className="hover:opacity-70 transition-opacity">
            <img src="/goodthings-removebg-preview.png" alt="Good Things Co" className="h-28 md:h-32 w-auto object-contain" />
          </Link>

          {/* Right Side: Navigation & Cart */}
          <div className="flex items-center gap-6 md:gap-14 font-poppins h-full">
            <nav className="hidden md:flex items-center gap-14">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="text-[10px] tracking-[0.3em] uppercase font-bold text-black/45 hover:text-black transition-all duration-300 relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Cart Link (Always Visible) */}
            <button 
              onClick={onCartClick}
              className={`flex items-center gap-2 md:gap-3 text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-500 cursor-pointer md:border-l border-black/10 md:pl-14 relative h-full
                          ${isAdding ? 'text-green-600' : 'text-black hover:opacity-60'}`}
            >
              <AnimatePresence>
                {isAdding && (
                  <motion.span
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -25, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    className="absolute -top-1 md:-top-2 right-0 md:right-4 text-green-600 font-bold font-poppins text-[10px]"
                  >
                    +1
                  </motion.span>
                )}
              </AnimatePresence>
              
              <motion.div
                animate={isAdding ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative"
              >
                <ShoppingBag size={18} strokeWidth={isAdding ? 2.5 : 1.5} className="md:w-[14px] md:h-[14px]" />
                {cartCount > 0 && (
                  <span className="md:hidden absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold font-poppins">
                    {cartCount}
                  </span>
                )}
              </motion.div>
              
              <span className="hidden md:inline">CART ({cartCount})</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 -mr-2 text-black/60 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} strokeWidth={1.2} /> : <Menu size={22} strokeWidth={1.2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#f3f2ee] border-b border-black/[0.04] px-8 py-10 z-40 shadow-xl"
          >
            <div className="flex flex-col gap-8 font-poppins text-center md:text-left">
              {NAV_LINKS.map(({ label, href }) => (
                <Link 
                   key={label} 
                   to={href} 
                   className="text-xs tracking-[0.3em] uppercase font-bold text-black/60 hover:text-black transition-colors" 
                   onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;