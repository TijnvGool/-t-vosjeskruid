import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { resolveImageUrl } from '../../assets/images';
import { Search, ArrowRight, Leaf, Sparkles } from 'lucide-react';

export const HerbListView: React.FC = () => {
  const { herbs, products, navigate } = useStore();
  const [herbSearch, setHerbSearch] = useState('');

  const filteredHerbs = herbs.filter((herb) => {
    if (!herbSearch.trim()) return true;
    const q = herbSearch.toLowerCase();
    return (
      herb.name.toLowerCase().includes(q) ||
      herb.botanicalName.toLowerCase().includes(q) ||
      herb.family.toLowerCase().includes(q) ||
      herb.shortDescription.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Botanical Header Banner */}
      <div className="bg-[#F4EFEA] border border-[#E2DACB] rounded-2xl p-8 sm:p-12 space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#52644B] uppercase tracking-wider font-semibold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Botanische Kennisomgeving</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1E2E1D] leading-tight max-w-2xl">
          De Kruiden van 't Vosjeskruid
        </h1>
        <p className="text-xs sm:text-sm text-[#556453] max-w-2xl leading-relaxed">
          In onze Brabantse tuin groeien tientallen medicinale en aromatische planten. Lees hier alles over hun plantenprofiel, volksgeneeskundige traditie, onze oogstwijze en in welke handgemaakte bereidingen ze zijn verwerkt.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Zoek kruid op Nederlandse of Latijnse naam..."
              value={herbSearch}
              onChange={(e) => setHerbSearch(e.target.value)}
              className="w-full bg-white border border-[#D5CDBD] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-[#1F2E1E] placeholder:text-[#888] focus:outline-none focus:ring-1 focus:ring-[#4A5D3E]"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Herbs Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-[#6F7E6E]">
          <span className="font-medium tabular-nums">{filteredHerbs.length} botanische kruiden</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHerbs.map((herb) => {
            const linkedProductCount = products.filter(p => p.herbIds.includes(herb.id)).length;

            return (
              <div
                key={herb.id}
                onClick={() => navigate('herb-detail', { herbId: herb.id })}
                className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-xl overflow-hidden hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-4/3 bg-[#EAE2D5] overflow-hidden relative">
                    <img
                      src={resolveImageUrl(herb.image)}
                      alt={herb.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#FAF8F5]/90 text-[#30412D] text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                      Oogst: {herb.harvestSeason}
                    </span>
                  </div>

                  <div className="p-5 pt-2 space-y-1.5">
                    <span className="text-[11px] text-[#71806F] block truncate">
                      {herb.family}
                    </span>
                    <h2 className="font-serif text-xl text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                      {herb.name}
                    </h2>
                    <p className="italic font-serif text-xs text-[#5D6D5B]">
                      {herb.botanicalName}
                    </p>
                    <p className="text-xs text-[#61715F] line-clamp-3 leading-relaxed pt-1">
                      {herb.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#EAE3D6] mt-2 flex items-center justify-between text-xs text-[#4A5D3E] font-medium">
                  <span>{linkedProductCount} {linkedProductCount === 1 ? 'product' : 'producten'}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Lees plantenprofiel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
