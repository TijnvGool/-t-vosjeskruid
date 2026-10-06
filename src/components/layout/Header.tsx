import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    cartItemCount,
    setIsCartOpen,
    setIsAssistantOpen,
    siteContent,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navItems = [
    { label: 'Home', route: 'home' as const },
    { label: 'Producten', route: 'products' as const },
    { label: 'Kruiden', route: 'herbs' as const },
    { label: 'Wie ben ik?', route: 'about' as const },
    { label: 'Contact', route: 'contact' as const },
  ];

  const handleNavClick = (route: typeof navItems[0]['route']) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('products');
      setShowSearchInput(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] transition-all">
      {/* Subtle announcement bar */}
      {siteContent.announcementBar && (
        <aside aria-label="Aankondiging" className="bg-[#415337] text-[#F3EFEA] text-xs py-1.5 px-4 text-center tracking-wide font-normal">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
            <span>{siteContent.announcementBar}</span>
          </div>
        </aside>
      )}

      {/* Main Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav links) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => navigate('home')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5D3E] rounded py-1"
          aria-label="'t Vosjeskruid homepagina"
        >
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1F2E1E] transition-colors group-hover:text-[#4A5D3E]">
            {siteContent.brandName}
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav aria-label="Hoofdnavigatie" className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#42503F]">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`relative py-1 transition-colors hover:text-[#1F2E1E] cursor-pointer ${
                  isActive ? 'text-[#1F2E1E] font-semibold' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A5D3E] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search, AI Botanical Guide, Cart) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Toggle / Box */}
          <div className="relative">
            {showSearchInput ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Zoek kruid of product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-60 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded-md px-3 py-1.5 text-[#1F2E1E] placeholder:text-[#888] focus:outline-none focus:ring-1 focus:ring-[#4A5D3E]"
                />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="ml-1 p-1 text-[#666] hover:text-[#1F2E1E] cursor-pointer"
                  aria-label="Sluit zoekbalk"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-[#42503F] hover:text-[#1F2E1E] hover:bg-[#F2ECE3] rounded-full transition-colors cursor-pointer"
                aria-label="Zoeken in webshop"
                title="Zoeken"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>
            )}
          </div>

          {/* AI Botanical Guide Button */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 bg-[#EFE9DF] text-[#2B3B28] hover:bg-[#E5DDCF] rounded-md transition-colors cursor-pointer border border-[#DDD4C5]"
            aria-label="Open Botanische Kruidengids"
            title="Kruidengids assistent"
          >
            <Sparkles className="w-4 h-4 text-[#7A643A]" />
            <span className="hidden sm:inline">Kruidengids</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#42503F] hover:text-[#1F2E1E] hover:bg-[#F2ECE3] rounded-full transition-colors cursor-pointer"
            aria-label={`Winkelmand (${cartItemCount} artikelen)`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#4A5D3E] text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#42503F] hover:text-[#1F2E1E] rounded-md cursor-pointer"
            aria-label="Open mobiel menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`text-left text-lg py-2 flex items-center justify-between border-b border-[#F0EAE1] ${
                    isActive ? 'font-semibold text-[#1F2E1E]' : 'text-[#42503F]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </nav>
          
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAssistantOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#EFE9DF] text-[#1F2E1E] rounded-md font-medium text-sm border border-[#D5CDBD]"
            >
              <Sparkles className="w-4 h-4 text-[#7A643A]" />
              <span>Wat past bij mij? (Kruidengids)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
