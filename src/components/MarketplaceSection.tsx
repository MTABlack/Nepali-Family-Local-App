import React, { useState } from 'react';
import { MarketItem } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { 
  ShoppingBag, 
  Search, 
  PlusSquare, 
  Phone, 
  Tag, 
  RefreshCw, 
  Plus,
  Home, 
  Cpu, 
  Car, 
  MapPin, 
  X 
} from 'lucide-react';

interface MarketplaceSectionProps {
  currentLang: 'en' | 'np';
  items: MarketItem[];
  onAddItem: (item: Omit<MarketItem, 'id'>) => void;
  selectedDistrict: string;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  currentLang,
  items,
  onAddItem,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Search, Category and Mode states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<'all' | 'buy' | 'sell' | 'exchange' | 'rent'>('all');

  // Contact State overlay
  const [contactingItem, setContactingItem] = useState<MarketItem | null>(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mPrice, setMPrice] = useState('');
  const [mCategory, setMCategory] = useState<'farm' | 'livestock' | 'tools' | 'household' | 'books' | 'mobiles' | 'electronics' | 'vehicles' | 'property' | 'furniture' | 'clothing'>('farm');
  const [mCustomClass, setMCustomClass] = useState<string>('Agriculture Products');
  const [mMode, setMMode] = useState<'sell' | 'exchange' | 'rent'>('sell');
  const [mDesc, setMDesc] = useState('');
  const [mSeller, setMSeller] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mCondition, setMCondition] = useState<'new' | 'used' | 'organic'>('organic');
  const [mDistrict, setMDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  // 9 Required Categories list
  const CATEGORIES = [
    { key: 'all', label: currentLang === 'en' ? 'All Items' : 'सबै सामान' },
    { key: 'mobiles', label: currentLang === 'en' ? 'Mobiles' : 'मोवाईल' },
    { key: 'electronics', label: currentLang === 'en' ? 'Electronics' : 'इलेक्ट्रोनिक्स' },
    { key: 'vehicles', label: currentLang === 'en' ? 'Vehicles' : 'सवारी र कार' },
    { key: 'property', label: currentLang === 'en' ? 'Property' : 'घरजग्गा / कोठा' },
    { key: 'furniture', label: currentLang === 'en' ? 'Furniture' : 'फर्निचर' },
    { key: 'clothing', label: currentLang === 'en' ? 'Clothing' : 'लत्ताकपडा' },
    { key: 'farm', label: currentLang === 'en' ? 'Agriculture' : 'कृषि तथा तरकारी' },
    { key: 'tools', label: currentLang === 'en' ? 'Tools' : 'औजार र उपकरण' },
    { key: 'books', label: currentLang === 'en' ? 'Books' : 'किताब / शैक्षिक' }
  ];

  const handlePostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim() || !mPrice.trim() || !mSeller.trim() || !mPhone.trim()) return;

    // Call state addition
    onAddItem({
      title: mTitle.trim(),
      price: mPrice.trim() + (mMode === 'rent' ? ' / month' : mMode === 'exchange' ? ' (Exchange Option)' : ''),
      category: mCategory as any, // maps to baseline or handles custom mapping in view
      description: `[${mMode.toUpperCase()}] ` + mDesc.trim(),
      sellerName: mSeller.trim(),
      sellerPhone: mPhone.trim(),
      condition: mCondition,
      district: mDistrict
    });

    setMTitle('');
    setMPrice('');
    setMDesc('');
    setMSeller('');
    setMPhone('');
    setShowForm(false);
  };

  // Filter listings
  const filteredListings = items.filter((item) => {
    const matchesDistrict = !selectedDistrict || item.district === selectedDistrict;

    const matchesCategory = activeCategory === 'all' || 
      item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      item.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
      item.description.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (activeCategory === 'mobiles' && item.title.toLowerCase().includes('mobile')) ||
      (activeCategory === 'electronics' && item.title.toLowerCase().includes('tv') || item.title.toLowerCase().includes('fridge')) ||
      (activeCategory === 'vehicles' && item.title.toLowerCase().includes('bike') || item.title.toLowerCase().includes('scooty'));

    // Mode filter: checks keyword in description like [RENT] or [EXCHANGE]
    const matchesMode = activeMode === 'all' || 
      (activeMode === 'sell' && !item.description.includes('[RENT]') && !item.description.includes('[EXCHANGE]')) ||
      (activeMode === 'exchange' && item.description.includes('[EXCHANGE]')) ||
      (activeMode === 'rent' && item.description.includes('[RENT]')) ||
      (activeMode === 'buy' && item.title.toLowerCase().includes('wanted') || item.description.toLowerCase().includes('wanted'));

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDistrict && matchesCategory && matchesMode && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display font-black text-stone-900 text-xl flex items-center gap-2">
            <ShoppingBag className="text-emerald-800" />
            <span>{currentLang === 'en' ? 'Haat Bazaar & Trade Circle' : 'हाट बजार र स्थानीय व्यापार'}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {currentLang === 'en'
              ? 'Buy, sell, exchange, or rent vehicles, mobiles, farm crop overflows, textbooks, and heavy equipment.'
              : 'मकैको बीउदेखि कोठाभाडा, ट्रयाक्टर भाडा र सेकेन्डह्याण्ड बाइकसम्म सबै खरिद बिक्री गर्नुहोस्।'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus size={16} />
          <span>{currentLang === 'en' ? 'List Item for Sale / Rent' : 'बजारमा विज्ञापन दर्ता गर्नुहोस्'}</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white border border-stone-200 p-4 rounded-3xl shadow-sm space-y-4">
        
        {/* Search Input bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentLang === 'en' ? 'Search smartphones, local grains, property, tools...' : 'के खोज्न चाहनुहुन्छ? (उदा. मोटरसाइकल, कोठा भाडा, तरकारी)...'}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 border border-stone-300 rounded-2xl bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* Function Modes selectors */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-3">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-2">Listing Mode:</span>
          {(['all', 'buy', 'sell', 'exchange', 'rent'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider transition ${
                activeMode === mode
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-stone-50 border border-stone-200/60 hover:bg-stone-100 text-stone-600'
              }`}
            >
              • {mode}
            </button>
          ))}
        </div>

        {/* 9 Categories selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                activeCategory === cat.key
                  ? 'bg-emerald-900 text-white'
                  : 'bg-stone-100 text-stone-605 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* FORM OVERLAY OR EXPANSION PANEL */}
      {showForm && (
        <form onSubmit={handlePostItem} className="bg-amber-50/50 border border-amber-250 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-black text-amber-955 text-sm">
              🛍️ {currentLang === 'en' ? 'Post item to Haat Bazaar Trading Lane' : 'हाट बजारमा सामानको विवरण थप्नुहोस्'}
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-700">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Item Title / Gadget Name:</label>
              <input type="text" required value={mTitle} onChange={(e) => setMTitle(e.target.value)} placeholder="e.g. Poco F3 Dual Sim 128GB" className="w-full bg-white p-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Pricing (NPR):</label>
              <input type="text" required value={mPrice} onChange={(e) => setMPrice(e.target.value)} placeholder="e.g. NPR 12,000 or Free if gifting" className="w-full bg-white p-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Functional Mode Type:</label>
              <select value={mMode} onChange={(e) => setMMode(e.target.value as any)} className="w-full bg-white p-2.5 border rounded-lg">
                <option value="sell">For Sale (सिधै बिक्री)</option>
                <option value="exchange">Exchange (सामान साट्ने)</option>
                <option value="rent">Rent (भाडामा / Lease)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="col-span-1 md:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Trade Category:</label>
              <select value={mCategory} onChange={(e) => setMCategory(e.target.value as any)} className="w-full bg-white p-2.5 border rounded-lg">
                <option value="mobiles">Mobiles (मोवाईल)</option>
                <option value="electronics">Electronics (इलेक्ट्रोनिक्स)</option>
                <option value="vehicles">Vehicles (सवारी साधन)</option>
                <option value="property">Property / Rooms (घरजग्गा कोठा)</option>
                <option value="furniture">Furniture (फर्निचर)</option>
                <option value="clothing">Clothing (लत्ताकपडा)</option>
                <option value="farm">Agriculture Products (कृषि)</option>
                <option value="tools">Tools (औजार उपकरण)</option>
                <option value="books">Books & Education (किताबहरू)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Item Condition:</label>
              <select value={mCondition} onChange={(e) => setMCondition(e.target.value as any)} className="w-full bg-white p-2.5 border rounded-lg">
                <option value="organic">Organic / Clean (अर्गानिक / ताजा)</option>
                <option value="new">Brand New (नयाँ)</option>
                <option value="used">Used / Second-hand (प्रयोग गरिएको)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('selectDistrict')}:</label>
              <select value={mDistrict} onChange={(e) => setMDistrict(e.target.value)} className="w-full bg-white p-2.5 border rounded-lg">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Your Full Name:</label>
              <input type="text" required value={mSeller} onChange={(e) => setMSeller(e.target.value)} placeholder="Ramesh Adhikari" className="w-full bg-white p-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Mobile phone:</label>
              <input type="tel" required value={mPhone} onChange={(e) => setMPhone(e.target.value)} placeholder="9851020304" className="w-full bg-white p-2.5 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Item Description / Exchange preferences / Pickup coordinate details:</label>
            <textarea required rows={2} value={mDesc} onChange={(e) => setMDesc(e.target.value)} placeholder="Provide information on visual scratch details, warranty cards, bill presence, organic pesticides used in crops..." className="w-full text-xs bg-white p-3 border rounded-lg focus:outline-none" />
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-xl">Cancel</button>
            <button type="submit" className="bg-emerald-900 text-white px-5 py-2 rounded-xl shadow">Publish Ad</button>
          </div>
        </form>
      )}

      {/* RENDER GRID CARDS */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12 text-stone-400 bg-stone-50 border border-dashed rounded-3xl">
          😢 {currentLang === 'en' ? 'No trade items found matching your filter specs.' : 'यहाँ कुनै पनि सामान सूचीकृत गरिएको छैन।'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => {
            const isRent = item.description.includes('[RENT]');
            const isExchange = item.description.includes('[EXCHANGE]');
            const isOrganic = item.condition === 'organic';

            return (
              <div key={item.id} className="bg-white border border-stone-200 rounded-3xl p-5 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
                
                {/* Title & Classification */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono font-bold bg-amber-50 uppercase tracking-widest border border-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      🏷️ {item.category}
                    </span>

                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono ${
                      isRent 
                        ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                        : isExchange 
                        ? 'bg-blue-50 border border-blue-200 text-blue-800' 
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    }`}>
                      {isRent ? 'For Rent' : isExchange ? 'Exchange' : 'For Sale'}
                    </span>
                  </div>

                  <h4 className="font-display font-black text-stone-900 text-base leading-tight">
                    {item.title}
                  </h4>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {item.description.replace('[RENT]', '').replace('[EXCHANGE]', '').trim()}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-105 border px-2 py-0.5 rounded font-mono">
                      {item.condition} Quality
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">📍 {item.district}</span>
                  </div>
                </div>

                {/* Pricing & Call CTA bar */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-none">Price / Offer</p>
                    <p className="text-emerald-900 font-display font-black text-base sm:text-lg mt-0.5">
                      {item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => setContactingItem(item)}
                    className="bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition shadow-sm"
                  >
                    <Phone size={11} />
                    <span>Contact Seller</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* SELLER CONTACT OVERLAY MODAL */}
      {contactingItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150 relative">
            
            <button
              onClick={() => setContactingItem(null)}
              className="absolute right-5 top-5 text-stone-400 hover:text-stone-700"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-2 pt-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 border flex items-center justify-center text-amber-850">
                <ShoppingBag size={24} />
              </div>
              <h4 className="font-display font-black text-stone-900 text-base leading-snug">
                Contact Seller for "{contactingItem.title}"
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Bargain fairly. Tell them you found this listing via the <span className="font-bold underline text-emerald-900">Nepali Family App</span> to build mutual trust.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between">
                <span>Seller Name:</span>
                <span className="font-bold text-stone-900">{contactingItem.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Listed Price:</span>
                <span className="font-extrabold text-emerald-900">{contactingItem.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Neighborhood:</span>
                <span className="font-semibold text-stone-750">📍 {contactingItem.district} Circle</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`tel:${contactingItem.sellerPhone}`}
                className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-black text-xs sm:text-sm py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <Phone size={15} />
                <span>Call Seller: {contactingItem.sellerPhone}</span>
              </a>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              *Never dispatch money in advance before verifying local crop or equipment face-to-face.
            </p>

          </div>
        </div>
      )}

    </div>
  );
};
