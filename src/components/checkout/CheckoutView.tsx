import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, Check, ShieldCheck, ShoppingBag, Truck, CreditCard, ChevronRight } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotal,
    navigate,
    addOrder,
    latestOrder,
  } = useStore();

  const [step, setStep] = useState<'form' | 'success'>('form');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: '',
  });

  const [shippingOption, setShippingOption] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'bancontact' | 'klarna' | 'transfer'>('ideal');
  const [selectedBank, setSelectedBank] = useState('Rabobank');

  const freeShippingThreshold = 45.00;
  const isFreeShipping = cartTotal >= freeShippingThreshold || shippingOption === 'pickup';
  const shippingCost = isFreeShipping ? 0 : 4.95;
  const finalTotal = cartTotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.street || !formData.city) return;

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      volume: item.product.volume,
    }));

    const paymentLabel = 
      paymentMethod === 'ideal' ? `iDEAL (${selectedBank})` :
      paymentMethod === 'bancontact' ? 'Bancontact' :
      paymentMethod === 'klarna' ? 'Klarna Achteraf Betalen' : 'Bankoverschrijving';

    addOrder({
      customer: formData,
      items: orderItems,
      subtotal: cartTotal,
      shippingCost,
      total: finalTotal,
      paymentMethod: paymentLabel,
      paymentStatus: 'Betaald',
      orderStatus: 'Nieuw',
    });

    setStep('success');
  };

  if (step === 'success' && latestOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-16 h-16 bg-[#4A5D3E] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
          <Check className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
            Bestelling Geslaagd
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E2E1D]">
            Dankjewel voor je bestelling!
          </h1>
          <p className="text-sm text-[#556553] max-w-md mx-auto leading-relaxed">
            We hebben je bestelling met toewijding in behandeling genomen. Een bevestiging en pakbon zijn verzonden naar <strong>{latestOrder.customer.email}</strong>.
          </p>
        </div>

        {/* Order Receipt Card */}
        <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 text-left space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between border-b border-[#E8E2D9] pb-4 text-xs">
            <div>
              <span className="text-[#71806F]">Bestelnummer</span>
              <p className="font-mono font-semibold text-sm text-[#1E2E1D]">{latestOrder.orderNumber}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-[#71806F]">Datum &amp; Tijd</span>
              <p className="text-[#1E2E1D] font-medium">{latestOrder.date}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-[#71806F]">Betaalstatus</span>
              <p className="text-[#4A5D3E] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {latestOrder.paymentStatus} ({latestOrder.paymentMethod})
              </p>
            </div>
          </div>

          {/* Ordered items */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-[#1E2E1D] uppercase tracking-wider text-[11px]">Bestelde Producten</h4>
            {latestOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded bg-[#EAE2D6]" />
                  <div>
                    <span className="font-medium text-[#1E2E1D]">{item.productName}</span>
                    <span className="text-[#71806F] block">{item.quantity}x {item.volume}</span>
                  </div>
                </div>
                <span className="font-medium text-[#1E2E1D] tabular-nums">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-xs text-[#5D6D5B] border-t border-[#E8E2D9] pt-4">
            <div className="flex justify-between">
              <span>Subtotaal</span>
              <span className="tabular-nums">€{latestOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Verzending</span>
              <span className="tabular-nums">{latestOrder.shippingCost === 0 ? 'Gratis' : `€${latestOrder.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm text-[#1E2E1D] pt-2 border-t border-[#E8E2D9]">
              <span>Totaal betaald</span>
              <span className="tabular-nums">€{latestOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#F4EFEA] p-4 rounded-xl text-xs text-[#52634F] space-y-1">
            <span className="font-semibold text-[#1E2E1D] block">Bezorgadres:</span>
            <p>{latestOrder.customer.fullName}</p>
            <p>{latestOrder.customer.street} {latestOrder.customer.houseNumber}</p>
            <p>{latestOrder.customer.postalCode} {latestOrder.customer.city}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('products')}
            className="px-6 py-2.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Verder winkelen
          </button>
          <button
            onClick={() => navigate('admin')}
            className="px-6 py-2.5 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#293B27] text-xs font-semibold rounded-md border border-[#D5CDBD] transition-colors cursor-pointer"
          >
            Bekijk bestelling in Adminpaneel
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto text-[#4A5D3E]">
          <ShoppingBag className="w-8 h-8 opacity-70" />
        </div>
        <h2 className="font-serif text-2xl text-[#1E2E1D]">Je winkelmand is leeg</h2>
        <p className="text-xs text-[#6B7968]">Voeg eerst een product toe voor je kunt afrekenen.</p>
        <button
          onClick={() => navigate('products')}
          className="px-5 py-2.5 bg-[#4A5D3E] text-white text-xs font-medium rounded-md hover:bg-[#3D4D33] cursor-pointer"
        >
          Bekijk producten
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634F] hover:text-[#1E2E1D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Verder winkelen</span>
        </button>
      </div>

      <div className="space-y-1 border-b border-[#E8E2D9] pb-4">
        <h1 className="font-serif text-3xl text-[#1E2E1D]">Afrekenen</h1>
        <p className="text-xs text-[#6B7968]">Zonder account direct veilig bestellen.</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contactgegevens */}
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-[#1E2E1D]">1. Jouw Contactgegevens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[#475744] font-medium">Volledige Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="bijv. Marlies van den Berg"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#475744] font-medium">E-mailadres (voor factuur &amp; track &amp; trace) *</label>
                <input
                  type="email"
                  required
                  placeholder="marlies@voorbeeld.nl"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#475744] font-medium">Telefoonnummer (optioneel)</label>
                <input
                  type="tel"
                  placeholder="06-12345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Verzendadres */}
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-[#1E2E1D]">2. Bezorgadres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[#475744] font-medium">Straatnaam *</label>
                <input
                  type="text"
                  required
                  placeholder="Kerkstraat"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#475744] font-medium">Huisnummer &amp; Toev. *</label>
                <input
                  type="text"
                  required
                  placeholder="12 bis"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#475744] font-medium">Postcode *</label>
                <input
                  type="text"
                  required
                  placeholder="1234 AB"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[#475744] font-medium">Woonplaats *</label>
                <input
                  type="text"
                  required
                  placeholder="Oisterwijk"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="block text-[#475744] font-medium">Opmerking voor de bezorger (optioneel)</label>
                <input
                  type="text"
                  placeholder="bijv. Graag neerzetten onder de carport"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Verzendoptie */}
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-[#1E2E1D]">3. Bezorgmethode</h2>
            <div className="space-y-2 text-xs">
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${shippingOption === 'delivery' ? 'border-[#4A5D3E] bg-[#F4EFEA]' : 'border-[#E0D7CB] bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingOption === 'delivery'}
                    onChange={() => setShippingOption('delivery')}
                    className="text-[#4A5D3E] focus:ring-[#4A5D3E]"
                  />
                  <div>
                    <span className="font-semibold text-[#1E2E1D] block">PostNL Pakketpost aan Huis</span>
                    <span className="text-[#6C7B6A]">Bezorging binnen 1-3 werkdagen met track &amp; trace</span>
                  </div>
                </div>
                <span className="font-medium text-[#1E2E1D]">
                  {cartTotal >= freeShippingThreshold ? 'Gratis' : '€4.95'}
                </span>
              </label>

              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${shippingOption === 'pickup' ? 'border-[#4A5D3E] bg-[#F4EFEA]' : 'border-[#E0D7CB] bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingOption === 'pickup'}
                    onChange={() => setShippingOption('pickup')}
                    className="text-[#4A5D3E] focus:ring-[#4A5D3E]"
                  />
                  <div>
                    <span className="font-semibold text-[#1E2E1D] block">Afhalen op het Atelier</span>
                    <span className="text-[#6C7B6A]">Moergestel (Woensdag of vrijdag op afspraak)</span>
                  </div>
                </div>
                <span className="font-medium text-[#4A5D3E]">Gratis</span>
              </label>
            </div>
          </div>

          {/* 4. Betaalmethode */}
          <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-[#1E2E1D]">4. Betaalmethode</h2>
            <div className="space-y-2 text-xs">
              {/* iDEAL */}
              <div className={`p-3.5 rounded-xl border transition-all ${paymentMethod === 'ideal' ? 'border-[#4A5D3E] bg-[#F4EFEA]' : 'border-[#E0D7CB] bg-white'}`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'ideal'}
                      onChange={() => setPaymentMethod('ideal')}
                      className="text-[#4A5D3E] focus:ring-[#4A5D3E]"
                    />
                    <span className="font-semibold text-[#1E2E1D]">iDEAL (Directe online betaling)</span>
                  </div>
                  <span className="text-[11px] text-[#71806F]">Direct bevestigd</span>
                </label>

                {paymentMethod === 'ideal' && (
                  <div className="mt-3 pt-3 border-t border-[#E8E1D5] pl-6 space-y-1">
                    <label className="block text-[11px] text-[#556553]">Kies je bank:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="bg-white border border-[#D5CDBD] rounded p-1.5 text-xs text-[#1E2E1D] w-full max-w-xs focus:ring-1 focus:ring-[#4A5D3E]"
                    >
                      <option value="Rabobank">Rabobank</option>
                      <option value="ING">ING</option>
                      <option value="ABN AMRO">ABN AMRO</option>
                      <option value="ASN Bank">ASN Bank</option>
                      <option value="RegioBank">RegioBank</option>
                      <option value="Triodos Bank">Triodos Bank</option>
                      <option value="SNS">SNS Bank</option>
                      <option value="Knab">Knab</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Bancontact */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'bancontact' ? 'border-[#4A5D3E] bg-[#F4EFEA]' : 'border-[#E0D7CB] bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bancontact'}
                    onChange={() => setPaymentMethod('bancontact')}
                    className="text-[#4A5D3E] focus:ring-[#4A5D3E]"
                  />
                  <span className="font-semibold text-[#1E2E1D]">Bancontact (België)</span>
                </div>
              </label>

              {/* Klarna */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'klarna' ? 'border-[#4A5D3E] bg-[#F4EFEA]' : 'border-[#E0D7CB] bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'klarna'}
                    onChange={() => setPaymentMethod('klarna')}
                    className="text-[#4A5D3E] focus:ring-[#4A5D3E]"
                  />
                  <span className="font-semibold text-[#1E2E1D]">Klarna Achteraf Betalen</span>
                </div>
              </label>

              {/* Bankoverschrijving */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-[#4A5D3E] bg-[#F4EFEA]' : 'border-[#E0D7CB] bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="text-[#4A5D3E] focus:ring-[#4A5D3E]"
                  />
                  <span className="font-semibold text-[#1E2E1D]">Handmatige Bankoverschrijving</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28">
          <h3 className="font-serif text-xl text-[#1E2E1D] border-b border-[#E8E2D9] pb-3">
            Overzicht Bestelling ({cart.length})
          </h3>

          <div className="divide-y divide-[#EBE5DB] max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="py-3 flex gap-3 items-center">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md bg-[#E8E1D3] shrink-0 border border-[#D5CDBD]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-[#1E2E1D] truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-[#71806F]">{item.quantity}x {item.product.volume}</p>
                </div>
                <span className="text-xs font-semibold text-[#1E2E1D] tabular-nums">
                  €{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-[#5D6D5B] border-t border-[#E8E2D9] pt-4">
            <div className="flex justify-between">
              <span>Subtotaal</span>
              <span className="font-medium text-[#1E2E1D] tabular-nums">€{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Verzendkosten</span>
              <span className="font-medium text-[#1E2E1D] tabular-nums">
                {shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-[#E8E2D9] pt-2 flex justify-between text-base font-semibold text-[#1E2E1D]">
              <span>Totaalbedrag</span>
              <span className="tabular-nums">€{finalTotal.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-[#71806F]">Inclusief 9% en 21% btw</p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white text-xs font-semibold rounded-md transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Bestelling Plaatsen &amp; Betalen</span>
            <ShieldCheck className="w-4 h-4" />
          </button>

          <div className="pt-2 text-[11px] text-[#71806F] text-center space-y-1">
            <p>14 dagen bedenktermijn op ongeopende verzegelde producten</p>
            <p>Veilig versleutelde verbinding</p>
          </div>
        </div>
      </form>
    </div>
  );
};
