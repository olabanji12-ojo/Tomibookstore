import { useState } from 'react';
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

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'cart' | 'quickview'>('cart');
  const [focusedBook, setFocusedBook] = useState<Book | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Persistent Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

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
    
    // Trigger Navbar Feedback
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
    setCartItems([]);
    // Do not close immediately so they see the success screen in the modal
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

        {/* CheckoutModal handles its own AnimatePresence interior logic */}
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