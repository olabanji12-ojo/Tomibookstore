import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import CheckoutModal from './components/modal/CheckoutModal';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import type { Book } from './types';

export interface CartItem {
  book: Book;
  quantity: number;
}

const STORAGE_KEYS = {
  CART: 'booksaw_cart_v1',
  FORM: 'booksaw_form_v1'
};

function App() {
  const isHydrated = useRef(false);

  // Initialize state from LocalStorage (Lazy)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM);
      return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', address: '' };
    } catch {
      return { name: '', email: '', phone: '', address: '' };
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'cart' | 'quickview'>('cart');
  const [focusedBook, setFocusedBook] = useState<Book | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Mark as hydrated after mount
  useEffect(() => {
    isHydrated.current = true;
  }, []);

  // Sync Cart to LocalStorage (Guard against first-render overwrite)
  useEffect(() => {
    if (isHydrated.current) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Sync Form to LocalStorage (Guard against first-render overwrite)
  useEffect(() => {
    if (isHydrated.current) {
      localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(formData));
    }
  }, [formData]);

  const handleAddToCart = (book: Book) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
    
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 1500);
  };

  const updateQuantity = (bookId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.book.id === bookId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (bookId: string) => {
    setCartItems(prev => prev.filter(item => item.book.id !== bookId));
  };

  const handleOpenCart = () => {
    setModalMode('cart');
    setFocusedBook(null);
    setIsModalOpen(true);
  };

  const handleQuickView = (book: Book) => {
    setFocusedBook(book);
    setModalMode('quickview');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePaymentSuccess = () => {
    // Clear State
    setCartItems([]);
    setFormData({ name: '', email: '', phone: '', address: '' });
    
    // Clear Storage
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.FORM);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#f3f2ee] selection:bg-black selection:text-white">
        <Navbar 
          cartCount={totalCartCount} 
          onCartClick={handleOpenCart}
          isAdding={isAddingToCart}
        />

        <Routes>
          <Route path="/" element={
            <Home 
              onAddToCart={handleAddToCart} 
              onQuickView={handleQuickView} 
            />
          } />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />

        {isModalOpen && (
          <CheckoutModal 
            mode={modalMode}
            focusedBook={focusedBook}
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