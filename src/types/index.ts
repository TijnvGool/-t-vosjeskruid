export type ProductType = 
  | 'Tinctuur' 
  | 'Zalf' 
  | 'Kruidenthee' 
  | 'Olie & Maceraat' 
  | 'Balsem' 
  | 'Crème' 
  | 'Kruidenzakje & Bad';

export type ApplicationCategory = 
  | 'Rust & Slaap'
  | 'Weerstand & Luchtwegen'
  | 'Huid & Verzorging'
  | 'Spijsvertering & Buik'
  | 'Spieren & Gewrichten'
  | 'Vitaliteit & Focus';

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  stock: number;
  inStock: boolean;
  volume: string; // e.g. "50 ml", "100 g", "60 gram"
  productType: ProductType;
  applicationCategory: ApplicationCategory;
  herbIds: string[]; // Linked herbs from botanical catalog
  relatedProductIds: string[]; // "Dit past goed bij"
  usageInstructions: string;
  ingredients: string[];
  additionalInfo?: string;
  images: string[];
  featured?: boolean;
  badge?: string; // e.g. "Met liefde geoogst", "Seizoensfavoriet"
  rating: number;
  reviewCount: number;
}

export interface Herb {
  id: string;
  slug: string;
  name: string;
  botanicalName: string;
  family: string;
  shortDescription: string;
  plantProfile: string;
  origin: string;
  traditionalUses: string[];
  extractionMethods: string[];
  artisanGardenNotes: string; // From the herbalist's own garden
  harvestSeason: string;
  image: string;
  linkedProductIds?: string[];
}

export interface Review {
  id: string;
  productId: string; // 'general' or a specific product id
  authorName: string;
  location?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  volume: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Betaald' | 'In afwachting' | 'Geannuleerd';
  orderStatus: 'Nieuw' | 'In behandeling' | 'Verzonden' | 'Afgerond';
  trackingCode?: string;
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  announcementBar: string;
  hero: {
    title: string;
    subtitle: string;
    intro: string;
    image: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  about: {
    title: string;
    subtitle: string;
    heroImage: string;
    intro: string;
    personalStory: string;
    gardenStory: string;
    dryingStory: string;
    craftingStory: string;
    knowledgeVision: string;
    signatureName: string;
    signatureRole: string;
  };
  contact: {
    email: string;
    phone: string;
    atelierAddress: string;
    atelierCity: string;
    pickupHours: string;
    kvk: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
