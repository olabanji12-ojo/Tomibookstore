import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Personalize from './pages/Personalize';
import Journal from './pages/Journal';
import Shop from './pages/Shop';
import CheckoutModal from './components/modal/CheckoutModal';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import { useCart } from './context/CartContext';
import type { Product } from './types';

const STORAGE_KEYS = {
  FORM: 'good_things_form_v1'
};

function App() {
  const isHydrated = useRef(false);
  const { cartItems, addToCart, removeFromCart, updateQuantity, totalItems, clearCart } = useCart();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM);
      return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', address: '', city: '', state: '' };
    } catch {
      return { name: '', email: '', phone: '', address: '', city: '', state: '' };
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
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
    setFormData({ name: '', email: '', phone: '', address: '', city: '', state: '' });
    localStorage.removeItem(STORAGE_KEYS.FORM);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#f3f2ee] selection:bg-black selection:text-white">
        <Navbar 
          cartCount={totalItems} 
          onCartClick={handleOpenCart}
          isAdding={isAddingToCart}
        />

        <Routes>
          <Route path="/" element={
            <Home 
              onQuickView={handleQuickView} 
            />
          } />
          <Route path="/shop" element={
            <Shop 
              onQuickView={handleQuickView} 
            />
          } />
          <Route path="/personalize" element={<Personalize />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />

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