import React, { useState } from 'react';
import { useStore, AdminTab } from '../../context/StoreContext';
import { isFirebaseConfigured } from '../../services/firebaseAuth';
import { Product, ProductType, ApplicationCategory } from '../../types';
import { 
  LayoutDashboard, 
  Package, 
  Leaf, 
  ShoppingBag, 
  Star,
  Globe, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    adminUser,
    logoutAdminAsync,
    navigate,
    products,
    herbs,
    orders,
    reviews,
    siteContent,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  // Product CRUD Modal & Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formPrice, setFormPrice] = useState('14.95');
  const [formStock, setFormStock] = useState('25');
  const [formVolume, setFormVolume] = useState('50 ml');
  const [formProductType, setFormProductType] = useState<ProductType>('Tinctuur');
  const [formCategory, setFormCategory] = useState<ApplicationCategory>('Rust & Slaap');
  const [formUsage, setFormUsage] = useState('');
  const [formIngredients, setFormIngredients] = useState('Goudsbloem, Biologische alcohol, Bronwater');
  const [formImage, setFormImage] = useState('images/products/tinctuur.svg');
  const [formInStock, setFormInStock] = useState(true);

  const openNewProductModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormSubtitle('Ambachtelijk bereid in Brabant');
    setFormShortDesc('');
    setFormLongDesc('');
    setFormPrice('14.95');
    setFormStock('25');
    setFormVolume('50 ml');
    setFormProductType('Tinctuur');
    setFormCategory('Rust & Slaap');
    setFormUsage('Neem 15-20 druppels in een beetje water, 2 tot 3 keer per dag.');
    setFormIngredients('Biologische kruiden, Bronwater, Alcohol 35%');
    setFormImage('images/products/tinctuur.svg');
    setFormInStock(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormSubtitle(p.subtitle || '');
    setFormShortDesc(p.shortDescription || '');
    setFormLongDesc(p.longDescription || '');
    setFormPrice(p.price.toString());
    setFormStock(p.stock.toString());
    setFormVolume(p.volume || '50 ml');
    setFormProductType(p.productType || 'Tinctuur');
    setFormCategory(p.applicationCategory || 'Rust & Slaap');
    setFormUsage(p.usageInstructions || '');
    setFormIngredients((p.ingredients || []).join(', '));
    setFormImage(p.images?.[0] || 'images/products/tinctuur.svg');
    setFormInStock(p.inStock ?? true);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const ingredientsList = formIngredients.split(',').map(s => s.trim()).filter(Boolean);
    const parsedPrice = parseFloat(formPrice) || 10.0;
    const parsedStock = parseInt(formStock, 10) || 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        subtitle: formSubtitle,
        shortDescription: formShortDesc,
        longDescription: formLongDesc,
        price: parsedPrice,
        stock: parsedStock,
        volume: formVolume,
        productType: formProductType,
        applicationCategory: formCategory,
        usageInstructions: formUsage,
        ingredients: ingredientsList,
        images: [formImage],
        inStock: formInStock,
      });
    } else {
      addProduct({
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: formName,
        subtitle: formSubtitle,
        shortDescription: formShortDesc,
        longDescription: formLongDesc,
        price: parsedPrice,
        stock: parsedStock,
        inStock: formInStock,
        volume: formVolume,
        productType: formProductType,
        applicationCategory: formCategory,
        herbIds: [],
        relatedProductIds: [],
        usageInstructions: formUsage,
        ingredients: ingredientsList,
        images: [formImage],
        badge: 'Ambachtelijk',
      });
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Weet je zeker dat je "${name}" wilt verwijderen uit de webshop?`)) {
      deleteProduct(id);
    }
  };

  const toggleProductStock = (p: Product) => {
    updateProduct(p.id, { inStock: !p.inStock });
  };

  const handleTabClick = (tab: AdminTab) => {
    setAdminTab(tab);
    setMobileMenuOpen(false);
    // Sync browser path to /admin/tab
    const path = tab === 'dashboard' ? '/admin/dashboard' : `/admin/${tab}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  const handleLogout = async () => {
    await logoutAdminAsync();
  };

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Producten', icon: Package },
    { id: 'herbs', label: 'Kruiden', icon: Leaf },
    { id: 'orders', label: 'Bestellingen', icon: ShoppingBag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'website', label: 'Website & Inhoud', icon: Globe },
    { id: 'settings', label: 'Instellingen', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col md:flex-row text-[#243323]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#1E2E1D] text-[#FAF8F5] px-4 py-3.5 flex items-center justify-between border-b border-[#2C3E2A] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#89C07E]" />
          <span className="font-serif text-lg font-medium text-white tracking-tight">
            't Vosjeskruid Beheer
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#D5DFD3] hover:text-white rounded-md cursor-pointer"
          aria-label="Open beheer navigatie"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#1E2E1D] text-[#EDE7DC] flex flex-col justify-between border-r border-[#2B3E28] transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand Header & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-[#2C3E29]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#2E422B] text-[#A6C09C] flex items-center justify-center border border-[#3E553A]">
                <Leaf className="w-5 h-5 text-[#92B887]" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-white tracking-tight leading-none">
                  't Vosjeskruid
                </h2>
                <span className="text-[11px] text-[#A8B7A4] block mt-1 uppercase tracking-wider font-medium">
                  Beheeromgeving
                </span>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav aria-label="Beheerdersnavigatie" className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const isActive = adminTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#33472F] text-white shadow-xs font-semibold'
                      : 'text-[#C5D0C2] hover:bg-[#283C25] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#89C07E]' : 'text-[#9CB096]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: User, View Site, Logout */}
        <div className="p-4 border-t border-[#2C3E29] bg-[#192718] space-y-2">
          {/* Active user badge */}
          {adminUser?.email && (
            <div className="px-3 py-2 bg-[#223321] rounded-lg border border-[#2E422C] text-[11px] text-[#B0BFAD] truncate">
              <span className="text-[9px] uppercase tracking-wider text-[#7E917B] block font-semibold">
                Ingelogd als
              </span>
              <span className="text-white truncate block font-medium">
                {adminUser.email}
              </span>
            </div>
          )}

          {/* Terug naar de website button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('home');
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#D8E2D5] hover:text-white hover:bg-[#283C25] rounded-lg transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-[#9CB096]" />
              <span>Terug naar de website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-[#778B72]" />
          </button>

          {/* Uitloggen button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-[#E59898] hover:text-[#FFA8A8] hover:bg-[#351E1E] rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E59898]" />
            <span>Uitloggen</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar on desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#FAF8F5] border-b border-[#E3DBD0]">
          <div className="flex items-center gap-2 text-xs text-[#52644B]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Beheer</span>
            <span>/</span>
            <span className="capitalize text-[#1E2E1D] font-medium">
              {navItems.find(n => n.id === adminTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {firebaseReady ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F3E6] text-[#2F5426] text-[11px] font-medium border border-[#CFE5CC]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Firebase Beveiligd</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4EFE6] text-[#7A643A] text-[11px] font-medium border border-[#E5DACB]">
                <Clock className="w-3.5 h-3.5" />
                <span>Fase 1 Beheerdersessie</span>
              </span>
            )}

            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#3E523A] hover:text-[#1E2E1D] hover:bg-[#EBE5DC] rounded-lg transition-colors cursor-pointer border border-[#DCD3C5]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Terug naar de website</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8E2A2B] hover:text-[#B33537] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer border border-[#F3CECE]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Uitloggen</span>
            </button>
          </div>
        </header>

        {/* Content Views */}
        <div className="p-4 sm:p-8 max-w-6xl w-full">
          {/* TAB 1: DASHBOARD VIEW */}
          {adminTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Welcome Banner */}
              <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
                  Welkom bij 't Vosjeskruid
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl text-[#1E2E1D] font-medium">
                  Beheer hier straks eenvoudig je producten, kruiden en website-inhoud.
                </h1>
                <p className="text-xs sm:text-sm text-[#5D6B5A] max-w-2xl leading-relaxed pt-1">
                  Dit is de basisomgeving (Fase 1) van het beheerpaneel. Alle onderdelen hieronder worden in de volgende fase gekoppeld aan live bewerkingsfuncties.
                </p>
              </div>

              {/* Five Core Overview Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Producten Tile */}
                <div
                  onClick={() => handleTabClick('products')}
                  className="bg-white border border-[#E0D7CB] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-[#71806F] font-semibold tabular-nums">
                        {products.length} artikelen
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                        Producten
                      </h3>
                      <p className="text-xs text-[#61715F] leading-relaxed mt-1">
                        Overzicht van je handgemaakte tincturen, zalven, kruidentheeën en balsems.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] mt-4 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                    <span>Bekijk overzicht</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Kruiden Tile */}
                <div
                  onClick={() => handleTabClick('herbs')}
                  className="bg-white border border-[#E0D7CB] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-[#71806F] font-semibold tabular-nums">
                        {herbs.length} kruiden
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                        Kruiden
                      </h3>
                      <p className="text-xs text-[#61715F] leading-relaxed mt-1">
                        Botanische kennisbank met plantenprofielen, Latijnse namen en teeltnotities.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] mt-4 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                    <span>Bekijk catalogus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Bestellingen Tile */}
                <div
                  onClick={() => handleTabClick('orders')}
                  className="bg-white border border-[#E0D7CB] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-[#71806F] font-semibold tabular-nums">
                        {orders.length} geplaatst
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                        Bestellingen
                      </h3>
                      <p className="text-xs text-[#61715F] leading-relaxed mt-1">
                        Inzicht in binnengekomen klantbestellingen, pakbonnen en verzendstatussen.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] mt-4 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                    <span>Bekijk bestellingen</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Reviews Tile */}
                <div
                  onClick={() => handleTabClick('reviews')}
                  className="bg-white border border-[#E0D7CB] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-[#71806F] font-semibold tabular-nums">
                        {reviews.length} reviews
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                        Reviews
                      </h3>
                      <p className="text-xs text-[#61715F] leading-relaxed mt-1">
                        Modereer klantervaringen, keur nieuwe beoordelingen goed en bewaak de betrouwbaarheid.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] mt-4 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                    <span>Bekijk reviews</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 5. Website Tile */}
                <div
                  onClick={() => handleTabClick('website')}
                  className="bg-white border border-[#E0D7CB] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-[#71806F] font-medium">
                        Live website
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                        Website &amp; Inhoud
                      </h3>
                      <p className="text-xs text-[#61715F] leading-relaxed mt-1">
                        Hero-teksten, het 'Wie ben ik?' verhaal, banners en atelier-contactgegevens.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] mt-4 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                    <span>Bekijk inhoud</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 6. Instellingen Tile */}
                <div
                  onClick={() => handleTabClick('settings')}
                  className="bg-white border border-[#E0D7CB] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-[#71806F] font-medium">
                        Beveiliging
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                        Instellingen
                      </h3>
                      <p className="text-xs text-[#61715F] leading-relaxed mt-1">
                        Firebase Authentication status, Vercel omgevingsvariabelen en accountbeheer.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] mt-4 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                    <span>Bekijk configuratie</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Status Note on Phase 1 */}
              <div className="bg-[#EFE9DF] border border-[#DDD3C2] rounded-xl p-5 flex items-start gap-3.5 text-xs text-[#4E5E4C]">
                <CheckCircle2 className="w-5 h-5 text-[#4A5D3E] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-[#1E2E1D]">Fase 1 Beveiliging &amp; Routing Actief</h4>
                  <p className="leading-relaxed">
                    De route <code>/admin</code> is nu volledig beveiligd en werkt rechtstreeks bij handmatig intypen op Vercel zonder 404-fouten. In de volgende fase bouwen we de interactieve CMS-knoppen voor het direct aanmaken en bewerken van producten.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTEN VIEW */}
          {adminTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#1E2E1D]">Productbeheer</h2>
                  <p className="text-xs text-[#5D6B5A]">
                    Beheer alle producten van 't Vosjeskruid. Wijzigingen worden direct opgeslagen in de database.
                  </p>
                </div>

                <button
                  onClick={openNewProductModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A5D3E] text-white rounded-xl text-xs font-medium hover:bg-[#3B4C30] transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nieuw product toevoegen</span>
                </button>
              </div>

              <div className="bg-white border border-[#E0D7CB] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#556453] uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Categorie</th>
                        <th className="py-3 px-4">Prijs</th>
                        <th className="py-3 px-4">Voorraad</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE1]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-[#E4DDD0] shrink-0 border border-[#E0D7CB]" />
                            <div>
                              <span className="font-medium text-[#1E2E1D] block">{p.name}</span>
                              <span className="text-[11px] text-[#71806F]">{p.volume} · {p.subtitle}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#556553] font-medium">{p.productType}</td>
                          <td className="py-3 px-4 text-[#556553]">{p.applicationCategory}</td>
                          <td className="py-3 px-4 font-semibold text-[#1E2E1D] tabular-nums">
                            €{p.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 tabular-nums">
                            <span className={p.stock < 5 ? 'text-amber-700 font-semibold' : 'text-[#243323]'}>
                              {p.stock} stuks
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleProductStock(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ${
                                p.inStock !== false && p.stock > 0
                                  ? 'bg-[#E3EFE0] text-[#33562A] hover:bg-[#d4e4d0]'
                                  : 'bg-[#FBEBEB] text-[#8C3A3A] hover:bg-[#f6dfdf]'
                              }`}
                              title="Klik om te activeren/deactiveren"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${p.inStock !== false && p.stock > 0 ? 'bg-[#33562A]' : 'bg-[#8C3A3A]'}`} />
                              {p.inStock !== false && p.stock > 0 ? 'Actief' : 'Uitverkocht'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 bg-[#FAF8F5] border border-[#D5CDBD] text-[#4A5D3E] hover:bg-[#4A5D3E] hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                              title="Bewerken"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 bg-[#FAF8F5] border border-[#EED7D7] text-[#9E3A3A] hover:bg-[#9E3A3A] hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                              title="Verwijderen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KRUIDEN VIEW */}
          {adminTab === 'herbs' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#1E2E1D]">Botanische Kruidencatalogus</h2>
                  <p className="text-xs text-[#5D6B5A]">
                    {herbs.length} planten en medicinale kruiden uit onze Brabantse tuin.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBD] text-[#4A5947] rounded-lg text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#7A643A]" />
                  <span>Binnenkort beschikbaar: Kruiden toevoegen &amp; plantprofiel bewerken</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {herbs.map((h) => (
                  <div key={h.id} className="bg-white border border-[#E0D7CB] rounded-xl p-4 space-y-3">
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#EAE2D6]">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71806F] uppercase">{h.family}</span>
                      <h3 className="font-serif text-lg text-[#1E2E1D]">{h.name}</h3>
                      <p className="italic font-serif text-xs text-[#5D6D5B]">{h.botanicalName}</p>
                      <p className="text-xs text-[#61715F] line-clamp-2 mt-1">{h.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BESTELLINGEN VIEW */}
          {adminTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#1E2E1D]">Bestellingenoverzicht</h2>
                  <p className="text-xs text-[#5D6B5A]">
                    {orders.length} geregistreerde bestellingen via de webshop checkout.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBD] text-[#4A5947] rounded-lg text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#7A643A]" />
                  <span>Binnenkort beschikbaar: Pakbonnen printen &amp; Track &amp; Trace koppelen</span>
                </div>
              </div>

              <div className="bg-white border border-[#E0D7CB] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#556453] uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Bestelnummer</th>
                        <th className="py-3 px-4">Klant</th>
                        <th className="py-3 px-4">Datum</th>
                        <th className="py-3 px-4">Bedrag</th>
                        <th className="py-3 px-4">Betaalstatus</th>
                        <th className="py-3 px-4">Orderstatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE1]">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 px-4 font-mono font-medium text-[#1E2E1D]">{ord.orderNumber}</td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#1E2E1D] block">{ord.customer.fullName}</span>
                            <span className="text-[11px] text-[#71806F]">{ord.customer.city}</span>
                          </td>
                          <td className="py-3 px-4 text-[#6B7968]">{ord.date}</td>
                          <td className="py-3 px-4 font-semibold text-[#1E2E1D] tabular-nums">
                            €{ord.total.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#E3EFE0] text-[#33562A] font-medium">
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#EFE9DF] text-[#4A5947] font-medium">
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS VIEW */}
          {adminTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#1E2E1D]">Klantbeoordelingen &amp; Ervaringen</h2>
                  <p className="text-xs text-[#5D6B5A]">
                    {reviews.length} reviews van klanten · Gemiddelde waardering: 4.9 van 5.0 sterren.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBD] text-[#4A5947] rounded-lg text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#7A643A]" />
                  <span>Binnenkort beschikbaar: Reviews goedkeuren, modereren &amp; verbergen</span>
                </div>
              </div>

              <div className="bg-white border border-[#E0D7CB] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#556453] uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Klant</th>
                        <th className="py-3 px-4">Product / Kruid</th>
                        <th className="py-3 px-4">Waardering</th>
                        <th className="py-3 px-4">Datum</th>
                        <th className="py-3 px-4">Ervaring</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE1]">
                      {reviews.map((r) => {
                        const matchedProduct = products.find(p => p.id === r.productId);
                        return (
                          <tr key={r.id} className="hover:bg-[#FAF8F5]">
                            <td className="py-3 px-4 font-medium text-[#1E2E1D]">{r.authorName}</td>
                            <td className="py-3 px-4 text-[#556553]">
                              {matchedProduct ? matchedProduct.name : 'Algemene review'}
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#8C6D2B]">
                              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                            </td>
                            <td className="py-3 px-4 text-[#6B7968]">{r.date}</td>
                            <td className="py-3 px-4 text-[#475744] max-w-sm truncate" title={r.comment}>
                              "{r.comment}"
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-[#E3EFE0] text-[#33562A] font-medium">
                                {r.status === 'approved' ? 'Zichtbaar' : 'Wachtend'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WEBSITE VIEW */}
          {adminTab === 'website' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#1E2E1D]">Website &amp; Inhoud</h2>
                  <p className="text-xs text-[#5D6B5A]">
                    Teksten, afbeeldingen, banners en contactgegevens van 't Vosjeskruid.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBD] text-[#4A5947] rounded-lg text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#7A643A]" />
                  <span>Binnenkort beschikbaar: CMS-editor voor teksten &amp; foto's</span>
                </div>
              </div>

              <div className="bg-white border border-[#E0D7CB] rounded-2xl p-6 sm:p-8 space-y-5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#71806F] block">Merknaam</span>
                  <p className="font-serif text-lg text-[#1E2E1D]">{siteContent.brandName}</p>
                </div>

                <div className="border-t border-[#F0EAE1] pt-4">
                  <span className="text-[10px] uppercase font-semibold text-[#71806F] block">Homepage Hero Boodschap</span>
                  <p className="font-serif text-base text-[#1E2E1D]">{siteContent.hero.title}</p>
                  <p className="text-[#61715F] mt-1">{siteContent.hero.subtitle}</p>
                </div>

                <div className="border-t border-[#F0EAE1] pt-4">
                  <span className="text-[10px] uppercase font-semibold text-[#71806F] block">Aankondigingsbalk</span>
                  <p className="text-[#1E2E1D]">{siteContent.announcementBar}</p>
                </div>

                <div className="border-t border-[#F0EAE1] pt-4">
                  <span className="text-[10px] uppercase font-semibold text-[#71806F] block">Wie ben ik? Introductie</span>
                  <p className="text-[#61715F] leading-relaxed">{siteContent.about.intro}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INSTELLINGEN & FIREBASE */}
          {adminTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="font-serif text-2xl text-[#1E2E1D]">Instellingen &amp; Beveiliging</h2>
                <p className="text-xs text-[#5D6B5A]">
                  Configuratie van Firebase Authentication en beheerderstoegang.
                </p>
              </div>

              <div className="bg-white border border-[#E0D7CB] rounded-2xl p-6 sm:p-8 space-y-6 text-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1E2E1D]">Firebase Authentication</h3>
                    <p className="text-[#61715F] leading-relaxed mt-1">
                      {firebaseReady
                        ? 'Firebase Authentication is actief verbonden. Je beheerderaccount is veilig geauthenticeerd via de officiële Firebase SDK.'
                        : 'Firebase Authentication architectuur is gereed. Om jouw eigen Firebase project te verbinden, volg je onderstaande 3 stappen.'}
                    </p>
                  </div>
                </div>

                {/* Step by step guide */}
                <div className="border-t border-[#F0EAE1] pt-4 space-y-4">
                  <h4 className="font-semibold text-[#1E2E1D] text-xs uppercase tracking-wider">
                    Stappenplan: Eerste beheerder instellen in Firebase &amp; Vercel
                  </h4>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] space-y-1">
                      <p className="font-semibold text-[#223321]">1. Maak een gratis Firebase Project aan</p>
                      <p className="text-[#556453] leading-relaxed">
                        Ga naar <strong>console.firebase.google.com</strong> en klik op <em>Add project</em> (bijv. 'vosjeskruid-webshop'). Registreer een Web App (klik op het &lt;/&gt; icoon) om je configuratiesleutels te ontvangen.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] space-y-1">
                      <p className="font-semibold text-[#223321]">2. Schakel Email/Password authenticatie in &amp; maak beheerder aan</p>
                      <p className="text-[#556453] leading-relaxed">
                        Ga in het Firebase menu naar <strong>Build &gt; Authentication &gt; Sign-in method</strong> en schakel <em>Email/Password</em> in. Ga vervolgens naar het tabblad <strong>Users</strong> en klik op <em>Add user</em> om jouw eigen e-mailadres en een sterk wachtwoord in te stellen.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] space-y-1">
                      <p className="font-semibold text-[#223321]">3. Voeg de variabelen toe aan Vercel</p>
                      <p className="text-[#556453] leading-relaxed">
                        Ga in je Vercel Dashboard naar: <strong>Project &gt; Settings &gt; Environment Variables</strong> en voeg de 6 variabelen toe:
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-[#DFD7CB] font-mono text-[11px] text-[#283C25] space-y-1 mt-2">
                        <div>VITE_FIREBASE_API_KEY = "jouw_api_sleutel"</div>
                        <div>VITE_FIREBASE_AUTH_DOMAIN = "jouw-project.firebaseapp.com"</div>
                        <div>VITE_FIREBASE_PROJECT_ID = "jouw-project-id"</div>
                        <div>VITE_FIREBASE_STORAGE_BUCKET = "jouw-project.appspot.com"</div>
                        <div>VITE_FIREBASE_MESSAGING_SENDER_ID = "123456789"</div>
                        <div>VITE_FIREBASE_APP_ID = "1:123456789:web:abcdef"</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#F0EAE1] pt-4 flex items-center justify-between text-[11px] text-[#71806F]">
                  <span>Beveiligingsstandaard: ISO/IEC 27001 conform via Google Firebase Identity</span>
                  <span className="font-semibold text-[#4A5D3E]">Geen wachtwoorden opgeslagen in code</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E0D7CB] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-[#E8E2D9] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFE9DF] text-[#4A5D3E] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl text-[#1E2E1D]">
                  {editingProductId ? 'Product bewerken' : 'Nieuw product toevoegen'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-[#71806F] hover:text-[#1E2E1D] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Productnaam *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Bijv. Vlierbes & Echinacea Tinctuur"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Subtitel / Korte kenmerk</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="Bijv. Natuurlijke weerstand"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Prijs (€) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Voorraad (stuks) *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Eenheid / Inhoud *</label>
                  <input
                    type="text"
                    required
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value)}
                    placeholder="Bijv. 50 ml of 100 g"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Producttype</label>
                  <select
                    value={formProductType}
                    onChange={(e) => setFormProductType(e.target.value as ProductType)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  >
                    <option value="Tinctuur">Tinctuur</option>
                    <option value="Zalf">Zalf</option>
                    <option value="Kruidenthee">Kruidenthee</option>
                    <option value="Olie & Maceraat">Olie &amp; Maceraat</option>
                    <option value="Balsem">Balsem</option>
                    <option value="Crème">Crème</option>
                    <option value="Kruidenzakje & Bad">Kruidenzakje &amp; Bad</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Categorie / Toepassing</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ApplicationCategory)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  >
                    <option value="Rust & Slaap">Rust &amp; Slaap</option>
                    <option value="Weerstand & Luchtwegen">Weerstand &amp; Luchtwegen</option>
                    <option value="Huid & Verzorging">Huid &amp; Verzorging</option>
                    <option value="Spijsvertering & Buik">Spijsvertering &amp; Buik</option>
                    <option value="Spieren & Gewrichten">Spieren &amp; Gewrichten</option>
                    <option value="Vitaliteit & Focus">Vitaliteit &amp; Focus</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-[#1E2E1D]">Korte beschrijving</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Korte samenvatting voor in de productkaart..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-[#1E2E1D]">Volledige beschrijving</label>
                <textarea
                  rows={3}
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  placeholder="Uitgebreide werking, achtergrond en eigenschappen..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-[#1E2E1D]">Ingrediënten (komma-gescheiden)</label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  placeholder="Bijv. Goudsbloem, Biologische alcohol, Bronwater"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-[#1E2E1D]">Gebruik &amp; Toepassing</label>
                <input
                  type="text"
                  value={formUsage}
                  onChange={(e) => setFormUsage(e.target.value)}
                  placeholder="Bijv. 15 druppels in water innemen..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="block font-medium text-[#1E2E1D]">Afbeeldingsreferentie / Pad</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="images/products/tinctuur.svg"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-[#1E2E1D] focus:outline-none focus:border-[#4A5D3E]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="inStockCheck"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A5D3E] focus:ring-[#4A5D3E]"
                  />
                  <label htmlFor="inStockCheck" className="font-medium text-[#1E2E1D] cursor-pointer">
                    Direct actief in webshop
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#D5CDBD] text-[#556453] rounded-xl font-medium hover:bg-[#F0EAE1] cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4A5D3E] text-white rounded-xl font-medium hover:bg-[#3B4C30] cursor-pointer shadow-xs"
                >
                  {editingProductId ? 'Wijzigingen opslaan' : 'Product toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
