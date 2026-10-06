import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    navigate,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 45.00;
  const difference = freeShippingThreshold - cartTotal;
  const freeShippingReached = difference <= 0;
  const progressPercent = Math.min(100, Math.max(0, (cartTotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Winkelmandje">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E5DFD4]">
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4A5D3E]" />
              <h2 className="font-serif text-xl font-medium text-[#1F2E1E]">Jouw Winkelmand</h2>
              <span className="text-xs text-[#6F7C6B]">({cart.length} {cart.length === 1 ? 'artikel' : 'artikelen'})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#5C6B59] hover:text-[#1F2E1E] rounded-md transition-colors cursor-pointer"
              aria-label="Sluit winkelmand"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#F2ECE3] px-6 py-3 border-b border-[#E2D9CC] text-xs">
            {freeShippingReached ? (
              <p className="text-[#364931] font-medium flex items-center gap-1.5">
                <span>Je bestelling wordt <strong>gratis verzonden</strong> in Nederland!</span>
              </p>
            ) : (
              <p className="text-[#515E4E]">
                Nog <strong>€{difference.toFixed(2)}</strong> voor <strong>gratis verzending</strong> (vanaf €45)
              </p>
            )}
            <div className="w-full bg-[#E0D7C9] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#4A5D3E] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#EBE5DA]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#556750]">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-[#1F2E1E]">Je mandje is nog leeg</h3>
                  <p className="text-xs text-[#707D6E] max-w-xs">
                    Ontdek onze tincturen, zalven en losse kruidentheeën en voeg je eerste natuurproduct toe.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('products');
                  }}
                  className="px-5 py-2.5 bg-[#4A5D3E] text-white text-xs font-medium rounded-md hover:bg-[#3D4D33] transition-colors cursor-pointer"
                >
                  Bekijk assortiment
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-start">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md border border-[#E0D7C9] bg-[#EAE3D6] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium text-[#1F2E1E] leading-snug truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#9BA596] hover:text-[#8E2A2B] transition-colors p-1 cursor-pointer"
                        aria-label={`Verwijder ${item.product.name}`}
                        title="Verwijder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#758172] mt-0.5">{item.product.volume}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#D5CDBD] rounded-md bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#5E6D5C] hover:text-[#1F2E1E] transition-colors cursor-pointer"
                          aria-label="Verminder aantal"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#1F2E1E] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#5E6D5C] hover:text-[#1F2E1E] transition-colors cursor-pointer"
                          aria-label="Vermeerder aantal"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#1F2E1E] tabular-nums">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E8E2D8] bg-[#FAF8F5] space-y-4">
              <div className="space-y-1.5 text-xs text-[#5E6D5C]">
                <div className="flex justify-between">
                  <span>Subtotaal</span>
                  <span className="font-medium text-[#1F2E1E] tabular-nums">€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verzendkosten</span>
                  <span className="font-medium text-[#1F2E1E] tabular-nums">
                    {freeShippingReached ? 'Gratis' : '€4.95'}
                  </span>
                </div>
                <div className="border-t border-[#E5DFD4] pt-2 flex justify-between text-sm font-semibold text-[#1F2E1E]">
                  <span>Totaal incl. btw</span>
                  <span className="tabular-nums">
                    €{(cartTotal + (freeShippingReached ? 0 : 4.95)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white font-medium text-sm rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <span>Afrekenen</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#7C8879]">
                Veilig betalen met iDEAL of Bancontact · Geen account nodig
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
