import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Herb, Review, Order, SiteContent, CartItem, ApplicationCategory, ProductType } from '../types';
import { initialProducts, initialHerbs, initialReviews, initialOrders, initialSiteContent } from '../data/mockData';
import { resolveImageUrl } from '../assets/images';

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
  | 'admin';

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

  // Admin Auth
  isAdminAuthenticated: boolean;
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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS) || localStorage.getItem('vosjeskruid_products_v1');
      if (!saved) return initialProducts;
      const parsed: Product[] = JSON.parse(saved);
      return parsed.map(p => ({
        ...p,
        images: (p.images || []).map(img => resolveImageUrl(img))
      }));
    } catch {
      return initialProducts;
    }
  });

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

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

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
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

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

  // URL hash navigation support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product/')) {
        const pId = hash.replace('product/', '');
        setSelectedProductId(pId);
        setCurrentRoute('product-detail');
      } else if (hash.startsWith('kruid/')) {
        const hId = hash.replace('kruid/', '');
        setSelectedHerbId(hId);
        setCurrentRoute('herb-detail');
      } else if (hash === 'admin') {
        setCurrentRoute('admin');
      } else if (['home', 'products', 'herbs', 'about', 'contact', 'checkout', 'assistant'].includes(hash)) {
        setCurrentRoute(hash as Route);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (route: Route, params?: { productId?: string; herbId?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
      window.location.hash = `product/${params.productId}`;
    } else if (params?.herbId) {
      setSelectedHerbId(params.herbId);
      window.location.hash = `kruid/${params.herbId}`;
    } else {
      window.location.hash = route === 'home' ? '' : route;
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

  // Admin Auth
  const loginAdmin = (email: string, pass: string): boolean => {
    // Verified admin demo password check
    if (
      (email.trim().toLowerCase() === 'admin@vosjeskruid.nl' || email.trim().toLowerCase() === 'admin') &&
      (pass === 'kruidentuin2026' || pass === 'admin')
    ) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      showToast('Succesvol ingelogd in het beheerpaneel', 'success');
      return true;
    }
    showToast('Onjuist e-mailadres of wachtwoord', 'warn');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    showToast('Uitgelogd uit beheerpaneel', 'info');
  };

  // CRUD Product
  const addProduct = (data: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...data,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" succesvol aangemaakt`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product succesvol bijgewerkt');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product verwijderd', 'info');
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
