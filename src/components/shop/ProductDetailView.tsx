import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Star, Plus, Minus, ArrowLeft, Leaf, Check, Sparkles } from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    herbs,
    reviews,
    selectedProductId,
    navigate,
    addToCart,
    addReview,
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState(product?.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Product niet gevonden.</p>
        <button onClick={() => navigate('products')} className="mt-4 text-[#4A5D3E] underline">
          Terug naar overzicht
        </button>
      </div>
    );
  }

  // Linked herbs
  const linkedHerbs = herbs.filter(h => product.herbIds.includes(h.id));

  // Related products ("Dit past goed bij")
  const relatedProducts = products.filter(p => product.relatedProductIds.includes(p.id) || (p.applicationCategory === product.applicationCategory && p.id !== product.id)).slice(0, 3);

  // Reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    addReview({
      productId: product.id,
      authorName: newAuthor.trim(),
      rating: newRating,
      title: newTitle.trim() || 'Fijn natuurlijk product',
      comment: newComment.trim(),
      verifiedPurchase: true,
    });

    setReviewFormOpen(false);
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back breadcrumb */}
      <div>
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634F] hover:text-[#1E2E1D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Terug naar alle producten</span>
        </button>
      </div>

      {/* Main PDP Grid: Gallery (Left) & Contiguous Purchase Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#EFE9DF] border border-[#E0D7C9] relative shadow-xs">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#FAF8F5]/90 text-[#30412D] text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    (selectedImage || product.images[0]) === img
                      ? 'border-[#4A5D3E] shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} foto ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Artisanal Trust Callout */}
          <div className="bg-[#F4EFEA] border border-[#E3DBCF] rounded-xl p-4 text-xs text-[#52624F] space-y-2">
            <div className="flex items-center gap-2 font-medium text-[#2C3D29]">
              <Leaf className="w-4 h-4 text-[#4A5D3E]" />
              <span>Gemaakt in ons Brabantse atelier</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Al onze bereidingen worden met toewijding in kleine oplagen vervaardigd. Vrij van microplastics, synthetische conservering en minerale aardoliën.
            </p>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#6F7D6E]">
              <span>{product.productType}</span>
              <span>·</span>
              <span>{product.applicationCategory}</span>
              <span>·</span>
              <span>{product.volume}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#1E2E1D] leading-tight">
              {product.name}
            </h1>

            <p className="text-sm font-medium text-[#4F604C]">
              {product.subtitle}
            </p>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 pt-2">
              <span className="font-serif text-3xl font-medium text-[#1E2E1D] tabular-nums">
                €{product.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7968]">
                <div className="flex text-[#C08535]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Short Intro */}
          <p className="text-xs sm:text-sm text-[#556452] leading-relaxed border-t border-b border-[#E8E2D9] py-4">
            {product.shortDescription}
          </p>

          {/* Stock Indicator */}
          <div className="text-xs">
            {isOutOfStock ? (
              <span className="text-[#8E2A2B] font-medium">Tijdelijk uitverkocht</span>
            ) : product.stock < 5 ? (
              <span className="text-[#A44A32] font-medium">Nog slechts {product.stock} stuks beschikbaar</span>
            ) : (
              <span className="text-[#4A5D3E] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Direct leverbaar uit ons atelier
              </span>
            )}
          </div>

          {/* Purchase Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#D5CDBD] rounded-md bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="p-2 text-[#5E6D5C] hover:text-[#1E2E1D] cursor-pointer"
                  aria-label="Verminder aantal"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium text-[#1E2E1D] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="p-2 text-[#5E6D5C] hover:text-[#1E2E1D] cursor-pointer"
                  aria-label="Vermeerder aantal"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-6 bg-[#4A5D3E] hover:bg-[#3D4D33] disabled:bg-[#D5CDBD] disabled:text-[#888] text-white font-medium text-sm rounded-md transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>In winkelmand (€{(product.price * quantity).toFixed(2)})</span>
              </button>
            </div>

            <p className="text-[11px] text-[#717E6F] text-center sm:text-left">
              Gratis verzending vanaf €45 · Levering binnen 1-3 werkdagen
            </p>
          </div>

          {/* Structured Information Accordions / Cards */}
          <div className="space-y-4 pt-4 border-t border-[#E8E2D9] text-xs">
            {/* Gebruik */}
            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-4 space-y-1.5">
              <h3 className="font-semibold text-[#293B27] uppercase tracking-wider text-[11px]">
                Gebruik &amp; Dosering
              </h3>
              <p className="text-[#596856] leading-relaxed">
                {product.usageInstructions}
              </p>
            </div>

            {/* Ingrediënten */}
            <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-[#293B27] uppercase tracking-wider text-[11px]">
                100% Zuivere Ingrediënten
              </h3>
              <ul className="space-y-1 text-[#596856]">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#4A5D3E] mt-0.5">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bewaaradvies */}
            {product.additionalInfo && (
              <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-4 space-y-1.5">
                <h3 className="font-semibold text-[#293B27] uppercase tracking-wider text-[11px]">
                  Aanvullende Informatie &amp; Bewaaradvies
                </h3>
                <p className="text-[#596856] leading-relaxed">
                  {product.additionalInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uitgebreide beschrijving */}
      <section className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-2xl p-8 sm:p-12 space-y-4">
        <h2 className="font-serif text-2xl text-[#1E2E1D]">
          Over deze Ambachtelijke Creatie
        </h2>
        <div className="prose text-xs sm:text-sm text-[#4E5E4C] leading-relaxed max-w-none space-y-3">
          <p>{product.longDescription}</p>
        </div>
      </section>

      {/* "Meer weten over het kruid?" Section */}
      {linkedHerbs.length > 0 && (
        <section className="space-y-6 border-t border-[#E8E2D9] pt-12">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
              Botanische Kennis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
              Meer weten over het kruid?
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B5A]">
              Ontdek de herkomst, teeltwijze en traditionele toepassing in onze kruidencatalogus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {linkedHerbs.map((herb) => (
              <div
                key={herb.id}
                onClick={() => navigate('herb-detail', { herbId: herb.id })}
                className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-xl p-5 hover:border-[#4A5D3E] hover:shadow-md transition-all cursor-pointer group flex gap-5 items-center"
              >
                <img
                  src={herb.image}
                  alt={herb.name}
                  className="w-24 h-24 object-cover rounded-lg bg-[#EAE2D5] shrink-0 border border-[#D5CDBD]"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors">
                    {herb.name}
                  </h3>
                  <p className="italic text-xs text-[#6F7E6E] font-serif">
                    {herb.botanicalName}
                  </p>
                  <p className="text-xs text-[#5D6C5B] line-clamp-2">
                    {herb.shortDescription}
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold text-[#4A5D3E] pt-1">
                    Lees kruidenprofiel &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* "Dit past goed bij" Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-[#E8E2D9] pt-12">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#63745F] font-semibold">
              Complementaire Zorg
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
              Dit past goed bij {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B5A]">
              Producten die elkaar versterken in geur, werking of dagelijks gebruik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div
                  onClick={() => navigate('product-detail', { productId: rel.id })}
                  className="cursor-pointer space-y-3"
                >
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#EAE3D6]">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71806F] uppercase">{rel.productType}</span>
                    <h4 className="font-serif text-base text-[#1E2E1D] group-hover:text-[#4A5D3E] transition-colors leading-snug">
                      {rel.name}
                    </h4>
                    <p className="text-xs font-medium text-[#1E2E1D] mt-1 tabular-nums">
                      €{rel.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EBE4D8] mt-3 flex gap-2">
                  <button
                    onClick={() => navigate('product-detail', { productId: rel.id })}
                    className="flex-1 py-1 text-xs text-[#3E4F3B] bg-[#F2ECE3] hover:bg-[#EAE2D6] rounded text-center transition-colors cursor-pointer"
                  >
                    Bekijk
                  </button>
                  <button
                    onClick={() => addToCart(rel, 1)}
                    className="p-1.5 bg-[#4A5D3E] hover:bg-[#3D4D33] text-white rounded transition-colors cursor-pointer"
                    title="In mandje"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews & Review-Submission Section */}
      <section className="space-y-6 border-t border-[#E8E2D9] pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2E1D]">
              Klantervaringen ({productReviews.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B5A]">
              Eerlijke reacties van mensen die dit natuurproduct gebruiken.
            </p>
          </div>

          <button
            onClick={() => setReviewFormOpen(!reviewFormOpen)}
            className="px-4 py-2 bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#243421] text-xs font-medium rounded-md border border-[#D5CDBD] cursor-pointer"
          >
            {reviewFormOpen ? 'Annuleer' : 'Schrijf een review'}
          </button>
        </div>

        {/* Review Form Drawer/Box */}
        {reviewFormOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-[#FAF8F5] border border-[#D8CEBC] rounded-xl p-6 space-y-4 max-w-xl"
          >
            <h3 className="font-serif text-lg text-[#1E2E1D]">Deel jouw ervaring</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#4A5947] mb-1 font-medium">Je Naam *</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#4A5947] mb-1 font-medium">Beoordeling</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
                >
                  <option value={5}>5 sterren (Uitstekend)</option>
                  <option value={4}>4 sterren (Goed)</option>
                  <option value={3}>3 sterren (Gemiddeld)</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[#4A5947] mb-1 font-medium">Titel van je review</label>
              <input
                type="text"
                placeholder="Bijv: Heerlijke zachte zalf voor schrale wangen"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
              />
            </div>

            <div className="text-xs">
              <label className="block text-[#4A5947] mb-1 font-medium">Jouw ervaring *</label>
              <textarea
                required
                rows={3}
                placeholder="Beschrijf hoe het product je heeft geholpen..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white border border-[#D5CDBD] rounded p-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#4A5D3E] text-white text-xs font-medium rounded hover:bg-[#3D4D33] cursor-pointer"
            >
              Plaats review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-[#71806F] italic">
              Er zijn nog geen reviews voor dit specifieke product geschreven. Wees de eerste die haar ervaring deelt!
            </p>
          ) : (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl p-5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1E2E1D]">{rev.authorName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-[#4A5D3E] flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Geverifieerde aankoop
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#808E7E]">{rev.date}</span>
                </div>

                <div className="flex text-[#C08535]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <h4 className="font-serif text-sm font-medium text-[#1E2E1D] pt-1">
                  {rev.title}
                </h4>

                <p className="text-[#596956] leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
