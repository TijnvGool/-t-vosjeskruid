import React from 'react';
import { useStore } from '../../context/StoreContext';
import { resolveImageUrl } from '../../assets/images';
import { Leaf, Heart, Sun, Wind, Droplets, BookOpen, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { siteContent, navigate } = useStore();
  const about = siteContent.about;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 sm:space-y-24">
      {/* 1. Header Profile & Personal Portrait */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#52644B] uppercase tracking-wider font-semibold">
            <Heart className="w-3.5 h-3.5" />
            <span>Het Gezicht Achter 't Vosjeskruid</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#1E2E1D] leading-tight">
            {about.title}
          </h1>

          <p className="font-serif text-xl text-[#3E513B] italic">
            "{about.subtitle}"
          </p>

          <p className="text-sm sm:text-base text-[#4C5B49] leading-relaxed">
            {about.intro}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => navigate('products')}
              className="px-6 py-2.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Bekijk mijn bereidingen
            </button>
            <button
              onClick={() => navigate('contact')}
              className="px-6 py-2.5 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#293B27] text-xs font-semibold rounded-md border border-[#D5CDBD] transition-colors cursor-pointer"
            >
              Kom in contact
            </button>
          </div>
        </div>

        {/* Large Personal Photo */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E0D7C9] bg-[#E9E2D5]">
            <img
              src={resolveImageUrl(about.heroImage)}
              alt={about.signatureName}
              className="w-full h-[420px] sm:h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 p-4 bg-[#FAF8F5]/90 backdrop-blur-md rounded-xl border border-[#E2DACB] text-xs">
              <p className="font-serif text-base font-semibold text-[#1A2619]">{about.signatureName}</p>
              <p className="text-[#596A56] mt-0.5">{about.signatureRole}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Persoonlijk Verhaal & Waarom begonnen met kruiden */}
      <section className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-8 sm:p-14 space-y-6">
        <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
          De Oorsprong
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#1E2E1D]">
          Waarom ik met kruiden ben begonnen
        </h2>
        <div className="prose text-xs sm:text-sm text-[#4C5B49] leading-relaxed max-w-3xl space-y-4">
          <p>{about.personalStory}</p>
        </div>
      </section>

      {/* 3. Vier Pijlers van het Ambacht (Tuin, Teelt, Drogen, Maken) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
            Van Zaadje tot Zalf
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
            Hoe wij werken in het atelier
          </h2>
          <p className="text-xs sm:text-sm text-[#616F5E]">
            Vier zorgvuldige stappen waarin geduld en vakmanschap centraal staan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tuin & Teelt */}
          <div className="bg-[#FAF8F5] border border-[#E0D7CB] rounded-xl p-8 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#EFE9DF] text-[#4A5D3E]">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#1E2E1D]">
              Onze Tuin &amp; Hoe wij telen
            </h3>
            <p className="text-xs sm:text-sm text-[#546452] leading-relaxed">
              {about.gardenStory}
            </p>
          </div>

          {/* Drogen */}
          <div className="bg-[#FAF8F5] border border-[#E0D7CB] rounded-xl p-8 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#EFE9DF] text-[#4A5D3E]">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#1E2E1D]">
              De Kunst van het Drogen
            </h3>
            <p className="text-xs sm:text-sm text-[#546452] leading-relaxed">
              {about.dryingStory}
            </p>
          </div>

          {/* Maken */}
          <div className="bg-[#FAF8F5] border border-[#E0D7CB] rounded-xl p-8 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#EFE9DF] text-[#4A5D3E]">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#1E2E1D]">
              Macereren &amp; Ambachtelijk Bereiden
            </h3>
            <p className="text-xs sm:text-sm text-[#546452] leading-relaxed">
              {about.craftingStory}
            </p>
          </div>

          {/* Kennis & Visie */}
          <div className="bg-[#FAF8F5] border border-[#E0D7CB] rounded-xl p-8 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#EFE9DF] text-[#4A5D3E]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#1E2E1D]">
              Kennis, Opleiding &amp; Visie
            </h3>
            <p className="text-xs sm:text-sm text-[#546452] leading-relaxed">
              {about.knowledgeVision}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Persoonlijke Handtekening & Uitnodiging */}
      <section className="bg-[#EFE9DF] border border-[#DDD3C2] rounded-2xl p-8 sm:p-12 text-center space-y-6">
        <blockquote className="font-serif text-xl sm:text-2xl text-[#1E2E1D] max-w-xl mx-auto italic font-normal leading-relaxed">
          "Planten dragen een stilte in zich die we in onze drukke wereld soms vergeten zijn. Mijn wens is dat een druppel olie of een kop thee je die rust weer teruggeeft."
        </blockquote>
        <div className="space-y-1">
          <p className="font-serif text-lg font-medium text-[#293B27]">{about.signatureName}</p>
          <p className="text-xs text-[#6B7968]">{about.signatureRole}</p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => navigate('products')}
            className="px-6 py-2.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Ontdek de producten in de webshop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
