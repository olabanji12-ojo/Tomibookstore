import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { db, auth } from './config';
import type { Product, Order, OrderStatus } from '../types';

// ==================== CLOUDINARY UPLOAD HELPERS ====================
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload multiple images to Cloudinary
 */
export const uploadProductImages = async (files: File[]) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.warn('Cloudinary credentials missing');
    return { success: false, urls: [] };
  }

  try {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'goodthings-products');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      urls.push(data.secure_url);
    }
    return { success: true, urls };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, urls: [] };
  }
};

// ==================== PRODUCT HELPERS ====================

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error };
  }
};

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: doc.id, 
        ...data,
        name: data.name || data.title || 'Untitled Product',
        image: data.image || (data.images && data.images[0]) || data.imageUrl || '',
        category: data.category || 'Uncategorized',
        price: Number(data.price) || 0
      } as Product);
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error getting products:', error);
    return { success: false, products: [] };
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', category)); 
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error getting category products:', error);
    return { success: false, products: [] };
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug)); 
    const snap = await getDocs(q);
    if (snap.empty) return { success: false, error: 'Not found' };
    const d = snap.docs[0];
    return { success: true, product: { id: d.id, ...d.data() } as Product };
  } catch (error) {
    return { success: false, error };
  }
};

// ==================== ORDER HELPERS ====================

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: Timestamp.now(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error };
    }
  };

export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return { success: true, orders };
  } catch (error) {
    return { success: false, orders: [] };
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  try {
    await updateDoc(doc(db, 'orders', id), { status, updatedAt: Timestamp.now() });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// ==================== PERSONALIZATION HELPERS ====================

export const submitPersonalizationRequest = async (requestData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'personalization_requests'), {
      ...requestData,
      status: 'New',
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
};
// ==================== AUTH HELPERS ====================

export const registerAdmin = async (email: string, pass: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Registration failed:', error);
    return { success: false, error: error.message };
  }
};

export const loginAdmin = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Login failed:', error);
    return { success: false, error: error.message };
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
