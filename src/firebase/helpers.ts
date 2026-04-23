import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query,
  where,
  orderBy,
  Timestamp,
  increment,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { db, auth } from './config';
import type { Product, Order, OrderStatus, PersonalizationRequest } from '../types';

// ==================== UTILS ====================

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

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
      slug: productData.slug || generateSlug(productData.name),
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
        image: data.image || (data.images && data.images[0]) || data.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image',
        category: data.category || 'Uncategorized',
        price: Number(data.price) || 0,
        slug: data.slug || generateSlug(data.name || data.title || ''),
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

export const getProductById = async (id: string) => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(doc(db, 'products', id));
    if (docSnap.exists()) {
      return { success: true, product: { id: docSnap.id, ...docSnap.data() } as Product };
    }
    return { success: false, error: 'Product not found' };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    // Robust sanitization: Remove any undefined values to prevent Firebase "Unsupported field value: undefined" error
    const updateData: any = { updatedAt: Timestamp.now() };
    Object.keys(data).forEach(key => {
      if ((data as any)[key] !== undefined) {
        updateData[key] = (data as any)[key];
      }
    });

    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    }
    
    await updateDoc(doc(db, 'products', id), updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error };
  }
};

export const decrementProductStock = async (id: string, quantity: number) => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      stock: increment(-quantity),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error decrementing stock:', error);
    return { success: false, error };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'products', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error };
  }
};

// ==================== PERSONALIZATION HELPERS ====================

export const createPersonalizationRequest = async (requestData: Omit<PersonalizationRequest, 'id' | 'createdAt' | 'status'>) => {
  try {
    const docRef = await addDoc(collection(db, 'personalization_requests'), {
      ...requestData,
      status: 'New',
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating request:', error);
    return { success: false, error };
  }
};

export const getPersonalizationRequests = async () => {
  try {
    const q = query(collection(db, 'personalization_requests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const requests: PersonalizationRequest[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as PersonalizationRequest);
    });
    return { success: true, requests };
  } catch (error) {
    console.error('Error getting requests:', error);
    return { success: false, requests: [] };
  }
};

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = async () => {
  try {
    const [productsRes, ordersRes, requestsRes] = await Promise.all([
      getProducts(),
      getOrders(),
      getPersonalizationRequests()
    ]);

    const pendingOrders = ordersRes.orders?.filter(o => o.status === 'Pending').length || 0;
    const newRequests = requestsRes.requests?.filter(r => r.status === 'New').length || 0;
    const productsCount = productsRes.products?.length || 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = ordersRes.orders
      ?.filter(o => {
        const orderDate = o.createdAt?.toDate();
        return orderDate && orderDate >= today;
      })
      .reduce((sum, o) => sum + o.total, 0) || 0;

    return {
      success: true,
      stats: {
        todayRevenue,
        pendingOrders,
        newRequests,
        productsCount
      }
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, stats: null };
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

export const registerUser = async (email: string, pass: string, fullName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      role: 'client', // Default role
      createdAt: Timestamp.now()
    });
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Registration failed:', error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email: string, pass: string) => {
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

export const getUserRole = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, role: userDoc.data().role };
    }
    return { success: false, role: 'client' };
  } catch (error) {
    return { success: false, role: 'client' };
  }
};

// ==================== SETTINGS HELPERS ====================

export const getSiteSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, settings: docSnap.data() };
    }
    // Default fallback settings
    return { 
      success: true, 
      settings: {
        manifesto: "\"We only stock what we love. Everything else is just noise.\"",
        hero_tagline: "Thoughtful goods for inspired living.",
        hero_headline: "CURATED FOR LIFE"
      } 
    };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateSiteSettings = async (data: any) => {
  try {
    await setDoc(doc(db, 'settings', 'global'), { ...data, updatedAt: Timestamp.now() }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
