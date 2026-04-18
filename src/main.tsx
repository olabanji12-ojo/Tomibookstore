import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Toaster position="bottom-right" reverseOrder={false} />
    </CartProvider>
  </StrictMode>,
)
