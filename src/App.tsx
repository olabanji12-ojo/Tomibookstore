import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Personalize from './pages/Personalize';
import Journal from './pages/Journal';
import Shop from './pages/Shop';
import CheckoutModal from './components/modal/CheckoutModal';
import About from './pages/About';
import InfoPage from './pages/InfoPage';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import { useCart } from './context/CartContext';
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct';
import AdminOrders from './pages/AdminOrders';
import AdminRequests from './pages/AdminRequests';
import AdminSettings from './pages/AdminSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';
import type { Product } from './types';

const STORAGE_KEYS = {
  FORM: 'good_things_form_v1'
};

function App() {
  const isHydrated = useRef(false);
  const { cartItems, addToCart, removeFromCart, updateQuantity, totalItems, clearCart } = useCart();

  const DEFAULT_FORM = { 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: 'Ikeja', 
    state: 'Lagos',
    country: 'Nigeria',
    company: '',
    apartment: ''
  };
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM);
      return saved ? { ...DEFAULT_FORM, ...JSON.parse(saved) } : DEFAULT_FORM;
    } catch {
      return DEFAULT_FORM;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'cart' | 'quickview'>('cart');
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    isHydrated.current = true;
  }, []);

  // Sync Form to LocalStorage
  useEffect(() => {
    if (isHydrated.current) {
      localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(formData));
    }
  }, [formData]);

  const handleAddToCart = (product: Product, size?: string) => {
    addToCart(product, null, size);
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 1500);
  };

  const handleOpenCart = () => {
    setModalMode('cart');
    setFocusedProduct(null);
    setIsModalOpen(true);
  };

  const handleQuickView = (product: Product) => {
    setFocusedProduct(product);
    setModalMode('quickview');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setFormData({ 
      name: '', email: '', phone: '', address: '', city: 'Ikeja', state: 'Lagos', 
      country: 'Nigeria', company: '', apartment: '' 
    });
    localStorage.removeItem(STORAGE_KEYS.FORM);
  };

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowAnnouncement(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#f3f2ee] selection:bg-black selection:text-white">
        <Routes>
          {/* Main Site Routes */}
          <Route path="/*" element={
            <>
              {/* Sticky Header Container */}
              <div className="sticky top-0 z-[60] w-full">
                {/* Announcement Bar */}
                <AnimatePresence>
                  {showAnnouncement && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-black py-2.5 px-6 text-center relative z-[60] overflow-hidden"
                    >
                      <p className="font-mona text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.3em] pr-4">
                        Join the curated list & get 15% off your first purchase — <Link to="/contact" className="underline underline-offset-4 decoration-white/30">Claim now</Link>
                      </p>
                      <button 
                        onClick={() => setShowAnnouncement(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Navbar 
                  cartCount={totalItems} 
                  onCartClick={handleOpenCart}
                  isAdding={isAddingToCart}
                />
              </div>
              <Routes>
                <Route path="/" element={<Home onQuickView={handleQuickView} />} />
                <Route path="/shop" element={<Shop onQuickView={handleQuickView} />} />
                <Route path="/personalize" element={<Personalize />} />
                <Route path="/journal" element={<Journal onQuickView={handleQuickView} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping" element={<InfoPage />} />
                <Route path="/returns" element={<InfoPage />} />
                <Route path="/faq" element={<InfoPage />} />
              </Routes>
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/add" element={
            <ProtectedRoute>
              <AdminAddProduct />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute>
              <AdminEditProduct />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/requests" element={
            <ProtectedRoute>
              <AdminRequests />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
        </Routes>

        {isModalOpen && (
          <CheckoutModal 
            mode={modalMode}
            focusedBook={focusedProduct}
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            formData={formData}
            onFormDataChange={setFormData}
            onClose={handleCloseModal}
            onSuccess={handlePaymentSuccess}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;


{/* <style>
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&display=swap');
</style> */}


// .libre-bodoni-<uniquifier> {
//   font-family: "Libre Bodoni", serif;
//   font-optical-sizing: auto;
//   font-weight: <weight>;
//   font-style: normal;
// }

// Libre Bordoni for headlines
// Cormorant (just for accents or quotes)
// inter for body

{/* <style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&display=swap');
</style> */}


// .cormorant-<uniquifier> {
//   font-family: "Cormorant", serif;
//   font-optical-sizing: auto;
//   font-weight: <weight>;
//   font-style: normal;
// }

{/* <style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&display=swap');
</style> */}


// .inter-<uniquifier> {
//   font-family: "Inter", sans-serif;
//   font-optical-sizing: auto;
//   font-weight: <weight>;
//   font-style: normal;
// }

// are those 3 fonts from the same family??