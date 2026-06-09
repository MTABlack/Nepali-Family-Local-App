import React, { useState } from 'react';
import { MarketItem } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { ShoppingBag, Phone, Plus, Tag, Search, Compass, AlertCircle } from 'lucide-react';

interface HaatBazaarProps {
  currentLang: 'en' | 'np';
  items: MarketItem[];
  onAddItem: (item: Omit<MarketItem, 'id'>) => void;
  selectedDistrict: string;
}

export const HaatBazaar: React.FC<HaatBazaarProps> = ({
  currentLang,
  items,
  onAddItem,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'farm' | 'livestock' | 'tools' | 'household' | 'books'>('all');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [itemCat, setItemCat] = useState<MarketItem['category']>('farm');
  const [condition, setCondition] = useState<MarketItem['condition']>('organic');
  const [desc, setDesc] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [district, setDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !sellerName.trim() || !sellerPhone.trim()) return;

    onAddItem({
      title,
      price: price.startsWith('NPR') ? price : `NPR ${price}`,
      category: itemCat,
      condition,
      description: desc,
      sellerName,
      sellerPhone,
      district
    });

    // Reset
    setTitle('');
    setPrice('');
    setDesc('');
    setSellerName('');
    setSellerPhone('');
    setShowForm(false);
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesDistrict = selectedDistrict ? item.district === selectedDistrict : true;
    const matchesCategory = category === 'all' ? true : item.category === category;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) || 
                          item.sellerName.toLowerCase().includes(search.toLowerCase());
    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Informative Banner */}
      <div className="bg-amber-100/75 border border-amber-300 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-amber-955 text-lg flex items-center gap-1.5">
            🌾 {currentLang === 'en' ? 'Sajha Haat Bazaar' : 'साझा हाट बजार'}
          </h3>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {currentLang === 'en'
              ? 'Buy and sell locally grown vegetables, seeds, mountain livestock, or used tools directly. Support rural farmers and avoid high merchant cuts.'
              : 'किसान र उपभोक्ताबीच सिधा व्यापार गर्ने मञ्च। आफ्नै घरगोठको बोका, अर्गानिक स्याउ, पुराना कृषि औजार वा विद्यालयका पुस्तकहरू बिना कमिसन बेच्नुहोस्।'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-800 hover:bg-amber-900 text-stone-100 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl text-center shadow whitespace-nowrap shrink-0 transition"
        >
          ➕ {t('sellNewItem')}
        </button>
      </div>

      {/* Form modal block */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <h4 className="font-display font-bold text-amber-950 text-base">
            🛒 {currentLang === 'en' ? 'Add Item Listing' : 'नयाँ सामाग्री बजारमा राख्नुहोस्'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('title')}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Free-Range Local Rooster"
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('price')}</label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State / Condition:</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800 text-xs"
                >
                  <option value="organic">{t('organic')}</option>
                  <option value="used">{t('used')}</option>
                  <option value="new">{t('new')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('category')}</label>
              <select
                value={itemCat}
                onChange={(e) => setItemCat(e.target.value as any)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              >
                <option value="farm">🌽 {t('farm')}</option>
                <option value="livestock">🐐 {t('livestock')}</option>
                <option value="tools">🔨 {t('tools')}</option>
                <option value="household">🏠 {t('household')}</option>
                <option value="books">📚 {t('books')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              >
                {DISTRICTS.map((dis) => (
                  <option key={dis} value={dis}>{dis}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('desc')}</label>
            <textarea
              required
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe weight, age, origin, organic certifications, or delivery method..."
              className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('name')}</label>
              <input
                type="text"
                required
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Mina Gurung"
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('phone')}</label>
              <input
                type="text"
                required
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                placeholder="e.g. 984XXXXXXXX"
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-stone-300 hover:bg-stone-400 text-stone-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      )}

      {/* Filter Toggles and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              category === 'all'
                ? 'bg-amber-800 text-stone-100 shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            📦 {currentLang === 'en' ? 'Show All Products' : 'सम्पूर्ण सामानहरू'}
          </button>
          <button
            onClick={() => setCategory('farm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              category === 'farm'
                ? 'bg-amber-800 text-stone-100 shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🌽 {t('farm')}
          </button>
          <button
            onClick={() => setCategory('livestock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              category === 'livestock'
                ? 'bg-amber-800 text-stone-100 shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🐐 {t('livestock')}
          </button>
          <button
            onClick={() => setCategory('tools')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              category === 'tools'
                ? 'bg-amber-800 text-stone-100 shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🔨 {t('tools')}
          </button>
          <button
            onClick={() => setCategory('household')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              category === 'household'
                ? 'bg-amber-800 text-stone-100 shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🏠 {t('household')}
          </button>
          <button
            onClick={() => setCategory('books')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              category === 'books'
                ? 'bg-amber-800 text-stone-100 shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            📚 {t('books')}
          </button>
        </div>

        <div className="relative w-full md:max-w-xs shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 bg-white"
          />
        </div>
      </div>

      {/* Grid listing */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <Compass className="mx-auto text-stone-300 mb-2" size={32} />
          <p className="text-stone-500 text-sm">
            {currentLang === 'en' 
              ? 'No products matching this search are listed in this district yet.' 
              : 'यस जिल्लामा अझै कुनै सामान खरिद बिक्रीको लागि सूचीबद्ध गरिएको छैन।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-2xl hover:shadow-lg transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-extrabold font-mono tracking-wider ${
                    item.condition === 'organic' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : item.condition === 'new' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {t(item.condition)}
                  </span>
                  
                  <span className="text-[11px] text-stone-500 font-mono">
                    📍 {item.district}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-black text-stone-900 group-hover:text-amber-800 text-base leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">{t('price')}</span>
                  <span className="text-amber-900 font-display font-extrabold text-base">
                    {item.price}
                  </span>
                </div>

                <div className="border-t border-stone-200/50 pt-2.5 flex items-center justify-between text-xs text-stone-700">
                  <div className="leading-tight">
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest">Seller</p>
                    <p className="font-bold text-stone-800">{item.sellerName}</p>
                  </div>
                  
                  <a
                    href={`tel:${item.sellerPhone}`}
                    className="flex items-center gap-1 bg-amber-800 hover:bg-amber-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    <Phone size={11} />
                    <span>Call Seller</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning/Bargaining Notice box */}
      <div className="bg-stone-50/90 rounded-xl p-3 border border-stone-200/80 flex items-start gap-2.5 text-xs text-stone-500">
        <AlertCircle size={15} className="text-stone-400 shrink-0 mt-0.5" />
        <p>
          {currentLang === 'en'
            ? 'Bargaining Handshakes (Bargain system) is respected: Speak politely over phones. Always meet in open public junctions or chowks for safety when buying/selling cattle or costly farming tools.'
            : 'पारस्परिक छलफलको सम्मान गर्नुहोस्: फोनमा विनम्र संवाद गर्नुहोस्। पशु वा महँगो कृषि सामाग्री खरिद गर्दा सधैं चौतारीमा वा सार्वजनिक ठाउँमा भेटघाट गर्नुहोस्।'}
        </p>
      </div>

    </div>
  );
};

// Form names mapping helper supporting react component inline scoping
function setNewSellerName(val: string) {
  // Empty placeholder helper
}
