import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Herb, Review, Order, SiteContent, CartItem, ApplicationCategory, ProductType } from '../types';
import { initialProducts, initialHerbs, initialReviews, initialOrders, initialSiteContent } from '../data/mockData';
import { resolveImageUrl } from '../assets/images';
import { 
  signInAdmin, 
  signOutAdmin, 
  getActiveAdminSession, 
  subscribeToAuthChanges,
  db
} from '../services/firebaseAuth';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

export type Route = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'herbs' 
  | 'herb-detail' 
  | 'about' 
  | 'contact' 
  | 'checkout' 
  | 'order-success' 
  | 'assistant' 
  | 'admin'
  | 'admin-dashboard';

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'herbs' 
  | 'orders' 
  | 'reviews' 
  | 'website' 
  | 'settings';

interface Toast {
  text: string;
  type: 'success' | 'info' | 'warn';
}

interface StoreContextType {
  // Navigation & routing
  currentRoute: Route;
  navigate: (route: Route, params?: { productId?: string; herbId?: string }) => void;
  selectedProductId: string | null;
  selectedHerbId: string | null;
  activeCategoryFilter: ApplicationCategory | 'all';
  setActiveCategoryFilter: (cat: ApplicationCategory | 'all') => void;
  activeTypeFilter: ProductType | 'all';
  setActiveTypeFilter: (type: ProductType | 'all') => void;
  activeHerbFilter: string | 'all';
  setActiveHerbFilter: (herbId: string | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartItemCount: number;

  // Assistant modal
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;

  // Data
  products: Product[];
  herbs: Herb[];
  reviews: Review[];
  orders: Order[];
  siteContent: SiteContent;
  latestOrder: Order | null;

  // Admin Auth & State
  isAdminAuthenticated: boolean;
  adminUser: { email: string | null; uid: string } | null;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  loginAdminAsync: (email: string, pass: string) => Promise<{ email: string | null; uid: string }>;
  logoutAdminAsync: () => Promise<void>;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addHerb: (herb: Omit<Herb, 'id'>) => void;
  updateHerb: (id: string, updates: Partial<Herb>) => void;
  deleteHerb: (id: string) => void;
  updateSiteContent: (updates: Partial<SiteContent>) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], tracking?: string) => void;
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;
  resetToInitialData: () => void;
  resolveImageUrl: (path?: string | null) => string;

  // Toast
  toast: Toast | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warn') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'vosjeskruid_products_v2',
  HERBS: 'vosjeskruid_herbs_v2',
  REVIEWS: 'vosjeskruid_reviews_v2',
  ORDERS: 'vosjeskruid_orders_v2',
  CONTENT: 'vosjeskruid_content_v2',
  CART: 'vosjeskruid_cart_v2',
  ADMIN_AUTH: 'vosjeskruid_admin_auth_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('p-9');
  const [selectedHerbId, setSelectedHerbId] = useState<string | null>('goudsbloem');

  // Filters
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ApplicationCategory | 'all'>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<ProductType | 'all'>('all');
  const [activeHerbFilter, setActiveHerbFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('vosjeskruid_cart_v1');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: (item.product?.images || []).map(img => resolveImageUrl(img))
        }
      }));
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Entities with fallback and automatic image resolution
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Firestore Products Sync & One-time Migration
  useEffect(() => {
    const colRef = collection(db, 'products');

    getDocs(colRef).then(snapshot => {
      if (snapshot.empty) {
        initialProducts.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            console.error('Error seeding product:', p.id, e);
          }
        });
      }
    }).catch(err => {
      console.error('Error checking products collection in Firestore:', err);
    });

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Product;
        items.push({
          ...data,
          id: docSnap.id,
          images: (data.images || []).map(img => resolveImageUrl(img))
        });
      });
      if (items.length > 0) {
        setProducts(items);
      }
    }, (error) => {
      console.error('Firestore products snapshot error:', error);
      showToast('Kan geen verbinding maken met Firestore database voor producten.', 'warn');
    });

    return () => unsubscribe();
  }, []);

  const [herbs, setHerbs] = useState<Herb[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERBS) || localStorage.getItem('vosjeskruid_herbs_v1');
      if (!saved) return initialHerbs;
      const parsed: Herb[] = JSON.parse(saved);
      return parsed.map(h => ({
        ...h,
        image: resolveImageUrl(h.image)
      }));
    } catch {
      return initialHerbs;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS) || localStorage.getItem('vosjeskruid_reviews_v1');
      return saved ? JSON.parse(saved) : initialReviews;
    } catch {
      return initialReviews;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS) || localStorage.getItem('vosjeskruid_orders_v1');
      if (!saved) return initialOrders;
      const parsed: Order[] = JSON.parse(saved);
      return parsed.map(o => ({
        ...o,
        items: (o.items || []).map(i => ({
          ...i,
          image: resolveImageUrl(i.image)
        }))
      }));
    } catch {
      return initialOrders;
    }
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT) || localStorage.getItem('vosjeskruid_content_v1');
      if (!saved) return initialSiteContent;
      const parsed: SiteContent = JSON.parse(saved);
      return {
        ...parsed,
        hero: {
          ...parsed.hero,
          image: resolveImageUrl(parsed.hero?.image)
        },
        about: {
          ...parsed.about,
          heroImage: resolveImageUrl(parsed.about?.heroImage)
        }
      };
    } catch {
      return initialSiteContent;
    }
  });

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Admin Auth & State
  const [adminUser, setAdminUser] = useState<{ email: string | null; uid: string } | null>(() => getActiveAdminSession());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => Boolean(getActiveAdminSession()));
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((state) => {
      setAdminUser(state.user);
      setIsAdminAuthenticated(state.isAuthenticated);
    });
    return () => unsubscribe();
  }, []);

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Persist handlers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERBS, JSON.stringify(herbs));
  }, [herbs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(siteContent));
  }, [siteContent]);

  // URL routing & path synchronization
  useEffect(() => {
    const handleUrlSync = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
      const hash = window.location.hash.replace('#', '');

      // Deep links via hash (e.g. #product/p-1, #kruid/salie)
      if (hash.startsWith('product/')) {
        const pId = hash.replace('product/', '');
        setSelectedProductId(pId);
        setCurrentRoute('product-detail');
        return;
      }
      if (hash.startsWith('kruid/')) {
        const hId = hash.replace('kruid/', '');
        setSelectedHerbId(hId);
        setCurrentRoute('herb-detail');
        return;
      }

      // Real pathname: /admin or /admin/dashboard
      if (pathname.startsWith('/admin')) {
        const subRoute = pathname.replace('/admin', '').replace(/^\/+/, '');
        
        if (isAdminAuthenticated) {
          if (['dashboard', 'products', 'herbs', 'orders', 'reviews', 'website', 'settings'].includes(subRoute)) {
            setAdminTab(subRoute as AdminTab);
          } else {
            setAdminTab('dashboard');
          }
          setCurrentRoute('admin-dashboard');
          if (pathname === '/admin') {
            window.history.replaceState(null, '', '/admin/dashboard');
          }
        } else {
          // Unauthenticated user attempting to view /admin/dashboard -> redirect to /admin login
          if (pathname !== '/admin') {
            window.history.replaceState(null, '', '/admin');
          }
          setCurrentRoute('admin');
        }
        return;
      }

      // Hash fallback for admin
      if (hash === 'admin' || hash === 'admin-dashboard') {
        if (isAdminAuthenticated) {
          window.history.replaceState(null, '', '/admin/dashboard');
          setCurrentRoute('admin-dashboard');
        } else {
          window.history.replaceState(null, '', '/admin');
          setCurrentRoute('admin');
        }
        return;
      }

      // Public site routes
      if (pathname === '/producten' || pathname === '/products' || hash === 'products') {
        setCurrentRoute('products');
        return;
      }
      if (pathname === '/kruiden' || pathname === '/herbs' || hash === 'herbs') {
        setCurrentRoute('herbs');
        return;
      }
      if (pathname === '/wie-ben-ik' || pathname === '/about' || hash === 'about') {
        setCurrentRoute('about');
        return;
      }
      if (pathname === '/contact' || hash === 'contact') {
        setCurrentRoute('contact');
        return;
      }
      if (pathname === '/afrekenen' || pathname === '/checkout' || hash === 'checkout') {
        setCurrentRoute('checkout');
        return;
      }
      if (pathname === '/assistant' || hash === 'assistant') {
        setCurrentRoute('products');
        setIsAssistantOpen(true);
        return;
      }

      // Root path '/'
      setCurrentRoute('home');
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, [isAdminAuthenticated]);

  const navigate = (route: Route, params?: { productId?: string; herbId?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
      window.location.hash = `product/${params.productId}`;
    } else if (params?.herbId) {
      setSelectedHerbId(params.herbId);
      window.location.hash = `kruid/${params.herbId}`;
    } else if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (route === 'admin-dashboard') {
      window.history.pushState(null, '', '/admin/dashboard');
    } else if (route === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${route}`);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name}" toegevoegd aan mandje`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Admin Auth - Secure Firebase Authentication (No hardcoded credentials)
  const loginAdminAsync = async (email: string, pass: string): Promise<{ email: string | null; uid: string }> => {
    try {
      const user = await signInAdmin(email, pass);
      setAdminUser(user);
      setIsAdminAuthenticated(true);
      showToast('Succesvol ingelogd in het beheerpaneel', 'success');
      window.history.pushState(null, '', '/admin/dashboard');
      setCurrentRoute('admin-dashboard');
      return user;
    } catch (err: any) {
      const errorMsg = err?.message || 'Inloggen mislukt. Controleer je gegevens.';
      showToast(errorMsg, 'warn');
      throw err;
    }
  };

  const logoutAdminAsync = async (): Promise<void> => {
    await signOutAdmin();
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    showToast('Uitgelogd uit beheerpaneel', 'info');
    window.history.pushState(null, '', '/admin');
    setCurrentRoute('admin');
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    loginAdminAsync(email, pass).catch(() => {});
    return true;
  };

  const logoutAdmin = () => {
    logoutAdminAsync();
  };

  // CRUD Product (Firestore)
  const addProduct = async (data: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    try {
      const newId = `p-${Date.now()}`;
      const newProduct: Product = {
        ...data,
        id: newId,
        rating: 5.0,
        reviewCount: 0,
      };
      await setDoc(doc(db, 'products', newId), newProduct);
      showToast('Product toegevoegd', 'success');
    } catch (err: any) {
      console.error('Error adding product to Firestore:', err);
      showToast(`Fout bij toevoegen product: ${err?.message || 'Onbekende fout'}`, 'warn');
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updates);
      showToast('Product opgeslagen', 'success');
    } catch (err: any) {
      console.error('Error updating product in Firestore:', err);
      showToast(`Fout bij opslaan product: ${err?.message || 'Onbekende fout'}`, 'warn');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      showToast('Product verwijderd', 'info');
    } catch (err: any) {
      console.error('Error deleting product from Firestore:', err);
      showToast(`Fout bij verwijderen product: ${err?.message || 'Onbekende fout'}`, 'warn');
      throw err;
    }
  };

  // CRUD Herb
  const addHerb = (data: Omit<Herb, 'id'>) => {
    const newHerb: Herb = {
      ...data,
      id: data.slug || `herb-${Date.now()}`,
    };
    setHerHerbs:
    setHerbs(prev => [newHerb, ...prev]);
    showToast(`Kruid "${newHerb.name}" toegevoegd aan botanische catalogus`);
  };

  const updateHerb = (id: string, updates: Partial<Herb>) => {
    setHerbs(prev =>
      prev.map(h => (h.id === id ? { ...h, ...updates } : h))
    );
    showToast('Botanische kruidengegevens bijgewerkt');
  };

  const deleteHerb = (id: string) => {
    setHerbs(prev => prev.filter(h => h.id !== id));
    showToast('Kruid verwijderd uit catalogus', 'info');
  };

  // CRUD Content
  const updateSiteContent = (updates: Partial<SiteContent>) => {
    setSiteContent(prev => ({ ...prev, ...updates }));
    showToast('Site content en instellingen opgeslagen');
  };

  // Orders
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `VK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('nl-NL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setOrders(prev => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], tracking?: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: status, trackingCode: tracking ?? o.trackingCode } : o))
    );
    showToast(`Order status gewijzigd naar: ${status}`);
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'approved', // Auto-approved for friendly flow, can be managed in admin
    };
    setReviews(prev => [newReview, ...prev]);
    showToast('Bedankt voor je review!', 'success');
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Review status bijgewerkt naar: ${status}`);
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review verwijderd', 'info');
  };

  const resetToInitialData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.HERBS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CONTENT);
    setProducts(initialProducts);
    setHerbs(initialHerbs);
    setReviews(initialReviews);
    setOrders(initialOrders);
    setSiteContent(initialSiteContent);
    showToast('Alle voorbeelddata hersteld naar beginstatus', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentRoute,
        navigate,
        selectedProductId,
        selectedHerbId,
        activeCategoryFilter,
        setActiveCategoryFilter,
        activeTypeFilter,
        setActiveTypeFilter,
        activeHerbFilter,
        setActiveHerbFilter,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartItemCount,
        isAssistantOpen,
        setIsAssistantOpen,
        products,
        herbs,
        reviews,
        orders,
        siteContent,
        latestOrder,
        isAdminAuthenticated,
        adminUser,
        adminTab,
        setAdminTab,
        loginAdminAsync,
        logoutAdminAsync,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addHerb,
        updateHerb,
        deleteHerb,
        updateSiteContent,
        updateOrderStatus,
        addOrder,
        addReview,
        updateReviewStatus,
        deleteReview,
        resetToInitialData,
        resolveImageUrl,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
