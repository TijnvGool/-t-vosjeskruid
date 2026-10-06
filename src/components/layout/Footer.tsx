import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Sparkles, HeartHandshake, Leaf, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, siteContent } = useStore();

  return (
    <footer className="bg-[#212E1E] text-[#EDE8E1] border-t border-[#344431] mt-20">
      {/* 3 Brand Pillars */}
      <div className="border-b border-[#2E3F2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-[#2E3F2B] text-[#A6C09C] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#F9F7F4] mb-1">100% Puur &amp; Botanisch</h4>
              <p className="text-xs text-[#BFB8AC] leading-relaxed">
                Handgeoogste kruiden zonder chemische bestrijdingsmiddelen, synthetische parfums of minerale oliën.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-[#2E3F2B] text-[#A6C09C] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#F9F7F4] mb-1">Ambachtelijk Bereid</h4>
              <p className="text-xs text-[#BFB8AC] leading-relaxed">
                In kleine batches vervaardigd in ons Brabantse atelier. Zongemacereerd en rustig gerijpt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-[#2E3F2B] text-[#A6C09C] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#F9F7F4] mb-1">Zorgzame Verzending</h4>
              <p className="text-xs text-[#BFB8AC] leading-relaxed">
                Plastikvrij en met liefde verpakt. Gratis verzending in Nederland bij bestellingen vanaf €45.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="space-y-4">
          <span className="font-serif text-2xl font-normal tracking-tight text-[#F9F7F4]">
            {siteContent.brandName}
          </span>
          <p className="text-xs text-[#BFB8AC] leading-relaxed">
            {siteContent.tagline}. Een combinatie van eerlijke kruidenkennis, zorg voor de aarde en pure, weldadige producten.
          </p>
          <div className="pt-2 text-xs text-[#9FA898] space-y-1">
            <p>{siteContent.contact.atelierAddress}</p>
            <p>{siteContent.contact.atelierCity}</p>
            <p>E-mail: {siteContent.contact.email}</p>
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D1C9BC]">Webshop</h4>
          <ul className="space-y-2 text-xs text-[#BFB8AC]">
            <li>
              <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer">
                Alle Producten (~50)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer">
                Tincturen &amp; Elixers
              </button>
            </li>
            <li>
              <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer">
                Zalven &amp; Balsems
              </button>
            </li>
            <li>
              <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer">
                Losse Kruidentheeën
              </button>
            </li>
            <li>
              <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer">
                Maceraten &amp; Oliën
              </button>
            </li>
          </ul>
        </div>

        {/* Botanical Knowledge */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D1C9BC]">Kennis &amp; Inspiratie</h4>
          <ul className="space-y-2 text-xs text-[#BFB8AC]">
            <li>
              <button onClick={() => navigate('herbs')} className="hover:text-white transition-colors cursor-pointer">
                Botanische Kruidencatalogus
              </button>
            </li>
            <li>
              <button onClick={() => navigate('about')} className="hover:text-white transition-colors cursor-pointer">
                Onze Tuin &amp; Oogstwijze
              </button>
            </li>
            <li>
              <button onClick={() => navigate('about')} className="hover:text-white transition-colors cursor-pointer">
                Het Drogen &amp; Macereren
              </button>
            </li>
            <li>
              <button onClick={() => navigate('assistant')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <span>Botanische Kruidengids</span>
                <Sparkles className="w-3 h-3 text-[#A6C09C]" />
              </button>
            </li>
          </ul>
        </div>

        {/* Trust & Service */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D1C9BC]">Klantenservice</h4>
          <ul className="space-y-2 text-xs text-[#BFB8AC]">
            <li>
              <button onClick={() => navigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                Contact &amp; Atelierbezoek
              </button>
            </li>
            <li>
              <button onClick={() => navigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                Veelgestelde Vragen (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                Verzending &amp; Retourneren
              </button>
            </li>
            <li className="pt-2">
              <span className="block text-[11px] text-[#8F9B89]">Betaalmethoden:</span>
              <span className="block text-[11px] text-[#C5BDB0]">iDEAL · Bancontact · Klarna · Overschrijving</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar & Admin Access */}
      <div className="border-t border-[#2B3B28] bg-[#1A2518]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C9886]">
          <p>© {new Date().getFullYear()} {siteContent.brandName}. Alle rechten voorbehouden. KvK: {siteContent.contact.kvk}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('admin')}
              className="text-[#9DB097] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Beheeromgeving voor webshopeigenaar"
            >
              <span>Beheeromgeving</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
