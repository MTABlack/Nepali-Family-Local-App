import React, { useState } from 'react';
import { HelpRequest } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { 
  HeartHandshake, 
  Search, 
  Flame, 
  HelpCircle, 
  Users, 
  Phone, 
  MapPin, 
  Plus, 
  X,
  Droplet,
  ShieldPlus,
  Compass,
  Bike,
  Wrench,
  UserCheck
} from 'lucide-react';

interface HelpCenterSectionProps {
  currentLang: 'en' | 'np';
  requests: HelpRequest[];
  onAddRequest: (request: Omit<HelpRequest, 'id' | 'date' | 'status'>) => void;
  onResolveRequest: (id: string) => void;
  selectedDistrict: string;
}

export const HelpCenterSection: React.FC<HelpCenterSectionProps> = ({
  currentLang,
  requests,
  onAddRequest,
  onResolveRequest,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqCategory, setReqCategory] = useState<'blood' | 'volunteering' | 'monetary' | 'disaster' | 'other'>('blood');
  const [reqCustomCategory, setReqCustomCategory] = useState<string>('Need Blood');
  const [reqUrgency, setReqUrgency] = useState<'critical' | 'high' | 'normal'>('high');
  const [reqName, setReqName] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqNeeds, setReqNeeds] = useState('');
  const [reqDistrict, setReqDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  // Mandatory Categories (6 items)
  const HELP_CATEGORIES = [
    { key: 'all', label: currentLang === 'en' ? 'All Requests' : 'सबै गुहारहरू', icon: <HeartHandshake size={14} /> },
    { key: 'need blood', label: currentLang === 'en' ? 'Need Blood' : 'रक्तदान चाहियो 🩸', icon: <Droplet className="text-red-600" size={14} /> },
    { key: 'emergency support', label: currentLang === 'en' ? 'Emergency Support' : 'आपतकालीन सहयोग', icon: <ShieldPlus className="text-orange-600" size={14} /> },
    { key: 'lost & found', label: currentLang === 'en' ? 'Lost & Found' : 'हराएको / भेटिएको', icon: <Compass className="text-blue-600" size={14} /> },
    { key: 'ride request', label: currentLang === 'en' ? 'Ride Request' : 'लिफ्ट चाहियो (Ride)', icon: <Bike className="text-emerald-700" size={14} /> },
    { key: 'tool borrowing', label: currentLang === 'en' ? 'Tool Borrowing' : 'उपकरण पैंचो', icon: <Wrench className="text-amber-800" size={14} /> },
    { key: 'local assistance', label: currentLang === 'en' ? 'Local Assistance' : 'घरायसी सहयोग', icon: <Users className="text-stone-700" size={14} /> }
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqDesc.trim() || !reqName.trim() || !reqPhone.trim()) return;

    onAddRequest({
      title: `[${reqCustomCategory.toUpperCase()}] ` + reqTitle.trim(),
      description: reqDesc.trim(),
      category: reqCategory, // Base model mapping
      urgency: reqUrgency,
      contactName: reqName.trim(),
      contactPhone: reqPhone.trim(),
      district: reqDistrict,
      lookingFor: reqNeeds.trim() || 'Immediate Aid'
    });

    setReqTitle('');
    setReqDesc('');
    setReqName('');
    setReqPhone('');
    setReqNeeds('');
    setShowForm(false);
  };

  // Filter lists
  const filteredRequests = requests.filter((req) => {
    const matchesDistrict = !selectedDistrict || req.district === selectedDistrict;
    
    // Check baseline or custom category identifier embedded in the title [LIKE NEED BLOOD]
    const matchesCategory = activeCategory === 'all' || 
      req.title.toLowerCase().includes(activeCategory.toLowerCase()) || 
      req.category.toLowerCase().includes(activeCategory.replace('need ', '').replace(' emergency ', '').toLowerCase());

    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contactName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display font-black text-stone-900 text-xl flex items-center gap-2">
            <HeartHandshake className="text-red-700 fill-red-100" />
            <span>{currentLang === 'en' ? 'Guhar Mutual Help Center' : 'स्थानीय गुहार तथा सहयोग केन्द्र'}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {currentLang === 'en'
              ? 'Request blood donations, coordinate instant search parties, borrow irrigation gear, or list found identity cards.'
              : 'रगत अभाव, हराएका सामग्री, कृषि उपकरण सापटी वा आवश्यक घरायसी काममा आपसी छिमेकी गुहार सजिलै माग्नुहोस्।'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-800 text-stone-100 hover:bg-red-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow transition-all duration-200 flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus size={16} />
          <span>{currentLang === 'en' ? 'Request Urgent Aid' : 'औपचारिक गुहार माग्नुहोस्'}</span>
        </button>
      </div>

      {/* EMERGENCY CENTRAL ALERT SUMMARY */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-950 flex items-start gap-2.5">
        <Flame className="text-red-700 shrink-0 mt-0.5 animate-pulse" size={16} />
        <div>
          <p className="font-bold">{currentLang === 'en' ? 'Emergency Protocol Advice' : 'आपतकालीन सेवा नियमावली'}</p>
          <p className="text-stone-600">
            {currentLang === 'en'
              ? 'For physical landslides, structure fires or heavy active injuries, immediately contact the verifying authorities using the direct Sankat Dialectory.'
              : 'बाढी, पहिरो वा गम्भीर दुर्घटनाको अवस्थामा समय खेर नफाली तत्कालै "Verified Sankat Contacts" टोल फ्रि नम्बरहरूमा सम्पर्क गर्नुहोस्।'}
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-stone-200 p-4 rounded-3xl shadow-sm space-y-4">
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentLang === 'en' ? 'Search active requests (blood groups, tools, lost items)...' : 'गुहार सन्देश खोज्नुहोस् (उदा. रगत, धान रोप्ने, हराएको लाइसेन्स)...'}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 border border-stone-300 rounded-2xl bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* 6 Category Selection Pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {HELP_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? 'bg-red-800 text-white'
                  : 'bg-stone-100 text-stone-605 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <form onSubmit={handleCreateRequest} className="bg-red-50/20 border border-red-200 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-black text-red-950 text-sm">
              🆘 {currentLang === 'en' ? 'Publish Immediate Assistance Request' : 'नयाँ गुहार अनुरोध तयार पार्नुहोस्'}
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-700">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Select Core Category:</label>
              <select 
                value={reqCustomCategory} 
                onChange={(e) => {
                  setReqCustomCategory(e.target.value);
                  // Baseline mapping
                  if (e.target.value === 'Need Blood') setReqCategory('blood');
                  else if (e.target.value === 'Emergency Support') setReqCategory('disaster');
                  else setReqCategory('volunteering');
                }} 
                className="w-full bg-white p-2.5 border rounded-lg focus:outline-none focus:ring-1"
              >
                <option value="Need Blood">Need Blood (रक्तदान आवश्यक)</option>
                <option value="Emergency Support">Emergency Support (आपतकालीन)</option>
                <option value="Lost & Found">Lost & Found (सामग्री हराएको/भेटिएको)</option>
                <option value="Ride Request">Ride Request (लिफ्ट/चालक सहयोग)</option>
                <option value="Tool Borrowing">Tool Borrowing (कृषि/घर औजार सापटी)</option>
                <option value="Local Assistance">Local Assistance (शारीरिक/घरायसी मद्दत)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Headline Brief:</label>
              <input type="text" required value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} placeholder="e.g. Need 2 pints of B+ blood for Grandma" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none focus:ring-1" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Urgency Priority:</label>
              <select value={reqUrgency} onChange={(e) => setReqUrgency(e.target.value as any)} className="w-full bg-white p-2.5 border rounded-lg focus:outline-none">
                <option value="normal">Normal (सामान्य)</option>
                <option value="high">High (महत्वपूर्ण)</option>
                <option value="critical">Critical 🚨 (तत्काल बचाउ)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Name Person:</label>
              <input type="text" required value={reqName} onChange={(e) => setReqName(e.target.value)} placeholder="e.g. Maya Rijal" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Emergency Mobile:</label>
              <input type="tel" required value={reqPhone} onChange={(e) => setReqPhone(e.target.value)} placeholder="e.g. 9851210204" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Specific Needs / Compensation (if any):</label>
              <input type="text" value={reqNeeds} onChange={(e) => setReqNeeds(e.target.value)} placeholder="e.g. Will compensate for transport fuel" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select value={reqDistrict} onChange={(e) => setReqDistrict(e.target.value)} className="w-full bg-white p-2.5 border rounded-lg focus:outline-none">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Full Detailed Emergency Explanation & Hospital/Pickup coordinates:</label>
            <textarea required rows={3} value={reqDesc} onChange={(e) => setReqDesc(e.target.value)} placeholder="e.g. Grandma is admitted to Green City Hospital, Basundhara and scheduled for bypass surgery tomorrow morning at 9:00 AM. Hospital blood inventory has zero B+ bags now. Transport fuel will be paid. Please help!" className="w-full text-xs bg-white p-3 border rounded-lg focus:outline-none" />
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-xl">Cancel</button>
            <button type="submit" className="bg-red-800 text-white px-5 py-2 rounded-xl shadow">Publish Guhar Request</button>
          </div>
        </form>
      )}

      {/* FILTERED LIST RENDER */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-stone-400 bg-stone-50 border border-dashed rounded-3xl">
          🎉 {currentLang === 'en' ? 'Wow! No neighbors requested emergency assistance at this instant. Clean slate.' : 'हाल तपाँईको क्षेत्रमा कुनै सक्रिय गुहार छैन। सबै कुशल मंगल छ!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div 
              key={req.id} 
              className={`bg-white border hover:shadow-md transition duration-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 ${
                req.status === 'resolved' ? 'opacity-60 border-stone-200' : 'border-stone-250'
              }`}
            >
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                    req.urgency === 'critical' 
                      ? 'bg-red-105 bg-red-100 text-red-900 border border-red-300 animate-pulse font-black' 
                      : req.urgency === 'high' 
                      ? 'bg-amber-120 bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-stone-105 bg-stone-100 text-stone-800 border'
                  }`}>
                    {req.urgency === 'critical' ? '🚨 EMERGENCY' : req.urgency + ' aid'}
                  </span>

                  <span className="text-stone-500 font-mono">📍 {req.district} Circle</span>
                </div>

                <h4 className={`font-display font-black text-stone-90c text-base ${req.status === 'resolved' ? 'line-through text-stone-400' : ''}`}>
                  {req.title}
                </h4>

                <p className="text-stone-605 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{req.description}</p>
                
                {req.lookingFor && (
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-105 text-[11px] leading-relaxed text-stone-600">
                    💡 <strong className="font-bold">Immediate Target Requirement:</strong> {req.lookingFor}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-none">Contact Person</p>
                  <p className="font-extrabold text-stone-800 mt-1">{req.contactName}</p>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'open' ? (
                    <>
                      <button
                        onClick={() => onResolveRequest(req.id)}
                        className="bg-stone-105 hover:bg-stone-200 text-stone-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-all duration-200"
                        title="Mark as resolved if aid was delivered"
                      >
                        <UserCheck size={12} />
                        <span>Solved</span>
                      </button>

                      <a
                        href={`tel:${req.contactPhone}`}
                        className="bg-red-800 hover:bg-red-950 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-sm"
                      >
                        <Phone size={11} className="animate-bounce" />
                        <span>Call Agent</span>
                      </a>
                    </>
                  ) : (
                    <span className="text-emerald-800 font-bold font-mono text-xs flex items-center gap-1 py-1 px-2.5 bg-emerald-50 rounded-lg">
                      ✓ Resolved/Saved
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
