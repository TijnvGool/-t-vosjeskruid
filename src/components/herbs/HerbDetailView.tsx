import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, ArrowRight, Leaf, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';

export const HerbDetailView: React.FC = () => {
  const {
    herbs,
    products,
    selectedHerbId,
    navigate,
    setActiveHerbFilter,
    addToCart,
  } = useStore();

  const herb = herbs.find(h => h.id === selectedHerbId) || herbs[0];

  if (!herb) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Kruid niet gevonden.</p>
        <button onClick={() => navigate('herbs')} className="mt-4 text-[#4A5D3E] underline">
          Terug naar kruidenoverzicht
        </button>
      </div>
    );
  }

  // Linked products containing this herb
  const linkedProducts = products.filter(p => p.herbIds.includes(herb.id));

  const handleViewAllProductsWithHerb = () => {
    setActiveHerbFilter(herb.id);
    navigate('products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('herbs')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634F] hover:text-[#1E2E1D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Terug naar alle kruiden</span>
        </button>
      </div>

      {/* Header Profile with Herb Image & Key Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Botanical image */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#EAE2D5] border border-[#DDD3C3] shadow-xs relative">
            <img
              src={herb.image}
              alt={herb.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-xs text-[#283825] px-3 py-1 rounded text-xs">
              <span className="font-semibold">Oogstseizoen:</span> {herb.harvestSeason}
            </div>
          </div>

          <div className="bg-[#F4EFEA] border border-[#E3DBCF] rounded-xl p-5 text-xs space-y-2">
            <h4 className="font-semibold text-[#2F402C] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#4A5D3E]" />
              <span>Botanische Paspoort</span>
            </h4>
            <div className="space-y-1.5 text-[#546452] pt-1">
              <div className="flex justify-between border-b border-[#E7DFD3] pb-1">
                <span>Familie</span>
                <span className="font-medium text-[#1E2E1D]">{herb.family}</span>
              </div>
              <div className="flex justify-between border-b border-[#E7DFD3] pb-1">
                <span>Latijnse benaming</span>
                <span className="italic font-serif text-[#1E2E1D]">{herb.botanicalName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E7DFD3] pb-1">
                <span>Herkomst</span>
                <span className="font-medium text-[#1E2E1D]">{herb.origin}</span>
              </div>
              <div className="flex justify-between">
                <span>Gekoppelde producten</span>
                <span className="font-medium text-[#1E2E1D]">{linkedProducts.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Botanical Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
              Botanisch Plantenprofiel
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1E2E1D] leading-tight">
              {herb.name}
            </h1>
            <p className="italic font-serif text-lg text-[#556653]">
              {herb.botanicalName}
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#465643] leading-relaxed border-t border-b border-[#E8E2D9] py-4">
            {herb.plantProfile}
          </p>

          {/* Direct Shop Connection Button */}
          <div className="pt-2">
            <button
              onClick={handleViewAllProductsWithHerb}
              className="px-6 py-3 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Bekijk alle {linkedProducts.length} producten met {herb.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Traditional uses */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-xl text-[#1E2E1D]">
              Traditionele Toepassingen &amp; Eigenschappen
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#50604E]">
              {herb.traditionalUses.map((use, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#4A5D3E] mt-1">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Extraction methods */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-xl text-[#1E2E1D]">
              Hoe wij dit kruid verwerken
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#50604E]">
              {herb.extractionMethods.map((method, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Leaf className="w-3.5 h-3.5 text-[#4A5D3E] shrink-0 mt-0.5" />
                  <span>{method}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Artisan garden notes (Herbalist's perspective) */}
      <section className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-8 sm:p-12 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs text-[#52644B] uppercase tracking-wider font-semibold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Uit de Tuin van 't Vosjeskruid</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
          Teelt- &amp; Oogstnotities van de Herborist
        </h2>
        <p className="text-xs sm:text-sm text-[#4E5E4C] leading-relaxed max-w-3xl">
          {herb.artisanGardenNotes}
        </p>
      </section>

      {/* Linked Products in Store */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
              Van plant naar product
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D] mt-1">
              Producten met {herb.name} ({linkedProducts.length})
            </h2>
          </div>
          <button
            onClick={handleViewAllProductsWithHerb}
            className="text-xs font-semibold text-[#4A5D3E] hover:text-[#1E2E1D] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Filter webshop op {herb.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {linkedProducts.length === 0 ? (
          <p className="text-xs text-[#71806F] italic">
            Momenteel zijn er geen actieve producten met dit kruid op voorraad.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {linkedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div
                  onClick={() => navigate('product-detail', { productId: prod.id })}
                  className="cursor-pointer"
                >
                  <div className="aspect-4/3 bg-[#EFE9DF] overflow-hidden">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#717E6F]">
                      <span>{prod.productType}</span>
                      <span>·</span>
                      <span>{prod.volume}</span>
                    </div>
                    <h4 className="font-serif text-base text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors leading-snug">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-[#637361] line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#F0EAE0] mt-2 flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#1E2E1D] tabular-nums">
                    €{prod.price.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('product-detail', { productId: prod.id })}
                      className="text-xs text-[#52634F] hover:text-[#1E2E1D] font-medium px-2 py-1 rounded hover:bg-[#F2ECE3] transition-colors cursor-pointer"
                    >
                      Bekijk
                    </button>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="p-1.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white rounded transition-colors cursor-pointer"
                      title="In mandje"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
