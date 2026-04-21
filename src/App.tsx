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
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminOrders from './pages/AdminOrders';
import ProtectedRoute from './components/admin/ProtectedRoute';
import type { Product } from './types';

const STORAGE_KEYS = {
  FORM: 'good_things_form_v1'
};

function App() {
  const isHydrated = useRef(false);
  const { cartItems, addToCart, removeFromCart, updateQuantity, totalItems, clearCart } = useCart();

  const DEFAULT_FORM = { name: '', email: '', phone: '', address: '', city: '', state: '' };
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
        <Routes>
          {/* Main Site Routes */}
          <Route path="/*" element={
            <>
              <Navbar 
                cartCount={totalItems} 
                onCartClick={handleOpenCart}
                isAdding={isAddingToCart}
              />
              <Routes>
                <Route path="/" element={<Home onQuickView={handleQuickView} />} />
                <Route path="/shop" element={<Shop onQuickView={handleQuickView} />} />
                <Route path="/personalize" element={<Personalize />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/contact" element={<Contact />} />
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
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <AdminOrders />
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