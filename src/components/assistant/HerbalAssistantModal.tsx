import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Herb } from '../../types';
import { resolveImageUrl } from '../../assets/images';
import { X, Send, Sparkles, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedHerbs?: Herb[];
  matchedProducts?: Product[];
  timestamp: string;
}

export const HerbalAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    herbs,
    products,
    addToCart,
    navigate,
  } = useStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Welkom bij onze Botanische Kruidengids. Vertel me waar je naar op zoek bent of welke fysieke behoefte je ervaart (bijvoorbeeld rondom nachtrust, luchtwegen, schrale huid of stramme spieren). Ik gids je graag door onze kruiden en producten.',
      timestamp: 'Zojuist',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAssistantOpen]);

  if (!isAssistantOpen) return null;

  const quickQuestions = [
    'Ik slaap onrustig en zoek ontspanning',
    'Ik zoek iets rondom hooikoorts & ademhaling',
    'Mijn huid is schraal en droog door het weer',
    'Stijve gewrichten en spieren na fysiek werk',
    'Milde kruidenthee voor een rustige buik',
  ];

  const findBotanicalRecommendations = (query: string) => {
    const q = query.toLowerCase();

    // Check thematic keywords
    let matchedHerbList: Herb[] = [];
    let matchedProductList: Product[] = [];

    if (q.includes('slaap') || q.includes('rust') || q.includes('onrust') || q.includes('nacht') || q.includes('pieker')) {
      matchedHerbList = herbs.filter(h => ['echte-kamille', 'lavendel', 'valeriaan', 'citroenmelisse'].includes(h.id));
      matchedProductList = products.filter(p => p.applicationCategory === 'Rust & Slaap').slice(0, 3);
    } else if (q.includes('hooikoorts') || q.includes('luchtweg') || q.includes('keel') || q.includes('verkoud') || q.includes('adem') || q.includes('hoest')) {
      matchedHerbList = herbs.filter(h => ['echte-tijm', 'salie', 'zwarte-vlier'].includes(h.id));
      matchedProductList = products.filter(p => p.applicationCategory === 'Weerstand & Luchtwegen').slice(0, 3);
    } else if (q.includes('huid') || q.includes('droog') || q.includes('schraal') || q.includes('kloof') || q.includes('wond') || q.includes('eczeem') || q.includes('rood')) {
      matchedHerbList = herbs.filter(h => ['goudsbloem', 'echte-kamille'].includes(h.id));
      matchedProductList = products.filter(p => p.applicationCategory === 'Huid & Verzorging').slice(0, 3);
    } else if (q.includes('spier') || q.includes('gewricht') || q.includes('pijn') || q.includes('stijf') || q.includes('rug') || q.includes('knie') || q.includes('tuin')) {
      matchedHerbList = herbs.filter(h => ['smeerwortel', 'sint-janskruid', 'rozemarijn'].includes(h.id));
      matchedProductList = products.filter(p => p.applicationCategory === 'Spieren & Gewrichten').slice(0, 3);
    } else if (q.includes('buik') || q.includes('maag') || q.includes('spijsvertering') || q.includes('darm') || q.includes('kramp') || q.includes('cyclus')) {
      matchedHerbList = herbs.filter(h => ['echte-kamille', 'duizendblad', 'vrouwenmantel', 'citroenmelisse'].includes(h.id));
      matchedProductList = products.filter(p => p.applicationCategory === 'Spijsvertering & Buik').slice(0, 3);
    } else if (q.includes('energie') || q.includes('focus') || q.includes('moe') || q.includes('vitaliteit') || q.includes('concentratie')) {
      matchedHerbList = herbs.filter(h => ['rozemarijn', 'grote-brandnetel'].includes(h.id));
      matchedProductList = products.filter(p => p.applicationCategory === 'Vitaliteit & Focus').slice(0, 3);
    } else {
      // General search over names and descriptions
      matchedHerbList = herbs.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.shortDescription.toLowerCase().includes(q) ||
        h.traditionalUses.some(u => u.toLowerCase().includes(q))
      ).slice(0, 2);

      matchedProductList = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.ingredients.some(i => i.toLowerCase().includes(q))
      ).slice(0, 3);

      if (matchedProductList.length === 0) {
        matchedProductList = products.filter(p => p.featured).slice(0, 2);
      }
    }

    return { matchedHerbList, matchedProductList };
  };

  const handleSend = (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: 'Nu',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { matchedHerbList, matchedProductList } = findBotanicalRecommendations(question);

      let replyText = '';
      if (question.toLowerCase().includes('hooikoorts') || question.toLowerCase().includes('adem')) {
        replyText = `Traditioneel worden tijm, salie en vlierbloesem gekoesterd om de slijmvliezen te kalmeren en de luchtwegen te verruimen. Onze Tijm & Salie tinctuur en de Vrij Ademen theemelange zijn door onze herborist specifiek afgestemd op seizoensgebonden prikkelingen.`;
      } else if (question.toLowerCase().includes('slaap') || question.toLowerCase().includes('rust')) {
        replyText = `Voor het zenuwstelsel en een natuurlijke nachtrust zijn kamille, valeriaanwortel en lavendel de hoekstenen van onze tuin. Onze Kamille & Melisse tinctuur kalmeert het hoofd, terwijl de Avondrust kruidenthee een zacht avondritueel vormt.`;
      } else if (question.toLowerCase().includes('huid') || question.toLowerCase().includes('droog')) {
        replyText = `Goudsbloem (Calendula) is de zonnebloem van onze kruidentuin voor kwetsbare, schrale huid. Onze handgemaakte Calendula Wonderzalf en zacht kamille-extract bieden pure hydratatie en bescherming zonder synthetische toevoegingen.`;
      } else if (question.toLowerCase().includes('spier') || question.toLowerCase().includes('stijf')) {
        replyText = `Bij overbelaste spieren en stramme gewrichten zetten we de diepe aarde-kracht van smeerwortel en verwarmend sint-janskruid in. Onze Smeerwortel Gewrichtszalf helpt het weefsel weer soepel te voelen.`;
      } else {
        replyText = `Op basis van jouw vraag heb ik de meest aansluitende kruiden en ambachtelijke bereidingen uit ons atelier voor je geselecteerd:`;
      }

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        matchedHerbs: matchedHerbList,
        matchedProducts: matchedProductList,
        timestamp: 'Nu',
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Botanische Kruidengids">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAssistantOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E0D7C9] flex flex-col h-[85vh] max-h-[720px] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F2ECE3] border-b border-[#E2D9CC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A5D3E] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#EBE5DA]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1F2E1E]">Botanische Kruidengids</h3>
              <p className="text-[11px] text-[#657362]">Persoonlijke wegwijzer door de kruidenkennis van 't Vosjeskruid</p>
            </div>
          </div>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1.5 text-[#5C6B59] hover:text-[#1F2E1E] rounded-md transition-colors cursor-pointer"
            aria-label="Sluit gids"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical Disclaimer Banner */}
        <div className="bg-[#EAE2D5] px-6 py-2 border-b border-[#DDD3C3] flex items-start gap-2 text-[11px] text-[#4A5746]">
          <AlertCircle className="w-3.5 h-3.5 text-[#735A2D] shrink-0 mt-0.5" />
          <span>
            <strong>Kruidenwijsheid, geen medisch voorschrift:</strong> Deze gids geeft traditionele kruidenkennis weer en stelt geen diagnoses. Raadpleeg bij aanhoudende klachten altijd een arts.
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 text-xs sm:text-[13px] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#4A5D3E] text-white'
                    : 'bg-white border border-[#E5DFD4] text-[#243323] shadow-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Linked Botanical Herbs */}
                {msg.matchedHerbs && msg.matchedHerbs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EAE3D6]">
                    <span className="block text-[11px] font-semibold text-[#5B6A58] uppercase tracking-wider mb-1.5">
                      Relevante kruiden uit onze tuin:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.matchedHerbs.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => {
                            setIsAssistantOpen(false);
                            navigate('herb-detail', { herbId: h.id });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EFEA] hover:bg-[#EAE2D7] text-[#2A3928] rounded text-xs border border-[#DCD3C4] transition-colors cursor-pointer"
                        >
                          <span className="font-medium">{h.name}</span>
                          <span className="italic text-[10px] text-[#697866]">({h.botanicalName})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Products Cards */}
                {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EAE3D6] space-y-2">
                    <span className="block text-[11px] font-semibold text-[#5B6A58] uppercase tracking-wider">
                      Aanbevolen natuurproducten:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#FAF8F5] border border-[#E2DACB] rounded-md p-2.5 flex flex-col justify-between"
                        >
                          <div className="flex gap-2.5 items-start">
                            <img
                              src={resolveImageUrl(prod.images[0])}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded bg-[#E4DDD0] shrink-0 border border-[#D5CDBD]"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <h5 className="font-medium text-xs text-[#1F2E1E] truncate">{prod.name}</h5>
                              <p className="text-[11px] text-[#717E6F]">{prod.volume}</p>
                              <p className="text-xs font-semibold text-[#1F2E1E] tabular-nums mt-0.5">
                                €{prod.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-[#EBE4D8] flex gap-1.5">
                            <button
                              onClick={() => {
                                setIsAssistantOpen(false);
                                navigate('product-detail', { productId: prod.id });
                              }}
                              className="flex-1 py-1 text-[11px] text-[#415337] hover:text-[#1F2E1E] text-center font-medium bg-white border border-[#D5CDBD] rounded hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                            >
                              Bekijk
                            </button>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="px-2 py-1 text-[11px] bg-[#4A5D3E] text-white rounded hover:bg-[#3D4D33] transition-colors flex items-center justify-center cursor-pointer"
                              title="In mandje"
                            >
                              <ShoppingBag className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#8C9887] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-[#6B7B68] italic p-2 bg-white/70 border border-[#EAE3D6] rounded-md w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>De herborist raadpleegt de botanische kennisbank...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 bg-[#F6F2EB] border-t border-[#E8E1D5] overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-left text-[11px] whitespace-nowrap bg-white hover:bg-[#EAE3D6] text-[#344631] px-2.5 py-1 rounded border border-[#DDD3C3] transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-[#E2D9CC] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Beschrijf je vraag (bijv. 'Wat helpt bij rusteloze nachten?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#FAF8F5] border border-[#D5CDBD] rounded-md px-3.5 py-2 text-xs sm:text-sm text-[#1F2E1E] placeholder:text-[#8D9989] focus:outline-none focus:ring-1 focus:ring-[#4A5D3E]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 sm:px-4 sm:py-2 bg-[#4A5D3E] disabled:bg-[#BAC6B5] text-white rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Vraag</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
