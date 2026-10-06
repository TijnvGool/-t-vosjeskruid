import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Herb, ProductType, ApplicationCategory, Order } from '../../types';
import { 
  Lock, LogOut, ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, 
  Package, ShoppingBag, AlertTriangle, TrendingUp, RefreshCw, Eye
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    navigate,
    products,
    herbs,
    orders,
    reviews,
    siteContent,
    addProduct,
    updateProduct,
    deleteProduct,
    addHerb,
    updateHerb,
    deleteHerb,
    updateSiteContent,
    updateOrderStatus,
    updateReviewStatus,
    deleteReview,
    resetToInitialData,
  } = useStore();

  // Login form state
  const [emailInput, setEmailInput] = useState('admin@vosjeskruid.nl');
  const [passwordInput, setPasswordInput] = useState('kruidentuin2026');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'herbs' | 'orders' | 'reviews' | 'content'>('overview');

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    subtitle: '',
    shortDescription: '',
    longDescription: '',
    price: 15.0,
    stock: 20,
    volume: '50 ml',
    productType: 'Tinctuur' as ProductType,
    applicationCategory: 'Rust & Slaap' as ApplicationCategory,
    herbIds: [] as string[],
    relatedProductIds: [] as string[],
    usageInstructions: '',
    ingredientsStr: '',
    imagesStr: '',
    featured: false,
    badge: '',
  });

  // Herb modal state
  const [herbModalOpen, setHerbModalOpen] = useState(false);
  const [editingHerb, setEditingHerb] = useState<Herb | null>(null);
  const [herbFormData, setHerbFormData] = useState({
    name: '',
    botanicalName: '',
    family: '',
    shortDescription: '',
    plantProfile: '',
    origin: '',
    harvestSeason: '',
    artisanGardenNotes: '',
    traditionalUsesStr: '',
    extractionMethodsStr: '',
    image: '',
  });

  // Content form state
  const [contentForm, setContentForm] = useState(siteContent);

  // Search in tables
  const [productSearch, setProductSearch] = useState('');

  // Selected order for detail view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // If not authenticated, render Login Screen
  if (!isAdminAuthenticated) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      loginAdmin(emailInput, passwordInput);
    };

    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-8 space-y-6 shadow-md text-center">
          <div className="w-12 h-12 bg-[#4A5D3E] text-white rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl text-[#1E2E1D]">Beheeromgeving Login</h1>
            <p className="text-xs text-[#6B7968]">
              Toegang uitsluitend voor de eigenares van 't Vosjeskruid.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left text-xs">
            <div className="space-y-1">
              <label className="block text-[#475744] font-medium">E-mailadres</label>
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#475744] font-medium">Wachtwoord</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white font-medium rounded transition-colors cursor-pointer"
            >
              Inloggen
            </button>
          </form>

          {/* Demo helper */}
          <div className="bg-[#F2ECE3] p-3 rounded text-[11px] text-[#556453] text-left space-y-1 border border-[#DDD3C3]">
            <p className="font-semibold text-[#293B27]">Voorbeeld inloggegevens:</p>
            <p>E-mail: <code>admin@vosjeskruid.nl</code></p>
            <p>Wachtwoord: <code>kruidentuin2026</code></p>
          </div>

          <button
            onClick={() => navigate('home')}
            className="text-xs text-[#52634F] hover:underline"
          >
            &larr; Terug naar de webshop
          </button>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Betaald' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;

  // Handlers for Product Edit
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      subtitle: '',
      shortDescription: '',
      longDescription: '',
      price: 14.50,
      stock: 25,
      volume: '50 ml',
      productType: 'Tinctuur',
      applicationCategory: 'Rust & Slaap',
      herbIds: [],
      relatedProductIds: [],
      usageInstructions: '3 maal daags 20 druppels in water.',
      ingredientsStr: 'Biologische alcohol, extract van gedroogde bloemen, bronwater',
      imagesStr: '/src/assets/images/product_tincture_amber_1791286167082.jpg',
      featured: false,
      badge: '',
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setProductFormData({
      name: p.name,
      subtitle: p.subtitle,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      price: p.price,
      stock: p.stock,
      volume: p.volume,
      productType: p.productType,
      applicationCategory: p.applicationCategory,
      herbIds: p.herbIds,
      relatedProductIds: p.relatedProductIds,
      usageInstructions: p.usageInstructions,
      ingredientsStr: p.ingredients.join(', '),
      imagesStr: p.images.join(', '),
      featured: !!p.featured,
      badge: p.badge || '',
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = productFormData.ingredientsStr.split(',').map(s => s.trim()).filter(Boolean);
    const images = productFormData.imagesStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productFormData.name,
        subtitle: productFormData.subtitle,
        shortDescription: productFormData.shortDescription,
        longDescription: productFormData.longDescription,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        inStock: Number(productFormData.stock) > 0,
        volume: productFormData.volume,
        productType: productFormData.productType,
        applicationCategory: productFormData.applicationCategory,
        herbIds: productFormData.herbIds,
        relatedProductIds: productFormData.relatedProductIds,
        usageInstructions: productFormData.usageInstructions,
        ingredients,
        images: images.length > 0 ? images : [editingProduct.images[0]],
        featured: productFormData.featured,
        badge: productFormData.badge,
      });
    } else {
      addProduct({
        slug: productFormData.name.toLowerCase().replace(/\s+/g, '-'),
        name: productFormData.name,
        subtitle: productFormData.subtitle,
        shortDescription: productFormData.shortDescription,
        longDescription: productFormData.longDescription,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        inStock: Number(productFormData.stock) > 0,
        volume: productFormData.volume,
        productType: productFormData.productType,
        applicationCategory: productFormData.applicationCategory,
        herbIds: productFormData.herbIds,
        relatedProductIds: productFormData.relatedProductIds,
        usageInstructions: productFormData.usageInstructions,
        ingredients,
        images: images.length > 0 ? images : ['/src/assets/images/product_tincture_amber_1791286167082.jpg'],
        featured: productFormData.featured,
        badge: productFormData.badge,
      });
    }
    setProductModalOpen(false);
  };

  // Handlers for Herb Edit
  const openNewHerbModal = () => {
    setEditingHerb(null);
    setHerbFormData({
      name: '',
      botanicalName: '',
      family: '',
      shortDescription: '',
      plantProfile: '',
      origin: 'Nederland, eigen tuin',
      harvestSeason: 'Juni - Augustus',
      artisanGardenNotes: '',
      traditionalUsesStr: '',
      extractionMethodsStr: 'Drogen voor thee, alcoholextractie',
      image: '/src/assets/images/hero_botanical_herbs_1791286124950.jpg',
    });
    setHerbModalOpen(true);
  };

  const openEditHerbModal = (h: Herb) => {
    setEditingHerb(h);
    setHerbFormData({
      name: h.name,
      botanicalName: h.botanicalName,
      family: h.family,
      shortDescription: h.shortDescription,
      plantProfile: h.plantProfile,
      origin: h.origin,
      harvestSeason: h.harvestSeason,
      artisanGardenNotes: h.artisanGardenNotes,
      traditionalUsesStr: h.traditionalUses.join('; '),
      extractionMethodsStr: h.extractionMethods.join('; '),
      image: h.image,
    });
    setHerbModalOpen(true);
  };

  const handleSaveHerb = (e: React.FormEvent) => {
    e.preventDefault();
    const traditionalUses = herbFormData.traditionalUsesStr.split(';').map(s => s.trim()).filter(Boolean);
    const extractionMethods = herbFormData.extractionMethodsStr.split(';').map(s => s.trim()).filter(Boolean);

    if (editingHerb) {
      updateHerb(editingHerb.id, {
        name: herbFormData.name,
        botanicalName: herbFormData.botanicalName,
        family: herbFormData.family,
        shortDescription: herbFormData.shortDescription,
        plantProfile: herbFormData.plantProfile,
        origin: herbFormData.origin,
        harvestSeason: herbFormData.harvestSeason,
        artisanGardenNotes: herbFormData.artisanGardenNotes,
        traditionalUses,
        extractionMethods,
        image: herbFormData.image || editingHerb.image,
      });
    } else {
      addHerb({
        slug: herbFormData.name.toLowerCase().replace(/\s+/g, '-'),
        name: herbFormData.name,
        botanicalName: herbFormData.botanicalName,
        family: herbFormData.family,
        shortDescription: herbFormData.shortDescription,
        plantProfile: herbFormData.plantProfile,
        origin: herbFormData.origin,
        harvestSeason: herbFormData.harvestSeason,
        artisanGardenNotes: herbFormData.artisanGardenNotes,
        traditionalUses,
        extractionMethods,
        image: herbFormData.image || '/src/assets/images/hero_botanical_herbs_1791286124950.jpg',
      });
    }
    setHerbModalOpen(false);
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(contentForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#52644B] uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4A5D3E]" />
            <span>Beheerdersmodus Actief</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D] mt-1">
            Atelier Beheerpaneel · {siteContent.brandName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="px-3.5 py-2 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#293B27] text-xs font-medium rounded-md border border-[#D5CDBD] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Naar Website</span>
          </button>

          <button
            onClick={resetToInitialData}
            className="p-2 text-[#7A643A] hover:bg-[#F2ECE3] rounded-md transition-colors cursor-pointer border border-[#D5CDBD]"
            title="Herstel begin-data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 bg-[#8E2A2B] hover:bg-[#782223] text-white text-xs font-medium rounded-md flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Uitloggen</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex overflow-x-auto border-b border-[#E8E2D9] gap-2 pb-px text-xs font-medium">
        {[
          { key: 'overview', label: 'Overzicht & KPI\'s' },
          { key: 'products', label: `Producten (${products.length})` },
          { key: 'herbs', label: `Kruiden (${herbs.length})` },
          { key: 'orders', label: `Bestellingen (${orders.length})` },
          { key: 'reviews', label: `Reviews (${reviews.length})` },
          { key: 'content', label: 'Content & Merkinrichting' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2.5 px-4 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-[#4A5D3E] text-white font-semibold'
                : 'text-[#4A5947] hover:bg-[#F2ECE3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERZICHT & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 5 Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 space-y-1">
              <span className="text-[11px] text-[#71806F] uppercase font-medium">Totale Omzet</span>
              <p className="font-serif text-2xl text-[#1E2E1D] font-medium tabular-nums">
                €{totalRevenue.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[#4A5D3E]">
                <TrendingUp className="w-3 h-3" />
                <span>Betaalde bestellingen</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 space-y-1">
              <span className="text-[11px] text-[#71806F] uppercase font-medium">Aantal Bestellingen</span>
              <p className="font-serif text-2xl text-[#1E2E1D] font-medium tabular-nums">
                {totalOrdersCount}
              </p>
              <p className="text-[11px] text-[#6B7968]">Alle tijd</p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 space-y-1">
              <span className="text-[11px] text-[#71806F] uppercase font-medium">Producten in Catalogus</span>
              <p className="font-serif text-2xl text-[#1E2E1D] font-medium tabular-nums">
                {totalProductsCount}
              </p>
              <p className="text-[11px] text-[#6B7968]">Over 7 types</p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 space-y-1">
              <span className="text-[11px] text-[#71806F] uppercase font-medium">Lage Voorraad (&le;5)</span>
              <p className="font-serif text-2xl text-[#A44A32] font-medium tabular-nums">
                {lowStockCount}
              </p>
              <p className="text-[11px] text-[#A44A32]">Bijna op</p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 space-y-1">
              <span className="text-[11px] text-[#71806F] uppercase font-medium">Uitverkocht (0 stuks)</span>
              <p className="font-serif text-2xl text-[#8E2A2B] font-medium tabular-nums">
                {outOfStockCount}
              </p>
              <p className="text-[11px] text-[#8E2A2B]">Herbereiding vereist</p>
            </div>
          </div>

          {/* Recent Orders table */}
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl text-[#1E2E1D]">Recente Bestellingen</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#4A5D3E] hover:underline font-medium"
              >
                Bekijk alle bestellingen &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D9] text-[#71806F] uppercase text-[10px]">
                    <th className="py-2.5">Bestelnummer</th>
                    <th className="py-2.5">Klant</th>
                    <th className="py-2.5">Datum</th>
                    <th className="py-2.5">Bedrag</th>
                    <th className="py-2.5">Betaalstatus</th>
                    <th className="py-2.5">Orderstatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F6F1E9]">
                      <td className="py-3 font-mono font-medium text-[#1E2E1D]">{ord.orderNumber}</td>
                      <td className="py-3 text-[#223321]">{ord.customer.fullName}</td>
                      <td className="py-3 text-[#6B7968]">{ord.date}</td>
                      <td className="py-3 font-medium tabular-nums">€{ord.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#E3EFE0] text-[#33562A] font-medium">
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
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

      {/* TAB 2: PRODUCTEN BEHEER */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Zoek in productlijst..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-white border border-[#D5CDBD] rounded-md px-3 py-1.5 text-xs text-[#1E2E1D]"
              />
            </div>

            <button
              onClick={openNewProductModal}
              className="px-4 py-2 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nieuw Product Toevoegen</span>
            </button>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2ECE3] border-b border-[#E2D9CC] text-[#556453] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Toepassing</th>
                    <th className="py-3 px-4">Prijs</th>
                    <th className="py-3 px-4">Voorraad</th>
                    <th className="py-3 px-4 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE4D8]">
                  {products
                    .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-[#F6F0E7]">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded bg-[#E4DDD0] shrink-0" />
                          <div>
                            <span className="font-medium text-[#1E2E1D] block">{p.name}</span>
                            <span className="text-[11px] text-[#71806F]">{p.volume}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#556553]">{p.productType}</td>
                        <td className="py-3 px-4 text-[#556553]">{p.applicationCategory}</td>
                        <td className="py-3 px-4 font-semibold text-[#1E2E1D] tabular-nums">
                          €{p.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                              className="w-16 bg-white border border-[#D5CDBD] rounded p-1 text-xs tabular-nums text-center"
                            />
                            <button
                              onClick={() => updateProduct(p.id, { stock: 0, inStock: false })}
                              className="text-[10px] text-[#8E2A2B] hover:underline cursor-pointer"
                              title="Zet voorraad direct op 0"
                            >
                              Zet uitverkocht
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1 text-[#4A5D3E] hover:bg-[#EAE2D5] rounded cursor-pointer"
                            title="Bewerken"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1 text-[#8E2A2B] hover:bg-[#EAE2D5] rounded cursor-pointer"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* TAB 3: KRUIDEN BEHEER */}
      {activeTab === 'herbs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#5D6B5A]">
              Beheer de planten in de botanische catalogus en koppel ze aan je winkelproducten.
            </p>
            <button
              onClick={openNewHerbModal}
              className="px-4 py-2 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nieuw Kruid Toevoegen</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {herbs.map((h) => (
              <div key={h.id} className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#EAE2D6]">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71806F]">{h.family}</span>
                    <h3 className="font-serif text-lg text-[#1E2E1D]">{h.name}</h3>
                    <p className="italic font-serif text-xs text-[#5D6D5B]">{h.botanicalName}</p>
                  </div>
                  <p className="text-xs text-[#5E6D5B] line-clamp-2">{h.shortDescription}</p>
                </div>

                <div className="pt-3 border-t border-[#EAE3D6] flex justify-between items-center text-xs">
                  <span className="text-[#4A5D3E]">{h.harvestSeason}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditHerbModal(h)}
                      className="p-1 text-[#4A5D3E] hover:bg-[#F2ECE3] rounded cursor-pointer"
                      title="Bewerken"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHerb(h.id)}
                      className="p-1 text-[#8E2A2B] hover:bg-[#F2ECE3] rounded cursor-pointer"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BESTELLINGEN BEHEER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2ECE3] border-b border-[#E2D9CC] text-[#556453] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Bestelnummer</th>
                    <th className="py-3 px-4">Klant</th>
                    <th className="py-3 px-4">Datum</th>
                    <th className="py-3 px-4">Bedrag</th>
                    <th className="py-3 px-4">Betaalstatus</th>
                    <th className="py-3 px-4">Orderstatus</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE4D8]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F6F0E7]">
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
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="bg-white border border-[#D5CDBD] rounded p-1 text-xs text-[#1E2E1D]"
                        >
                          <option value="Nieuw">Nieuw</option>
                          <option value="In behandeling">In behandeling</option>
                          <option value="Verzonden">Verzonden</option>
                          <option value="Afgerond">Afgerond</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1 text-[#4A5D3E] hover:bg-[#F2ECE3] rounded cursor-pointer"
                          title="Bekijk besteldetails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Card for Order Details */}
          {selectedOrder && (
            <div className="bg-[#FAF8F5] border border-[#4A5D3E] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3">
                <h3 className="font-serif text-xl text-[#1E2E1D]">
                  Bestelling {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs text-[#888] hover:text-black font-semibold"
                >
                  Sluiten &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="font-semibold text-[#1E2E1D] uppercase text-[11px] mb-1">Klantgegevens</h4>
                  <p>{selectedOrder.customer.fullName}</p>
                  <p>{selectedOrder.customer.email}</p>
                  <p>{selectedOrder.customer.phone}</p>
                  <p className="mt-2 text-[#71806F]">
                    {selectedOrder.customer.street} {selectedOrder.customer.houseNumber}, {selectedOrder.customer.postalCode} {selectedOrder.customer.city}
                  </p>
                  {selectedOrder.customer.notes && (
                    <p className="mt-2 italic text-[#71806F]">Opmerking: {selectedOrder.customer.notes}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-[#1E2E1D] uppercase text-[11px] mb-1">Verzending &amp; Track &amp; Trace</h4>
                  <p>Betaald via: {selectedOrder.paymentMethod}</p>
                  <div className="mt-2 space-y-1">
                    <label className="block text-[11px] text-[#556453]">Track &amp; Trace Code:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={selectedOrder.trackingCode || ''}
                        onBlur={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.orderStatus, e.target.value)}
                        placeholder="bijv. 3STEST9283748NL"
                        className="bg-white border border-[#D5CDBD] rounded p-1 text-xs flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="pt-3 border-t border-[#E8E2D9] space-y-2">
                <h4 className="font-semibold text-[#1E2E1D] uppercase text-[11px]">Artikelen</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[#F0EAE1]">
                    <span>{item.quantity}x {item.productName} ({item.volume})</span>
                    <span className="font-medium tabular-nums">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm text-[#1E2E1D] pt-2">
                  <span>Totaal</span>
                  <span className="tabular-nums">€{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REVIEWS BEHEER */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <p className="text-xs text-[#5D6B5A]">
            Hier kun je reviews goedkeuren, verbergen of verwijderen voor ze op de website verschijnen.
          </p>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 text-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-sm text-[#1E2E1D]">{rev.authorName}</span>
                    <span className="text-[#71806F] text-[11px] block">{rev.date} · Status: <strong>{rev.status}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'approved')}
                        className="px-2.5 py-1 bg-[#4A5D3E] text-white rounded text-[11px] cursor-pointer"
                      >
                        Goedkeuren
                      </button>
                    )}
                    {rev.status !== 'hidden' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'hidden')}
                        className="px-2.5 py-1 bg-[#EFE9DF] text-[#4A5947] rounded text-[11px] border border-[#D5CDBD] cursor-pointer"
                      >
                        Verbergen
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="px-2.5 py-1 bg-[#8E2A2B] text-white rounded text-[11px] cursor-pointer"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>

                <p className="font-serif text-sm font-medium text-[#1E2E1D]">"{rev.title}"</p>
                <p className="text-[#556553] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CONTENT & MERKINRICHTING */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveContent} className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="border-b border-[#E8E2D9] pb-4">
            <h2 className="font-serif text-2xl text-[#1E2E1D]">Website Content &amp; Merkinrichting</h2>
            <p className="text-xs text-[#6B7968]">
              Pas merknaam, hero-teksten, het 'Wie ben ik?' verhaal, afbeeldingen en banners aan.
            </p>
          </div>

          {/* Algemeen */}
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#1E2E1D] uppercase text-[11px]">Algemene Merkgegevens</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#475744] font-medium mb-1">Merknaam (placeholder)</label>
                <input
                  type="text"
                  value={contentForm.brandName}
                  onChange={(e) => setContentForm({ ...contentForm, brandName: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#475744] font-medium mb-1">Aankondigingsbanner</label>
                <input
                  type="text"
                  value={contentForm.announcementBar}
                  onChange={(e) => setContentForm({ ...contentForm, announcementBar: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Homepage Hero */}
          <div className="space-y-4 text-xs border-t border-[#E8E2D9] pt-6">
            <h3 className="font-semibold text-sm text-[#1E2E1D] uppercase text-[11px]">Homepage Hero Sectie</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#475744] font-medium mb-1">Hero Hoofdtitel</label>
                <input
                  type="text"
                  value={contentForm.hero.title}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    hero: { ...contentForm.hero, title: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#475744] font-medium mb-1">Hero Subtitel</label>
                <input
                  type="text"
                  value={contentForm.hero.subtitle}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    hero: { ...contentForm.hero, subtitle: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#475744] font-medium mb-1">Hero Afbeelding URL</label>
                <input
                  type="text"
                  value={contentForm.hero.image}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    hero: { ...contentForm.hero, image: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Wie ben ik */}
          <div className="space-y-4 text-xs border-t border-[#E8E2D9] pt-6">
            <h3 className="font-semibold text-sm text-[#1E2E1D] uppercase text-[11px]">"Wie ben ik?" Pagina</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#475744] font-medium mb-1">Titel</label>
                <input
                  type="text"
                  value={contentForm.about.title}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    about: { ...contentForm.about, title: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#475744] font-medium mb-1">Introductie</label>
                <textarea
                  rows={3}
                  value={contentForm.about.intro}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    about: { ...contentForm.about, intro: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#475744] font-medium mb-1">Persoonlijk Verhaal &amp; Waarom begonnen</label>
                <textarea
                  rows={4}
                  value={contentForm.about.personalStory}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    about: { ...contentForm.about, personalStory: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#475744] font-medium mb-1">Portretfoto URL</label>
                <input
                  type="text"
                  value={contentForm.about.heroImage}
                  onChange={(e) => setContentForm({
                    ...contentForm,
                    about: { ...contentForm.about, heroImage: e.target.value }
                  })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md cursor-pointer"
          >
            Sla Alle Wijzigingen Op
          </button>
        </form>
      )}

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-2xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3">
              <h3 className="font-serif text-xl text-[#1E2E1D]">
                {editingProduct ? `Product Bewerken: ${editingProduct.name}` : 'Nieuw Product Toevoegen'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-[#888] hover:text-black font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475744] font-medium mb-1">Productnaam *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Subtitel</label>
                  <input
                    type="text"
                    value={productFormData.subtitle}
                    onChange={(e) => setProductFormData({ ...productFormData, subtitle: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[#475744] font-medium mb-1">Prijs (€) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Voorraad (stuks) *</label>
                  <input
                    type="number"
                    required
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Volume/Inhoud</label>
                  <input
                    type="text"
                    value={productFormData.volume}
                    onChange={(e) => setProductFormData({ ...productFormData, volume: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Badge (optioneel)</label>
                  <input
                    type="text"
                    placeholder="bijv. Atelier Favoriet"
                    value={productFormData.badge}
                    onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475744] font-medium mb-1">Producttype</label>
                  <select
                    value={productFormData.productType}
                    onChange={(e) => setProductFormData({ ...productFormData, productType: e.target.value as any })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
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

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Toepassingscategorie</label>
                  <select
                    value={productFormData.applicationCategory}
                    onChange={(e) => setProductFormData({ ...productFormData, applicationCategory: e.target.value as any })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
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

              <div>
                <label className="block text-[#475744] font-medium mb-1">Korte omschrijving</label>
                <textarea
                  rows={2}
                  value={productFormData.shortDescription}
                  onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Uitgebreide beschrijving</label>
                <textarea
                  rows={4}
                  value={productFormData.longDescription}
                  onChange={(e) => setProductFormData({ ...productFormData, longDescription: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Gebruiksaanwijzing</label>
                <input
                  type="text"
                  value={productFormData.usageInstructions}
                  onChange={(e) => setProductFormData({ ...productFormData, usageInstructions: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Ingrediënten (door komma gescheiden)</label>
                <input
                  type="text"
                  value={productFormData.ingredientsStr}
                  onChange={(e) => setProductFormData({ ...productFormData, ingredientsStr: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Afbeeldingen (URLs gescheiden door komma)</label>
                <input
                  type="text"
                  value={productFormData.imagesStr}
                  onChange={(e) => setProductFormData({ ...productFormData, imagesStr: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              {/* Gekoppelde kruiden */}
              <div>
                <label className="block text-[#475744] font-medium mb-1">Koppel Botanische Kruiden:</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white border border-[#D5CDBD] rounded">
                  {herbs.map((h) => {
                    const isLinked = productFormData.herbIds.includes(h.id);
                    return (
                      <button
                        type="button"
                        key={h.id}
                        onClick={() => {
                          const newIds = isLinked
                            ? productFormData.herbIds.filter(id => id !== h.id)
                            : [...productFormData.herbIds, h.id];
                          setProductFormData({ ...productFormData, herbIds: newIds });
                        }}
                        className={`px-2 py-1 rounded text-[11px] border cursor-pointer ${
                          isLinked
                            ? 'bg-[#4A5D3E] text-white border-[#4A5D3E]'
                            : 'bg-[#F2ECE3] text-[#4A5947] border-[#D5CDBD]'
                        }`}
                      >
                        {h.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={productFormData.featured}
                  onChange={(e) => setProductFormData({ ...productFormData, featured: e.target.checked })}
                  className="rounded text-[#4A5D3E]"
                />
                <label htmlFor="featuredCheck" className="text-[#33442F] cursor-pointer">
                  Toon als Uitgelicht Product op Homepage
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-[#EFE9DF] text-[#4A5947] rounded cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4A5D3E] text-white rounded font-medium cursor-pointer"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HERB MODAL (ADD / EDIT) */}
      {herbModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-2xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3">
              <h3 className="font-serif text-xl text-[#1E2E1D]">
                {editingHerb ? `Kruid Bewerken: ${editingHerb.name}` : 'Nieuw Botanisch Kruid'}
              </h3>
              <button onClick={() => setHerbModalOpen(false)} className="text-[#888] hover:text-black font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveHerb} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475744] font-medium mb-1">Nederlandse Naam *</label>
                  <input
                    type="text"
                    required
                    value={herbFormData.name}
                    onChange={(e) => setHerbFormData({ ...herbFormData, name: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Latijnse Botanische Naam *</label>
                  <input
                    type="text"
                    required
                    value={herbFormData.botanicalName}
                    onChange={(e) => setHerbFormData({ ...herbFormData, botanicalName: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#475744] font-medium mb-1">Plantenfamilie</label>
                  <input
                    type="text"
                    value={herbFormData.family}
                    onChange={(e) => setHerbFormData({ ...herbFormData, family: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Herkomst</label>
                  <input
                    type="text"
                    value={herbFormData.origin}
                    onChange={(e) => setHerbFormData({ ...herbFormData, origin: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#475744] font-medium mb-1">Oogstseizoen</label>
                  <input
                    type="text"
                    value={herbFormData.harvestSeason}
                    onChange={(e) => setHerbFormData({ ...herbFormData, harvestSeason: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Korte omschrijving</label>
                <textarea
                  rows={2}
                  value={herbFormData.shortDescription}
                  onChange={(e) => setHerbFormData({ ...herbFormData, shortDescription: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Plantenprofiel &amp; Botanische Informatie</label>
                <textarea
                  rows={4}
                  value={herbFormData.plantProfile}
                  onChange={(e) => setHerbFormData({ ...herbFormData, plantProfile: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Teelt- &amp; Oogstnotities (persoonlijk van de eigenares)</label>
                <textarea
                  rows={3}
                  value={herbFormData.artisanGardenNotes}
                  onChange={(e) => setHerbFormData({ ...herbFormData, artisanGardenNotes: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Traditionele toepassingen (gescheiden door puntkomma ';')</label>
                <input
                  type="text"
                  value={herbFormData.traditionalUsesStr}
                  onChange={(e) => setHerbFormData({ ...herbFormData, traditionalUsesStr: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-[#475744] font-medium mb-1">Foto URL</label>
                <input
                  type="text"
                  value={herbFormData.image}
                  onChange={(e) => setHerbFormData({ ...herbFormData, image: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setHerbModalOpen(false)}
                  className="px-4 py-2 bg-[#EFE9DF] text-[#4A5947] rounded cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4A5D3E] text-white rounded font-medium cursor-pointer"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
