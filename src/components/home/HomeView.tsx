import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ApplicationCategory } from '../../types';
import { Sparkles, ArrowRight, ShoppingBag, Star, Leaf, Check } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    siteContent,
    products,
    herbs,
    reviews,
    navigate,
    setActiveCategoryFilter,
    setIsAssistantOpen,
    addToCart,
  } = useStore();

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const popularHerbs = herbs.slice(0, 4);
  const approvedReviews = reviews.filter(r => r.status === 'approved').slice(0, 3);

  const applications: { title: ApplicationCategory; desc: string; count: number }[] = [
    { title: 'Rust & Slaap', desc: 'Kalmerende kamille, valeriaan en aromatische lavendel voor diepe nachtrust.', count: 7 },
    { title: 'Weerstand & Luchtwegen', desc: 'Verwarmende tijm, salie en vlierbes voor een vrije ademhaling.', count: 8 },
    { title: 'Huid & Verzorging', desc: 'Koesterend goudsbloemmaceraat, zalven en natuurlijke bijenwas.', count: 12 },
    { title: 'Spieren & Gewrichten', desc: 'Smeerwortelbalsem en zongerijpt sint-janskruid voor soepelheid.', count: 6 },
    { title: 'Spijsvertering & Buik', desc: 'Zacht venkelzaad, kamille en vrouwenmantel na de maaltijd.', count: 5 },
    { title: 'Vitaliteit & Focus', desc: 'Mineraalrijke brandnetel en opwekkende rozemarijn voor helderheid.', count: 5 },
  ];

  const handleApplicationClick = (cat: ApplicationCategory) => {
    setActiveCategoryFilter(cat);
    navigate('products');
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Botanical Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs text-[#52644B] uppercase tracking-wider font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Ambachtelijke Herboristiek uit Brabant</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A2619] leading-[1.15] text-balance">
              {siteContent.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-[#4E5C4B] max-w-xl font-normal leading-relaxed">
              {siteContent.hero.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-[#6C7A69] max-w-lg leading-relaxed">
              {siteContent.hero.intro}
            </p>

            {/* Direct CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigate('products')}
                className="px-6 py-3 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-sm font-medium rounded-md transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>{siteContent.hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('herbs')}
                className="px-6 py-3 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#283825] text-sm font-medium rounded-md transition-colors border border-[#DDD4C5] cursor-pointer"
              >
                <span>{siteContent.hero.secondaryCtaText}</span>
              </button>
            </div>

            {/* Subtle botanical trust line */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#6B7968]">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4A5D3E]" /> 100% biologische teelt
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4A5D3E]" /> Zonder synthetische stoffen
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4A5D3E]" /> Kleinschalig handgemaakt
              </span>
            </div>
          </div>

          {/* Right Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-xl border border-[#E0D7C9] bg-[#E9E2D5]">
              <img
                src={siteContent.hero.image}
                alt="Botanische kruidentafel van 't Vosjeskruid"
                className="w-full h-[360px] sm:h-[480px] object-cover transition-transform duration-500 hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#FAF8F5]/90 backdrop-blur-md rounded-lg border border-[#E2DACB] text-xs text-[#2A3B27]">
                <p className="font-serif text-sm font-medium text-[#1A2619]">Geoogst met respect voor het ritme der seizoenen</p>
                <p className="text-[11px] text-[#637260] mt-0.5">Verse kamille, goudsbloem en zongemacereerde oliën</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Interactive Router: "Waar ben je naar op zoek?" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEA] rounded-2xl border border-[#E3DBCF] p-8 sm:p-12 text-center space-y-6">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
              Wegwijzer in ons atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1E2E1D]">
              Waar ben je naar op zoek?
            </h2>
            <p className="text-sm text-[#546251]">
              Kies jouw manier om onze kruiden en producten te ontdekken.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-2">
            {/* Route A: Ik weet wat ik zoek */}
            <div
              onClick={() => navigate('products')}
              className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-xl p-6 text-left hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#5B6D56]">Route 1 · Direct overzicht</span>
                <h3 className="font-serif text-xl text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                  "Ik weet wat ik zoek"
                </h3>
                <p className="text-xs text-[#6B7968] leading-relaxed">
                  Bekijk direct ons complete assortiment van ~50 tincturen, zalven, losse theeën en balsems met handige filters.
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-semibold text-[#4A5D3E] group-hover:translate-x-1 transition-transform">
                <span>Naar de webshop catalogus</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* Route B: Ik wil ontdekken wat bij mij past (AI assistant hook) */}
            <div
              onClick={() => setIsAssistantOpen(true)}
              className="bg-[#EDE5D8] border border-[#D5CABE] rounded-xl p-6 text-left hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#70582B]">
                  <Sparkles className="w-3.5 h-3.5 text-[#8F723D]" />
                  <span>Route 2 · Botanische Kruidengids</span>
                </div>
                <h3 className="font-serif text-xl text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                  "Ik wil ontdekken wat bij mij past"
                </h3>
                <p className="text-xs text-[#616E5E] leading-relaxed">
                  Beantwoord enkele vragen of beschrijf je wens (bijv. slaap, luchtwegen of huid). Onze gids koppelt direct passende kruiden en producten.
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-semibold text-[#283925] group-hover:translate-x-1 transition-transform">
                <span>Start de kruidengids</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Uitgelichte Producten */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
              Met zorg bereid
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D] mt-1">
              Uitgelichte Ambachtelijke Producten
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-[#4A5D3E] hover:text-[#1E2E1D] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Bekijk alle producten</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div
                onClick={() => navigate('product-detail', { productId: prod.id })}
                className="cursor-pointer"
              >
                <div className="relative aspect-4/3 bg-[#EFE9DF] overflow-hidden">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  {prod.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-[#FAF8F5]/90 text-[#30412D] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#717E6F]">
                    <span>{prod.productType}</span>
                    <span>·</span>
                    <span>{prod.volume}</span>
                  </div>
                  <h3 className="font-serif text-base text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors leading-snug">
                    {prod.name}
                  </h3>
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
                    aria-label={`Voeg ${prod.name} toe aan winkelmand`}
                    title="In mandje"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Populaire Kruiden & Kennisomgeving Teaser */}
      <section className="bg-[#F5F0E8] border-y border-[#E5DFD4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
                Botanische Bibliotheek
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D] mt-1">
                Ontdek de Kruiden uit onze Tuin
              </h2>
              <p className="text-xs sm:text-sm text-[#616F5E] max-w-xl mt-1">
                Achter elk product staat een levende plant. Lees hoe wij ze zaaien, telen, oogsten en traditioneel verwerken.
              </p>
            </div>
            <button
              onClick={() => navigate('herbs')}
              className="text-xs font-semibold text-[#4A5D3E] hover:text-[#1E2E1D] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Alle 14+ kruiden inzien</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularHerbs.map((herb) => (
              <div
                key={herb.id}
                onClick={() => navigate('herb-detail', { herbId: herb.id })}
                className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#E7E0D2]">
                    <img
                      src={herb.image}
                      alt={herb.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                      {herb.name}
                    </h3>
                    <p className="italic text-xs text-[#71806F] font-serif">
                      {herb.botanicalName}
                    </p>
                  </div>
                  <p className="text-xs text-[#637361] line-clamp-3 leading-relaxed">
                    {herb.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE3D6] mt-4 flex items-center justify-between text-xs text-[#52634F] font-medium">
                  <span>Plantenprofiel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Producten per Toepassing / Categorie */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
            Op maat voor jouw lichaam
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
            Zoek op Toepassing
          </h2>
          <p className="text-xs sm:text-sm text-[#616F5E]">
            Vind direct natuurlijke ondersteuning afgestemd op jouw specifieke dagelijkse welzijn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.title}
              onClick={() => handleApplicationClick(app.title)}
              className="bg-[#FAF8F5] border border-[#E0D7CB] rounded-xl p-6 hover:border-[#4A5D3E] hover:bg-[#F7F2EC] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-xl text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                    {app.title}
                  </h3>
                  <span className="text-[11px] text-[#71806F] tabular-nums font-medium">
                    {app.count} producten
                  </span>
                </div>
                <p className="text-xs text-[#61715F] leading-relaxed">
                  {app.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center text-xs font-semibold text-[#4A5D3E] group-hover:translate-x-1 transition-transform">
                <span>Bekijk producten</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Het Verhaal achter 't Vosjeskruid (Preview Story) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs">
          <div className="lg:col-span-5 relative bg-[#EBE4D8]">
            <img
              src={siteContent.about.heroImage}
              alt="Eline de Vos in de kruidentuin van 't Vosjeskruid"
              className="w-full h-full min-h-[320px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
                Het gezicht achter het merk
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#1E2E1D]">
                Het Verhaal achter 't Vosjeskruid
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#4E5C4B] leading-relaxed">
              {siteContent.about.intro}
            </p>

            <blockquote className="border-l-2 border-[#4A5D3E] pl-4 italic font-serif text-base text-[#2B3B28]">
              "De natuur heeft geen haast, en toch raakt alles voltooid. Diezelfde rust gun ik onze planten en onze bereidingen."
            </blockquote>

            <div className="pt-2">
              <button
                onClick={() => navigate('about')}
                className="px-5 py-2.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-medium rounded-md transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Lees het persoonlijke verhaal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Reviews & Klantervaringen */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
            Ervaringen van klanten
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
            Met Liefde Ontvangen
          </h2>
          <p className="text-xs sm:text-sm text-[#616F5E]">
            Lees hoe onze natuurlijke kruidenproducten worden ervaren in het dagelijks leven.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-6 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#C08535]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-medium text-[#1E2E1D]">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-[#5D6D5B] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EBE4D8] text-[11px] text-[#71806F] flex items-center justify-between">
                <span className="font-medium text-[#293A27]">{rev.authorName}</span>
                <span>{rev.location || rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call To Action naar de Webshop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#415337] text-white rounded-2xl p-8 sm:p-14 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F9F7F4] max-w-xl mx-auto font-normal">
            Ervaar de pure kracht van onze Brabantse kruidentuin.
          </h2>
          <p className="text-xs sm:text-sm text-[#C9D6C4] max-w-md mx-auto leading-relaxed">
            Plastikvrij en met zorg verpakt. Vandaag besteld, met toewijding voor je klaargemaakt.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('products')}
              className="px-7 py-3 bg-[#FAF8F5] text-[#243323] hover:bg-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
            >
              Ontdek de Webshop
            </button>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="px-7 py-3 bg-[#33422A] hover:bg-[#2A3722] text-[#EBE5DC] border border-[#55694A] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
              <span>Advies via Kruidengids</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
