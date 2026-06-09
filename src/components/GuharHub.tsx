import React, { useState } from 'react';
import { HelpRequest } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { AlertTriangle, HeartHandshake, Phone, Plus, Tag, HelpCircle, CheckCircle2 } from 'lucide-react';

interface GuharHubProps {
  currentLang: 'en' | 'np';
  requests: HelpRequest[];
  onAddRequest: (req: Omit<HelpRequest, 'id' | 'date' | 'status'>) => void;
  onResolveRequest: (id: string) => void;
  selectedDistrict: string;
}

export const GuharHub: React.FC<GuharHubProps> = ({
  currentLang,
  requests,
  onAddRequest,
  onResolveRequest,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const [activeUrgency, setActiveUrgency] = useState<'all' | 'critical' | 'high' | 'normal'>('all');
  const [activeTab, setActiveTab] = useState<'open' | 'resolved'>('open');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<HelpRequest['category']>('blood');
  const [urgency, setUrgency] = useState<HelpRequest['urgency']>('normal');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [district, setDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || !contactName.trim() || !contactPhone.trim()) return;

    onAddRequest({
      title,
      description: desc,
      category,
      urgency,
      contactName,
      contactPhone,
      lookingFor: lookingFor || 'General community helpers',
      district
    });

    setTitle('');
    setDesc('');
    setContactName('');
    setContactPhone('');
    setLookingFor('');
    setShowForm(false);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesDistrict = selectedDistrict ? req.district === selectedDistrict : true;
    const matchesUrgency = activeUrgency === 'all' ? true : req.urgency === activeUrgency;
    const matchesStatus = req.status === activeTab;
    return matchesDistrict && matchesUrgency && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Guhar introduction banner */}
      <div className="bg-gradient-to-r from-rose-900 to-red-950 text-stone-100 p-6 rounded-2xl shadow-md border border-red-800">
        <h3 className="text-xl font-display font-black tracking-tight mb-2 flex items-center gap-2">
          <HeartHandshake className="text-amber-400" />
          {currentLang === 'en' ? 'Guhar Community Mutual-Aid Counter' : 'गुहार सेवा केन्द्र (परस्पर सहयोगी चौतारी)'}
        </h3>
        <p className="text-rose-200 text-xs sm:text-sm leading-relaxed max-w-3xl">
          {currentLang === 'en' 
            ? 'When disaster hits, blood is scarce, or volunteer hands are needed, Nepali Family steps in. Directly ask your neighbors for help, or offer help. Strictly no agent charges or commission fee.'
            : 'बाढीपहिरो, आपतकालीन रक्तदान, वा श्रमदानको आवश्यकता परेमा सिधै आफ्नो छिमेकीसँग मद्दत माग्ने डिजिटल चौतारी। यहाँ कुनै कमिसन वा दर्ता शुल्क लाग्दैन।'}
        </p>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 bg-white text-rose-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-stone-100 transition shadow flex items-center gap-1.5"
        >
          <Plus size={16} />
          {t('askHelp')}
        </button>
      </div>

      {/* Seek Help Form Block */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-rose-50/55 border border-rose-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <h4 className="font-display font-bold text-rose-950 text-base flex items-center gap-1.5">
            🚨 {currentLang === 'en' ? 'Create New Guhar Request' : 'नयाँ गुहार (सहयोग) अनुरोध दर्ता गर्नुहोस्'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('title')}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={currentLang === 'en' ? 'e.g. Critical Blood Needed at Teaching Hospital' : 'शीर्षक लिनुहोस्...'}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('category')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              >
                <option value="blood">🩸 {t('blood')}</option>
                <option value="disaster">🏔️ {t('disaster')}</option>
                <option value="volunteering">🤝 {t('volunteering')}</option>
                <option value="monetary">💰 {t('monetary')}</option>
                <option value="other">❓ {t('other')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('urgency')}</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800 font-bold"
              >
                <option value="normal" className="text-stone-700">{t('urgencyNormal')}</option>
                <option value="high" className="text-amber-700 font-semibold">{t('urgencyHigh')}</option>
                <option value="critical" className="text-red-700 font-extrabold">{t('urgencyCritical')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {currentLang === 'en' ? 'Required ActionDetail:' : 'चाहिएको सहयोग विवरण:'}
              </label>
              <input
                type="text"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="e.g. 2 blood donors, 4 shovels"
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
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
              placeholder={currentLang === 'en' ? 'Provide contact address, detailed conditions, hospital beds numbers etc.' : 'बिरामीको शैय्या नम्बर, अस्पतालको ठेगाना वा आकस्मिक सहयोग चाहिनुको कारण खुलाउनुहोस्...'}
              className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('name')}</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ramesh Shrestha"
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('phone')}</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. 9841XXXXXX"
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-800"
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
              className="bg-rose-800 hover:bg-rose-950 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      )}

      {/* Tabs list (Active Requests vs Resolved Archives) */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'open'
                ? 'border-rose-700 text-rose-950'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            🔥 {currentLang === 'en' ? 'Active guhar requests' : 'सक्रिय गुहार अनुरोधहरू'}
          </button>
          
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'resolved'
                ? 'border-stone-600 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            ✅ {currentLang === 'en' ? 'Resolved / Completed' : 'समाधान भएका'}
          </button>
        </div>

        {/* Urgency Filter pills */}
        <select
          value={activeUrgency}
          onChange={(e) => setActiveUrgency(e.target.value as any)}
          className="text-xs bg-stone-100 border border-stone-300 rounded-lg py-1.5 px-2 focus:outline-none cursor-pointer"
        >
          <option value="all">⭐ {currentLang === 'en' ? 'All urgency' : 'सबै प्राथमिकता'}</option>
          <option value="critical">🚨 {t('urgencyCritical')}</option>
          <option value="high">⚠️ {t('urgencyHigh')}</option>
          <option value="normal">🌿 {t('urgencyNormal')}</option>
        </select>
      </div>

      {/* Grid List representation */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <HelpCircle className="mx-auto text-stone-300 mb-2" size={32} />
          <p className="text-stone-500 text-sm">
            {currentLang === 'en' 
              ? 'No active Guhar cases found with these filters. Great work community!' 
              : 'यो मापदण्डमा कुनै गुहार अनुरोध देखिदैन। समुदाय सुरक्षित छ!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`border rounded-2xl p-5 bg-white transition hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                req.urgency === 'critical' 
                  ? 'border-red-400 bg-red-50/15' 
                  : req.urgency === 'high' 
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-stone-200'
              }`}
            >
              <div className="space-y-2 flex-grow max-w-4xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                    req.urgency === 'critical' 
                      ? 'bg-red-800 text-white animate-pulse' 
                      : req.urgency === 'high' 
                      ? 'bg-amber-600 text-stone-100' 
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {t(`urgency${req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}`)}
                  </span>
                  
                  <span className="text-stone-400 text-xs">•</span>
                  
                  <span className="text-[10px] uppercase bg-stone-100 border border-stone-300 px-2 py-0.5 rounded text-stone-600 font-mono">
                    {t(req.category)}
                  </span>
                  
                  <span className="text-stone-400 text-xs">•</span>
                  
                  <span className="text-xs text-stone-600 font-semibold">
                    📍 {req.district}
                  </span>
                </div>

                <h4 className="font-display font-bold text-stone-900 text-base leading-snug">
                  {req.title}
                </h4>

                <p className="text-stone-600 text-sm leading-relaxed">
                  {req.description}
                </p>

                <div className="bg-stone-50/80 border border-stone-100 rounded-lg p-2.5 text-xs text-stone-700 flex flex-wrap gap-4 items-center">
                  <span>🛠️ <strong className="font-semibold">{currentLang === 'en' ? 'Support targets:' : 'चाहिएको सहायता:'}</strong> {req.lookingFor}</span>
                  <span className="hidden sm:inline text-stone-300">|</span>
                  <span>🗓️ <strong className="font-semibold">{currentLang === 'en' ? 'Posted date:' : 'अपलोड मिति:'}</strong> {req.date}</span>
                </div>
              </div>

              {/* Contact / Solve block */}
              <div className="flex sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 min-w-[200px] pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="bg-stone-100/90 border border-stone-200 rounded-xl p-3 text-xs flex-grow">
                  <p className="text-stone-500 mb-0.5 leading-none font-sans text-[10px] uppercase tracking-wider">{t('contactUs')}</p>
                  <p className="font-bold text-stone-900 text-sm mb-1">{req.contactName}</p>
                  <a
                    href={`tel:${req.contactPhone}`}
                    className="flex items-center gap-1 text-rose-800 font-bold hover:underline"
                  >
                    <Phone size={12} />
                    <span>{req.contactPhone}</span>
                  </a>
                </div>

                {req.status === 'open' && (
                  <button
                    onClick={() => onResolveRequest(req.id)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <CheckCircle2 size={13} />
                    <span>{t('resolveHelp')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
