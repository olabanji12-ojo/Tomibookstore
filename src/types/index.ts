export interface ProductVariant {
  size?: string;
  style?: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  author?: string; // Kept for book compatibility
  price: number;
  stock?: number;
  description: string;
  images: string[];
  image: string; // Kept for backward compatibility with existing components
  category: string;
  subCategory?: string;
  functions?: string[];
  colors?: string[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
  featured?: boolean;
  availableSizes?: string[];
  fitInfo?: string;
  styleWithIds?: string[];
  createdAt?: any;
}

// Keeping Book as an alias for now to prevent breaking existing components
export type Book = Product;

export type OrderStatus = 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'idle' | 'success';

export interface Order {
  id?: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentRef: string;
  createdAt: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant | null;
  selectedSize?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant | null, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  totalItems: number;
}

export interface PersonalizationRequest {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productType: string;
  description: string;
  imageUrl?: string;
  status: 'New' | 'Quoted' | 'Approved' | 'In Progress' | 'Completed';
  quotedPrice?: number;
  estimatedDays?: number;
  adminNotes?: string;
  createdAt: any;
}
