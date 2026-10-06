import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { siteContent, showToast } = useStore();
  const contact = siteContent.contact;

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSubmitted(true);
    showToast('Je bericht is verzonden. We reageren zo spoedig mogelijk!', 'success');
  };

  const faqs = [
    {
      q: 'Wat zijn de verzendkosten en levertijd?',
      a: 'Bestellingen binnen Nederland worden binnen 1-3 werkdagen bezorgd met PostNL. De verzendkosten bedragen €4,95, en bestellingen vanaf €45 worden gratis verzonden.'
    },
    {
      q: 'Kan ik mijn bestelling ook afhalen in het atelier?',
      a: 'Jazeker! Je kunt bij het afrekenen kiezen voor "Afhalen op het atelier". We zorgen dan dat je bestelling klaarstaat op woensdag of vrijdag tussen 10:00 en 16:00 uur.'
    },
    {
      q: 'Hoe lang zijn de handgemaakte zalven en tincturen houdbaar?',
      a: 'Onze tincturen zijn op biologische alcoholbasis en blijven minstens 3 jaar goed. Zalven en oliën met natuurlijke bijenwas en vitamine E zijn minstens 12 tot 18 maanden houdbaar na opening, mits donker en koel bewaard.'
    },
    {
      q: 'Zijn alle ingrediënten werkelijk 100% natuurlijk?',
      a: 'Volmondig ja. Wij gebruiken uitsluitend planten uit eigen gifvrije teelt, koudgeperste biologische oliën en onbewerkte bijenwas van lokale imkers. Geen minerale oliën, microplastics of synthetische geurstoffen.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Title */}
      <div className="space-y-2 border-b border-[#E8E2D9] pb-6">
        <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
          Kom in Verbinding
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1E2E1D]">
          Contact &amp; Atelier
        </h1>
        <p className="text-xs sm:text-sm text-[#5D6B5A] max-w-xl">
          Heb je een vraag over een kruid, je bestelling of wil je advies over welk product bij jou past? We horen heel graag van je.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-10 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-[#4A5D3E] text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#1E2E1D]">Dank voor je bericht!</h3>
              <p className="text-xs sm:text-sm text-[#586855] max-w-sm mx-auto leading-relaxed">
                We hebben je vraag in goede orde ontvangen en beantwoorden deze gewoonlijk binnen één werkdag.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', subject: '', message: '' });
                }}
                className="text-xs font-semibold text-[#4A5D3E] hover:underline pt-2 cursor-pointer"
              >
                Nog een bericht sturen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1E2E1D]">Stuur ons een bericht</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#465643]">
                    Jouw Naam *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. Sophie van Dam"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded-md p-2.5 text-xs text-[#1E2E1D] focus:ring-1 focus:ring-[#4A5D3E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#465643]">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sophie@voorbeeld.nl"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-[#D5CDBD] rounded-md p-2.5 text-xs text-[#1E2E1D] focus:ring-1 focus:ring-[#4A5D3E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#465643]">
                  Onderwerp
                </label>
                <input
                  type="text"
                  placeholder="bijv. Vraag over Calendulazalf of bestelling"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded-md p-2.5 text-xs text-[#1E2E1D] focus:ring-1 focus:ring-[#4A5D3E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#465643]">
                  Je Bericht *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Waar kunnen we je mee helpen?..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded-md p-2.5 text-xs text-[#1E2E1D] focus:ring-1 focus:ring-[#4A5D3E] focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verstuur Bericht</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Atelier Info & Pickup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-xl text-[#1E2E1D]">Atelier &amp; Contactgegevens</h2>

            <div className="space-y-4 text-xs text-[#52634F]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4A5D3E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1E2E1D] block">Locatie Atelier</span>
                  <p>{contact.atelierAddress}</p>
                  <p>{contact.atelierCity}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#4A5D3E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1E2E1D] block">Openingstijden Afhalen</span>
                  <p>{contact.pickupHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#4A5D3E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1E2E1D] block">E-mail</span>
                  <a href={`mailto:${contact.email}`} className="text-[#4A5D3E] hover:underline">
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#4A5D3E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1E2E1D] block">Telefoon</span>
                  <p>{contact.phone}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EBE4D8] pt-4 text-[11px] text-[#71806F]">
              <p>KvK-nummer: {contact.kvk}</p>
              <p className="mt-1">
                Bezoek aan de kruidentuin uitsluitend op afspraak om de rust van onze planten en het atelier te waarborgen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <section className="bg-[#F5F0E8] border border-[#E2D9CB] rounded-2xl p-8 sm:p-12 space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
            Veelgestelde Vragen
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
            Alles wat je wilt weten over bestellen en onze kruiden
          </h2>
        </div>

        <div className="divide-y divide-[#E3D9C9] text-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-serif text-base text-[#1E2E1D] hover:text-[#4A5D3E] transition-colors cursor-pointer py-1"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#666] transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-[#4A5D3E]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="pt-2 text-xs sm:text-[13px] text-[#556653] leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
