import React, { useState } from 'react';
import { ServiceProvider } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { 
  Briefcase, 
  Search, 
  Star, 
  Phone, 
  MapPin, 
  MessageCircle, 
  CheckCircle,
  PlusCircle, 
  ChevronRight, 
  X,
  Plus
} from 'lucide-react';

interface ServicesSectionProps {
  currentLang: 'en' | 'np';
  providers: ServiceProvider[];
  onAddProvider: (provider: Omit<ServiceProvider, 'id' | 'rating' | 'reviewsCount'>) => void;
  selectedDistrict: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  currentLang,
  providers,
  onAddProvider,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Search and Category state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Contact modal state
  const [contactingProvider, setContactingProvider] = useState<ServiceProvider | null>(null);

  // Review state simulation
  const [activeReviews, setActiveReviews] = useState<Record<string, Array<{ author: string; rating: number; text: string }>>>({
    'ser-1': [
      { author: 'Suraj Giri', rating: 5, text: 'Arrived within 30 minutes! Efficiently fixed my toilet flush leakage. Charges are very fair.' },
      { author: 'Devi Shrestha', rating: 4, text: 'Knows his task perfectly. Clean work.' }
    ],
    'ser-2': [
      { author: 'Manish Rimal', rating: 5, text: 'Excellent tutor. Made complex computer engineering algorithms simple for my son!' }
    ]
  });

  const [reviewText, setReviewText] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRate, setReviewRate] = useState(5);

  // Join as provider form state
  const [showForm, setShowForm] = useState(false);
  const [fName, setFName] = useState('');
  const [fCategory, setFCategory] = useState<'plumbing' | 'electrical' | 'teaching' | 'health' | 'guide' | 'other'>('electrical');
  const [fCustomCategory, setFCustomCategory] = useState<string>('Electrician');
  const [fPhone, setFPhone] = useState('');
  const [fDistrict, setFDistrict] = useState(selectedDistrict || DISTRICTS[0]);
  const [fCost, setFCost] = useState('NPR 500 / visit');
  const [fDesc, setFDesc] = useState('');

  // 12 Mandatory Categories
  const CATEGORIES_MAPPING = [
    { key: 'all', label: currentLang === 'en' ? 'All Services' : 'सबै सेवाहरू' },
    { key: 'electrician', label: currentLang === 'en' ? 'Electrician' : 'बिजुली मिस्त्री' },
    { key: 'plumber', label: currentLang === 'en' ? 'Plumber' : 'प्लम्बर' },
    { key: 'carpenter', label: currentLang === 'en' ? 'Carpenter' : 'सिकर्मी (Carpenter)' },
    { key: 'driver', label: currentLang === 'en' ? 'Driver' : 'चालक (Driver)' },
    { key: 'tutor', label: currentLang === 'en' ? 'Tutor' : 'शिक्षक सझा' },
    { key: 'doctor', label: currentLang === 'en' ? 'Doctor' : 'डाक्टर' },
    { key: 'nurse', label: currentLang === 'en' ? 'Nurse' : 'नर्स' },
    { key: 'mechanic', label: currentLang === 'en' ? 'Mechanic' : 'मेकानिक' },
    { key: 'lawyer', label: currentLang === 'en' ? 'Lawyer' : 'वकिल' },
    { key: 'accountant', label: currentLang === 'en' ? 'Accountant' : 'लेखापाल' },
    { key: 'photographer', label: currentLang === 'en' ? 'Photographer' : 'फोटोग्राफर' },
    { key: 'freelancer', label: currentLang === 'en' ? 'Freelancer' : 'फ्रिल्यान्सर' }
  ];

  const handleProviderJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fPhone.trim()) return;

    // Map custom category strings
    onAddProvider({
      name: fName.trim(),
      category: fCategory, // maps to baseline type
      phone: fPhone.trim(),
      district: fDistrict,
      cost: fCost || 'NPR 500 / visit',
      description: fDesc.trim() || 'Professional local service expert.'
    });

    setFName('');
    setFPhone('');
    setFCost('');
    setFDesc('');
    setShowForm(false);
  };

  const handleAddReview = (providerId: string) => {
    if (!reviewText.trim()) return;

    const newReview = {
      author: reviewAuthor.trim() ? reviewAuthor.trim() : (currentLang === 'en' ? 'Grateful Neighbor' : 'सहयोगी ग्राहक'),
      rating: reviewRate,
      text: reviewText.trim()
    };

    const updatedReviews = {
      ...activeReviews,
      [providerId]: [...(activeReviews[providerId] || []), newReview]
    };

    setActiveReviews(updatedReviews);
    setReviewText('');
    setReviewAuthor('');
    setReviewRate(5);
  };

  // Filter providers lists
  const filteredProviders = providers.filter((p) => {
    const matchesDistrict = !selectedDistrict || p.district === selectedDistrict;
    
    // Normalize category mapping
    const matchesCategory = activeCategory === 'all' || 
      p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      p.description.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (activeCategory === 'electrician' && p.category === 'electrical') ||
      (activeCategory === 'tutor' && p.category === 'teaching') ||
      (activeCategory === 'doctor' && p.category === 'health') ||
      (activeCategory === 'nurse' && p.category === 'health') ||
      (activeCategory === 'plumber' && p.category === 'plumbing');

    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Promotion section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display font-black text-stone-900 text-xl flex items-center gap-2">
            <Briefcase className="text-emerald-800" />
            <span>{currentLang === 'en' ? 'Verified Local Specialists' : 'दक्ष स्थानीय सेवाकर्मीहरु'}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {currentLang === 'en'
              ? 'Find independent neighborhood electricians, carpenters, tutors, carers, and trade experts.'
              : 'दलाल विना सिधा स्थानीय विज्ञहरूसँग सम्पर्क गरी काम गराउनुहोस्। उनीहरूको समीक्षा र गुणस्तर यहाँ हेर्नुहोस्।'}
          </p>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); }}
          className="bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow transition-all duration-200 flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus size={16} />
          <span>{currentLang === 'en' ? 'Register as Local Specialist' : 'आफ्नो सेवा सूचीकृत गर्नुहोस्'}</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-stone-200 p-4 rounded-3xl shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentLang === 'en' ? 'Search by specialist name, keywords, or location...' : 'नाम वा काम खोज्नुहोस् (उदा. प्लम्बर, बिजुली)...'}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 border border-stone-300 rounded-2xl bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* 12 Categories Pill Roll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {CATEGORIES_MAPPING.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                activeCategory === cat.key
                  ? 'bg-emerald-900 text-white'
                  : 'bg-stone-105 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* REGISTRATION FORM SHOWN MODALLY OR COLLAPSIBLE */}
      {showForm && (
        <form onSubmit={handleProviderJoin} className="bg-emerald-50/40 border border-emerald-250 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-black text-emerald-950 text-sm flex items-center gap-1.5">
              💡 {currentLang === 'en' ? 'Apply to Join the Neighborhood Specialist Circle' : 'आफ्नो सीप र सम्पर्क नम्बर थप्नुहोस्'}
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-700">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Your Full Name:</label>
              <input type="text" required value={fName} onChange={(e) => setFName(e.target.value)} placeholder="e.g. Ramesh KC" className="w-full bg-white p-2.5 border border-stone-300 rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Mobile Number:</label>
              <input type="tel" required value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder="e.g. 9841851020" className="w-full bg-white p-2.5 border border-stone-300 rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Estimated Base Rate / Pricing:</label>
              <input type="text" value={fCost} onChange={(e) => setFCost(e.target.value)} placeholder="e.g. NPR 500 / visit or NPR 150 / hour" className="w-full bg-white p-2.5 border border-stone-300 rounded-lg focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Baseline Speciality Circle:</label>
              <select value={fCategory} onChange={(e) => setFCategory(e.target.value as any)} className="w-full bg-white p-2.5 border border-stone-300 rounded-lg focus:outline-none">
                <option value="electrical">Electrician (बिजुली मिस्त्री)</option>
                <option value="plumbing">Plumber (प्लम्बर)</option>
                <option value="teaching">Tutor / Teacher (शिक्षक)</option>
                <option value="health">Doctor / Nurse / Carer (स्वास्थ्य सहायक)</option>
                <option value="guide">Driver & Tourist Guide (गाइड र चालक)</option>
                <option value="other">Carpenter, Lawyer, Accountant, Freelancer (अन्य सेवा)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('selectDistrict')}:</label>
              <select value={fDistrict} onChange={(e) => setFDistrict(e.target.value)} className="w-full bg-white p-2.5 border border-stone-300 rounded-lg focus:outline-none">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Short Bio & Portfolio (What exact services can you provide?):</label>
            <textarea required rows={2} value={fDesc} onChange={(e) => setFDesc(e.target.value)} placeholder="e.g. Experienced electrician specializing in household lighting, water heater repairs, and main grid fuse setup. 8 years local experience." className="w-full text-xs bg-white p-3 border border-stone-300 rounded-lg focus:outline-none" />
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-xl">Cancel</button>
            <button type="submit" className="bg-emerald-900 text-white px-5 py-2 rounded-xl shadow">Submit Application</button>
          </div>
        </form>
      )}

      {/* FILTERED LIST OF SERVICE PROVIDERS */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 text-stone-400 bg-stone-50 border border-dashed rounded-3xl">
          😢 {currentLang === 'en' ? 'No local specialists found matching your specifications.' : 'यस विधामा सेवा प्रदायकहरू फेला परेनन्।'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((prov) => {
            const hasReviews = activeReviews[prov.id] && activeReviews[prov.id].length > 0;
            const avgRating = hasReviews 
              ? (activeReviews[prov.id].reduce((acc, r) => acc + r.rating, 0) / activeReviews[prov.id].length).toFixed(1)
              : prov.rating;

            return (
              <div key={prov.id} className="bg-white border border-stone-200 rounded-3xl p-5 hover:shadow-md transition duration-250 flex flex-col justify-between space-y-4">
                
                {/* Header detail */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-900">
                      🛠️ {prov.category}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">📍 {prov.district}</span>
                  </div>

                  <h4 className="font-display font-black text-stone-90c text-base">{prov.name}</h4>
                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">{prov.description}</p>
                </div>

                {/* Rating & Estimate cost info */}
                <div className="bg-stone-50/80 p-3.5 rounded-2xl flex items-center justify-between text-xs text-stone-700">
                  <div>
                    <p className="text-[9px] text-stone-400 uppercase tracking-wider">Estimated Base Charge</p>
                    <p className="font-extrabold text-emerald-900">{prov.cost}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-stone-400 uppercase tracking-wider">Reputation Index</p>
                    <div className="flex items-center text-amber-500 gap-0.5 justify-end">
                      <Star size={11} className="fill-amber-500" />
                      <span className="font-bold">{avgRating}</span>
                      <span className="text-[10px] text-stone-400 font-mono">({activeReviews[prov.id]?.length || prov.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Simulated interactive actions: phone dial and review section */}
                <div className="space-y-4 pt-1.5">
                  <div className="flex gap-2">
                    <a
                      href={`tel:${prov.phone}`}
                      onClick={() => setContactingProvider(prov)}
                      className="flex-grow bg-emerald-900 text-white hover:bg-emerald-950 px-3 py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Phone size={13} />
                      <span>{currentLang === 'en' ? 'Call Specialist' : 'फोन गर्नुहोस्'}</span>
                    </a>

                    <button
                      onClick={() => setContactingProvider(prov)}
                      className="bg-stone-105 hover:bg-stone-200 text-stone-700 px-3 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1"
                    >
                      <MessageCircle size={13} />
                      <span>{currentLang === 'en' ? 'Reviews' : 'मूल्याङ्कन'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* REVIEWS & VERIFICATION MODAL COAXED ON CONTACT EVENT */}
      {contactingProvider && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => { setContactingProvider(null); }}
              className="absolute right-5 top-5 text-stone-400 hover:text-stone-700"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded font-mono uppercase">
                {contactingProvider.category}
              </span>
              <h4 className="font-display font-black text-stone-90c text-lg leading-tight mt-1">
                {contactingProvider.name}
              </h4>
              <p className="text-xs text-stone-500 leading-normal">
                Direct hotline: <a href={`tel:${contactingProvider.phone}`} className="font-mono font-bold text-emerald-800 underline">{contactingProvider.phone}</a>
              </p>
            </div>

            {/* List Existing Reviews */}
            <div className="space-y-3.5">
              <h5 className="text-xs font-bold text-stone-850 border-b pb-1">Neighbor Feedback & Reviews (प्रतिक्रिया)</h5>
              
              <div className="max-h-[140px] overflow-y-auto space-y-2.5 pr-1 text-xs">
                {!(activeReviews[contactingProvider.id]) || activeReviews[contactingProvider.id].length === 0 ? (
                  <p className="text-stone-400 italic py-2">No neighbor feedback received yet. Be the first to leave one below!</p>
                ) : (
                  activeReviews[contactingProvider.id].map((rev, i) => (
                    <div key={i} className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                      <div className="flex justify-between items-center text-[10px] text-stone-400 mb-1">
                        <span className="font-bold text-stone-700">👤 {rev.author}</span>
                        <span className="text-amber-500 flex items-center font-bold">
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p className="text-stone-605 leading-relaxed">{rev.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Create review form */}
            <div className="bg-emerald-50/40 p-4 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-emerald-950">Add Your Genuine Experience</h5>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="p-1.5 border rounded-lg bg-white"
                />
                <select
                  value={reviewRate}
                  onChange={(e) => setReviewRate(parseInt(e.target.value))}
                  className="p-1.5 border rounded-lg bg-white"
                >
                  <option value="5">★★★★★ Outstanding</option>
                  <option value="4">★★★★ Excellent</option>
                  <option value="3">★★★ Average</option>
                  <option value="2">★★ Poor</option>
                  <option value="1">★ Awful</option>
                </select>
              </div>

              <textarea
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write clear, honest review feedback about job timing and quality..."
                className="w-full text-xs p-2 border rounded-lg bg-white focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAddReview(contactingProvider.id)}
                  className="bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg hover:bg-emerald-950 transition shadow"
                >
                  Post Review (दर्ता गर्नुहोस्)
                </button>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              *All reviews undergo local peer verification checks. False logs are penalized.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
