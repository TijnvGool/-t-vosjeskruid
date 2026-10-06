import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductType, ApplicationCategory } from '../../types';
import { resolveImageUrl } from '../../assets/images';
import { Search, ShoppingBag, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export const ProductListView: React.FC = () => {
  const {
    products,
    herbs,
    navigate,
    addToCart,
    activeCategoryFilter,
    setActiveCategoryFilter,
    activeTypeFilter,
    setActiveTypeFilter,
    activeHerbFilter,
    setActiveHerbFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const productTypes: ProductType[] = [
    'Tinctuur',
    'Zalf',
    'Kruidenthee',
    'Olie & Maceraat',
    'Balsem',
    'Crème',
    'Kruidenzakje & Bad',
  ];

  const applications: ApplicationCategory[] = [
    'Rust & Slaap',
    'Weerstand & Luchtwegen',
    'Huid & Verzorging',
    'Spijsvertering & Buik',
    'Spieren & Gewrichten',
    'Vitaliteit & Focus',
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesIngredients = p.ingredients.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIngredients) return false;
      }

      // Type filter
      if (activeTypeFilter !== 'all' && p.productType !== activeTypeFilter) {
        return false;
      }

      // Category filter
      if (activeCategoryFilter !== 'all' && p.applicationCategory !== activeCategoryFilter) {
        return false;
      }

      // Herb filter
      if (activeHerbFilter !== 'all' && !p.herbIds.includes(activeHerbFilter)) {
        return false;
      }

      // Stock
      if (onlyInStock && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, activeTypeFilter, activeCategoryFilter, activeHerbFilter, onlyInStock, sortOption]);

  const hasActiveFilters = 
    activeCategoryFilter !== 'all' || 
    activeTypeFilter !== 'all' || 
    activeHerbFilter !== 'all' || 
    onlyInStock || 
    searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setActiveCategoryFilter('all');
    setActiveTypeFilter('all');
    setActiveHerbFilter('all');
    setOnlyInStock(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="space-y-2 border-b border-[#E8E2D9] pb-6">
        <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
          Artisanaal Assortiment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1E2E1D]">
          Onze Natuurproducten
        </h1>
        <p className="text-xs sm:text-sm text-[#5D6B5A] max-w-2xl leading-relaxed">
          Ontdek onze handgemaakte tincturen, zalven, balsems, biologische oliën en losse kruidentheeën. Vervaardigd in kleine batches met pure grondstoffen.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Zoek op naam, werking of kruid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D5CDBD] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-[#1F2E1E] placeholder:text-[#888] focus:outline-none focus:ring-1 focus:ring-[#4A5D3E]"
          />
          <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[#888] hover:text-[#1F2E1E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter & Sorter */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 text-xs">
          <span className="text-[#647462] tabular-nums font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'producten'} gevonden
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-2 bg-white border border-[#D5CDBD] rounded-md flex items-center gap-1.5 text-[#30402C] font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-[#D5CDBD] rounded-md px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#777]" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                aria-label="Sorteer producten"
                className="bg-transparent text-xs text-[#2A3B27] focus:outline-none cursor-pointer"
              >
                <option value="featured">Aanbevolen</option>
                <option value="price-asc">Prijs: laag naar hoog</option>
                <option value="price-desc">Prijs: hoog naar laag</option>
                <option value="name-asc">Naam: A - Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#738271]">Actieve filters:</span>
          {activeCategoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE5DB] text-[#2C3E29] rounded border border-[#D6CDBC]">
              Toepassing: {activeCategoryFilter}
              <button onClick={() => setActiveCategoryFilter('all')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE5DB] text-[#2C3E29] rounded border border-[#D6CDBC]">
              Type: {activeTypeFilter}
              <button onClick={() => setActiveTypeFilter('all')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeHerbFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE5DB] text-[#2C3E29] rounded border border-[#D6CDBC]">
              Kruid: {herbs.find(h => h.id === activeHerbFilter)?.name || activeHerbFilter}
              <button onClick={() => setActiveHerbFilter('all')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlyInStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE5DB] text-[#2C3E29] rounded border border-[#D6CDBC]">
              Alleen op voorraad
              <button onClick={() => setOnlyInStock(false)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-[#8E2A2B] hover:underline font-medium cursor-pointer ml-2"
          >
            Wis alle filters
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 text-xs">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
            <h3 className="font-serif text-base text-[#1E2E1D] font-medium">Filter op Eigenschappen</h3>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-[#697966] hover:text-[#1E2E1D]"
              >
                Reset
              </button>
            )}
          </div>

          {/* Filter: Product Type */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#30402C] uppercase tracking-wider text-[11px]">Producttype</h4>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTypeFilter('all')}
                className={`w-full text-left py-1 px-2 rounded transition-colors ${
                  activeTypeFilter === 'all'
                    ? 'bg-[#4A5D3E] text-white font-medium'
                    : 'text-[#4A5947] hover:bg-[#F2ECE3]'
                }`}
              >
                Alle types
              </button>
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTypeFilter(type)}
                  className={`w-full text-left py-1 px-2 rounded transition-colors ${
                    activeTypeFilter === type
                      ? 'bg-[#4A5D3E] text-white font-medium'
                      : 'text-[#4A5947] hover:bg-[#F2ECE3]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Toepassing */}
          <div className="space-y-2 pt-3 border-t border-[#EBE4D8]">
            <h4 className="font-semibold text-[#30402C] uppercase tracking-wider text-[11px]">Toepassing</h4>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`w-full text-left py-1 px-2 rounded transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#4A5D3E] text-white font-medium'
                    : 'text-[#4A5947] hover:bg-[#F2ECE3]'
                }`}
              >
                Alle toepassingen
              </button>
              {applications.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`w-full text-left py-1 px-2 rounded transition-colors ${
                    activeCategoryFilter === cat
                      ? 'bg-[#4A5D3E] text-white font-medium'
                      : 'text-[#4A5947] hover:bg-[#F2ECE3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Botanisch Kruid */}
          <div className="space-y-2 pt-3 border-t border-[#EBE4D8]">
            <h4 className="font-semibold text-[#30402C] uppercase tracking-wider text-[11px]">Kruid</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setActiveHerbFilter('all')}
                className={`w-full text-left py-1 px-2 rounded transition-colors ${
                  activeHerbFilter === 'all'
                    ? 'bg-[#4A5D3E] text-white font-medium'
                    : 'text-[#4A5947] hover:bg-[#F2ECE3]'
                }`}
              >
                Alle kruiden
              </button>
              {herbs.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActiveHerbFilter(h.id)}
                  className={`w-full text-left py-1 px-2 rounded transition-colors truncate ${
                    activeHerbFilter === h.id
                      ? 'bg-[#4A5D3E] text-white font-medium'
                      : 'text-[#4A5947] hover:bg-[#F2ECE3]'
                  }`}
                  title={h.name}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Beschikbaarheid */}
          <div className="pt-3 border-t border-[#EBE4D8]">
            <label className="flex items-center gap-2 text-[#4A5947] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-[#D5CDBD] text-[#4A5D3E] focus:ring-[#4A5D3E]"
              />
              <span>Alleen op voorraad</span>
            </label>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex justify-end lg:hidden">
            <div className="bg-[#FAF8F5] w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
                <h3 className="font-serif text-lg text-[#1E2E1D]">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#666]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile options */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-[#30402C] mb-2">Producttype</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveTypeFilter('all'); setMobileFilterOpen(false); }}
                      className={`block w-full text-left py-1 px-2 rounded ${activeTypeFilter === 'all' ? 'bg-[#4A5D3E] text-white' : ''}`}
                    >
                      Alle types
                    </button>
                    {productTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setActiveTypeFilter(t); setMobileFilterOpen(false); }}
                        className={`block w-full text-left py-1 px-2 rounded ${activeTypeFilter === t ? 'bg-[#4A5D3E] text-white' : ''}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E2D9]">
                  <h4 className="font-semibold text-[#30402C] mb-2">Toepassing</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveCategoryFilter('all'); setMobileFilterOpen(false); }}
                      className={`block w-full text-left py-1 px-2 rounded ${activeCategoryFilter === 'all' ? 'bg-[#4A5D3E] text-white' : ''}`}
                    >
                      Alle toepassingen
                    </button>
                    {applications.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setActiveCategoryFilter(c); setMobileFilterOpen(false); }}
                        className={`block w-full text-left py-1 px-2 rounded ${activeCategoryFilter === c ? 'bg-[#4A5D3E] text-white' : ''}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-12 text-center space-y-4">
              <p className="font-serif text-lg text-[#1E2E1D]">
                Geen producten gevonden met de gekozen filters
              </p>
              <p className="text-xs text-[#6B7968] max-w-sm mx-auto">
                Probeer je zoekterm aan te passen of reset de filters om het hele assortiment te bekijken.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-[#4A5D3E] text-white text-xs font-medium rounded-md hover:bg-[#3D4D33] cursor-pointer"
              >
                Reset alle filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <div
                    key={product.id}
                    className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-4/3 bg-[#EFE9DF] overflow-hidden">
                        <img
                          src={resolveImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          referrerPolicy="no-referrer"
                        />
                        {product.badge && (
                          <span className="absolute top-2.5 left-2.5 bg-[#FAF8F5]/90 text-[#30412D] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                            {product.badge}
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="absolute top-2.5 right-2.5 bg-[#8E2A2B] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                            Tijdelijk uitverkocht
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-[#717E6F]">
                          <span>{product.productType}</span>
                          <span>·</span>
                          <span>{product.volume}</span>
                        </div>

                        <h3 className="font-serif text-base text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#637361] line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Stock Status & Actions */}
                    <div className="p-4 pt-0 border-t border-[#F0EAE0] mt-2 space-y-2.5">
                      <div className="flex items-center justify-between text-xs pt-2">
                        <span className="font-semibold text-sm text-[#1E2E1D] tabular-nums">
                          €{product.price.toFixed(2)}
                        </span>
                        <span className={`text-[11px] ${isOutOfStock ? 'text-[#8E2A2B]' : 'text-[#4A5D3E]'}`}>
                          {isOutOfStock ? 'Uitverkocht' : product.stock < 5 ? `Nog ${product.stock} over` : 'Op voorraad'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate('product-detail', { productId: product.id })}
                          className="w-full py-1.5 text-xs text-[#3E4F3B] hover:text-[#1E2E1D] font-medium bg-[#F2ECE3] hover:bg-[#EAE2D6] rounded text-center transition-colors cursor-pointer"
                        >
                          Bekijk product
                        </button>
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={isOutOfStock}
                          className="w-full py-1.5 text-xs bg-[#4A5D3E] hover:bg-[#3D4D33] disabled:bg-[#D5CDBD] disabled:text-[#888] text-white font-medium rounded flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Voeg toe aan winkelmand"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>In mand</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
