import React, { useState } from 'react';
import { ServiceProvider, Job, LocalBusiness } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { Briefcase, ShieldAlert, Star, Phone, UserCheck, PlusCircle, Sparkles, Building, ListFilter } from 'lucide-react';

interface OpportunityAndShopsProps {
  currentLang: 'en' | 'np';
  providers: ServiceProvider[];
  jobs: Job[];
  businesses: LocalBusiness[];
  onAddProvider: (p: Omit<ServiceProvider, 'id' | 'rating' | 'reviewsCount'>) => void;
  onAddJob: (j: Omit<Job, 'id'>) => void;
  onAddBusiness: (b: Omit<LocalBusiness, 'id' | 'rating'>) => void;
  onApplyJob: (id: string) => void;
  selectedDistrict: string;
}

export const OpportunityAndShops: React.FC<OpportunityAndShopsProps> = ({
  currentLang,
  providers,
  jobs,
  businesses,
  onAddProvider,
  onAddJob,
  onAddBusiness,
  onApplyJob,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const [subTab, setSubTab] = useState<'services' | 'jobs' | 'shops'>('services');
  const [showForm, setShowForm] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Form states - Service Provider
  const [provName, setProvName] = useState('');
  const [provCat, setProvCat] = useState<ServiceProvider['category']>('plumbing');
  const [provPhone, setProvPhone] = useState('');
  const [provCost, setProvCost] = useState('');
  const [provDesc, setProvDesc] = useState('');
  const [provDistrict, setProvDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  // Form states - Job
  const [jobTitle, setJobTitle] = useState('');
  const [jobPay, setJobPay] = useState('');
  const [jobType, setJobType] = useState<Job['type']>('daily');
  const [jobDesc, setJobDesc] = useState('');
  const [jobEmployer, setJobEmployer] = useState('');
  const [jobPhone, setJobPhone] = useState('');
  const [jobDistrict, setJobDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  // Form states - Business
  const [busName, setBusName] = useState('');
  const [busOwner, setBusOwner] = useState('');
  const [busType, setBusType] = useState('');
  const [busDesc, setBusDesc] = useState('');
  const [busPhone, setBusPhone] = useState('');
  const [busLoc, setBusLoc] = useState('');
  const [busDistrict, setBusDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName.trim() || !provPhone.trim() || !provDesc.trim()) return;
    onAddProvider({
      name: provName,
      category: provCat,
      phone: provPhone,
      cost: provCost || 'Negotiable rates',
      description: provDesc,
      district: provDistrict
    });
    setProvName('');
    setProvPhone('');
    setProvCost('');
    setProvDesc('');
    setShowForm(false);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobPay.trim() || !jobEmployer.trim() || !jobPhone.trim()) return;
    onAddJob({
      title: jobTitle,
      payment: jobPay,
      type: jobType,
      description: jobDesc,
      contactName: jobEmployer,
      contactPhone: jobPhone,
      district: jobDistrict
    });
    setJobTitle('');
    setJobPay('');
    setJobDesc('');
    setJobEmployer('');
    setJobPhone('');
    setShowForm(false);
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busName.trim() || !busOwner.trim() || !busPhone.trim() || !busDesc.trim()) return;
    onAddBusiness({
      name: busName,
      ownerName: busOwner,
      type: busType || 'General Store',
      description: busDesc,
      phone: busPhone,
      location: busLoc || 'Local Bazaar',
      district: busDistrict
    });
    setBusName('');
    setBusOwner('');
    setBusType('');
    setBusDesc('');
    setBusPhone('');
    setBusLoc('');
    setShowForm(false);
  };

  // Filter items
  const filteredProviders = providers.filter(p => {
    const matchesDistrict = selectedDistrict ? p.district === selectedDistrict : true;
    const matchesCategory = serviceFilter === 'all' ? true : p.category === serviceFilter;
    return matchesDistrict && matchesCategory;
  });

  const filteredJobs = jobs.filter(j => {
    const matchesDistrict = selectedDistrict ? j.district === selectedDistrict : true;
    return matchesDistrict;
  });

  const filteredBusinesses = businesses.filter(b => {
    const matchesDistrict = selectedDistrict ? b.district === selectedDistrict : true;
    return matchesDistrict;
  });

  return (
    <div className="space-y-6">
      
      {/* Dynamic Sub-tab selector */}
      <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
        <button
          onClick={() => { setSubTab('services'); setShowForm(false); }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'services'
              ? 'bg-emerald-800 text-stone-100 shadow-sm'
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🛠️ {currentLang === 'en' ? 'Local Services' : 'स्थानीय सेवा प्रदायक'}
        </button>

        <button
          onClick={() => { setSubTab('jobs'); setShowForm(false); }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'jobs'
              ? 'bg-emerald-800 text-stone-100 shadow-sm'
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🌾 {currentLang === 'en' ? 'Daily Wage Jobs' : 'ज्यालादारी काम / रोजगार'}
        </button>

        <button
          onClick={() => { setSubTab('shops'); setShowForm(false); }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'shops'
              ? 'bg-emerald-800 text-stone-100 shadow-sm'
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🏬 {currentLang === 'en' ? 'Sajha Pasal (Shops)' : 'साझा स्थानीय पसलहरू'}
        </button>
      </div>

      {/* Subtab explanatory description & add button */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-200/80 gap-3">
        <div className="text-xs text-stone-600">
          {subTab === 'services' && (
            <p>👷 {currentLang === 'en' ? 'Connect directly with local plumbers, tutors, electricians, and carers. Reviews are added securely.' : 'बिचौलिया बिना सिधै गाउँ ठाउँका प्लम्बर, शिक्षक, वा बिजुली मिस्त्रीसँग सिधा सम्पर्क र फोन गर्ने मञ्च।'}</p>
          )}
          {subTab === 'jobs' && (
            <p>🌾 {currentLang === 'en' ? 'Find and verify harvesting help, painting jobs, and labor opportunities. Zero brokerage commission.' : 'खेताला, रोपाहार, रंग लगाउने मान्छे वा सिकर्मीको खोजी र सिधा कामको प्रस्ताव गर्ने सहज सेवा।'}</p>
          )}
          {subTab === 'shops' && (
            <p>🏬 {currentLang === 'en' ? 'Sajha Pasal: Promotes your local village dukan, tailor, grocery, or eatery inside the community map.' : 'साझा पसल: आफ्नो चिया पसल, सिलाइ कटाई, चमेना गृह वा किराना पसलको बारेमा जानकारी राख्नुहोस्।'}</p>
          )}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow"
        >
          <PlusCircle size={15} />
          <span>
            {subTab === 'services' && (currentLang === 'en' ? 'Register as Provider' : 'सेवा दर्ता गर्नुहोस्')}
            {subTab === 'jobs' && (currentLang === 'en' ? 'Post a Job' : 'ज्यालादारी काम राख्नुहोस्')}
            {subTab === 'shops' && (currentLang === 'en' ? 'Promote Your Shop' : 'आफ्नो पसल थप्नुहोस्')}
          </span>
        </button>
      </div>

      {/* DYNAMIC FORMS ACCORDING TO ACTIVE SUBTAB */}
      {showForm && subTab === 'services' && (
        <form onSubmit={handleProviderSubmit} className="bg-emerald-50/75 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <h4 className="font-display font-medium text-emerald-950 text-base">👷 {currentLang === 'en' ? 'Join as Local Service Provider' : 'आफ्नो सेवा सूचीकृत गर्नुहोस्'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('name')}</label>
              <input type="text" required value={provName} onChange={(e) => setProvName(e.target.value)} placeholder="e.g. Ramesh Shrestha" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('category')}</label>
              <select value={provCat} onChange={(e) => setProvCat(e.target.value as any)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white text-xs">
                <option value="plumbing">🚰 {t('plumbing')}</option>
                <option value="electrical">🔌 {t('electrical')}</option>
                <option value="teaching">📚 {t('teaching')}</option>
                <option value="health">🩺 {t('health')}</option>
                <option value="guide">🗺️ {t('guide')}</option>
                <option value="other">⚙️ {t('other')}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('phone')}</label>
              <input type="text" required value={provPhone} onChange={(e) => setProvPhone(e.target.value)} placeholder="e.g. 9845XXXXXX" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Base Charge Details:</label>
              <input type="text" value={provCost} onChange={(e) => setProvCost(e.target.value)} placeholder="e.g. NPR 500 onwards" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select value={provDistrict} onChange={(e) => setProvDistrict(e.target.value)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Experience Description:</label>
            <textarea required rows={2} value={provDesc} onChange={(e) => setProvDesc(e.target.value)} placeholder="Tell neighbors about your repair skills, availability hours..." className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
          </div>
          <div className="flex justify-end gap-2 text-xs font-semibold">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-300 text-stone-800 px-3 py-2 rounded-lg">{t('cancel')}</button>
            <button type="submit" className="bg-emerald-800 text-white px-4 py-2 rounded-lg shadow">{t('submit')}</button>
          </div>
        </form>
      )}

      {showForm && subTab === 'jobs' && (
        <form onSubmit={handleJobSubmit} className="bg-emerald-50/75 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <h4 className="font-display font-medium text-emerald-950 text-base">🌾 {currentLang === 'en' ? 'Offer New Daily Wage / Labor Opportunity' : 'नयाँ ज्यालादारी काम/अवसर सूचीकृत गर्नुहोस्'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Work Title:</label>
              <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Harvesting Mustard Fields" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Wage Details:</label>
                <input type="text" required value={jobPay} onChange={(e) => setJobPay(e.target.value)} placeholder="NPR 700 / day" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Job Category:</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value as any)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white text-xs">
                  <option value="daily">{t('daily')}</option>
                  <option value="agricultural">{t('agricultural')}</option>
                  <option value="part-time">{t('partTime')}</option>
                  <option value="freelance">{t('freelance')}</option>
                  <option value="full-time">{t('fullTime')}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Employer Name / Agency:</label>
              <input type="text" required value={jobEmployer} onChange={(e) => setJobEmployer(e.target.value)} placeholder="Bhim Bahadur" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number:</label>
              <input type="text" required value={jobPhone} onChange={(e) => setJobPhone(e.target.value)} placeholder="98XXXXXXXX" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select value={jobDistrict} onChange={(e) => setJobDistrict(e.target.value)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Job Description:</label>
            <textarea required rows={2} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Describe work schedule, lunches, safety kits, tools provided..." className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
          </div>
          <div className="flex justify-end gap-2 text-xs font-semibold">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-300 text-stone-800 px-3 py-2 rounded-lg">{t('cancel')}</button>
            <button type="submit" className="bg-emerald-800 text-white px-4 py-2 rounded-lg shadow">{t('submit')}</button>
          </div>
        </form>
      )}

      {showForm && subTab === 'shops' && (
        <form onSubmit={handleBusinessSubmit} className="bg-emerald-50/75 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <h4 className="font-display font-medium text-emerald-950 text-base">🏬 {currentLang === 'en' ? 'Promote Your Village Dukan / Business' : 'आफ्नो पसल वा व्यवसाय दर्ता गर्नुहोस्'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Business/Shop Name:</label>
              <input type="text" required value={busName} onChange={(e) => setBusName(e.target.value)} placeholder="e.g. Acharya Organic Ghee Corner" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Shop Type / Niche:</label>
              <input type="text" value={busType} onChange={(e) => setBusType(e.target.value)} placeholder="e.g., Bakery, Tailor, Local Chiya, Handicraft" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Owner Name:</label>
              <input type="text" required value={busOwner} onChange={(e) => setBusOwner(e.target.value)} placeholder="Karna Bahadur" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone:</label>
              <input type="text" required value={busPhone} onChange={(e) => setBusPhone(e.target.value)} placeholder="98XXXXXXXX" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select value={busDistrict} onChange={(e) => setBusDistrict(e.target.value)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Shop Address / Landmarks:</label>
              <input type="text" required value={busLoc} onChange={(e) => setBusLoc(e.target.value)} placeholder="e.g. Near Milan Chowk Chautari" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Brief Description / Specialities List:</label>
              <textarea required rows={2} value={busDesc} onChange={(e) => setBusDesc(e.target.value)} placeholder="Home delivery available, pure mountain buffalo milk snacks, direct weaver Dhaka topis..." className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
            </div>
          </div>
          <div className="flex justify-end gap-2 text-xs font-semibold">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-300 text-stone-800 px-3 py-2 rounded-lg">{t('cancel')}</button>
            <button type="submit" className="bg-emerald-800 text-white px-4 py-2 rounded-lg shadow">{t('submit')}</button>
          </div>
        </form>
      )}

      {/* DISPLAY ACTIVE RECORDS PANELS */}
      {subTab === 'services' && (
        <div>
          {/* Services categories filters bar */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-3 mb-4">
            <span className="text-[11px] font-mono uppercase text-stone-400 flex items-center gap-1 mr-1"><ListFilter size={12}/> Categories:</span>
            <button onClick={() => setServiceFilter('all')} className={`px-2.5 py-1 text-xs rounded-full transition ${serviceFilter === 'all' ? 'bg-emerald-900 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}>All</button>
            <button onClick={() => setServiceFilter('plumbing')} className={`px-2.5 py-1 text-xs rounded-full transition ${serviceFilter === 'plumbing' ? 'bg-emerald-900 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}>🛠️ Plumbing</button>
            <button onClick={() => setServiceFilter('electrical')} className={`px-2.5 py-1 text-xs rounded-full transition ${serviceFilter === 'electrical' ? 'bg-emerald-900 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}>🔌 Electrical</button>
            <button onClick={() => setServiceFilter('teaching')} className={`px-2.5 py-1 text-xs rounded-full transition ${serviceFilter === 'teaching' ? 'bg-emerald-900 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}>📚 Tutor</button>
            <button onClick={() => setServiceFilter('health')} className={`px-2.5 py-1 text-xs rounded-full transition ${serviceFilter === 'health' ? 'bg-emerald-900 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}>🩺 Healthcare</button>
            <button onClick={() => setServiceFilter('guide')} className={`px-2.5 py-1 text-xs rounded-full transition ${serviceFilter === 'guide' ? 'bg-emerald-900 text-white' : 'bg-stone-100 hover:bg-stone-200'}`}>🗺️ Guide</button>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-50 border border-dashed rounded-xl">No service providers found in this district yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProviders.map(p => (
                <div key={p.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                        {t(p.category)}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">📍 {p.district}</span>
                    </div>
                    <h5 className="font-display font-bold text-stone-900 text-base">{p.name}</h5>
                    <p className="text-stone-600 text-sm leading-relaxed mt-1.5">{p.description}</p>
                    <p className="text-emerald-950 font-semibold text-xs mt-3 bg-stone-100/75 py-1.5 px-2.5 border border-stone-100 rounded-lg">
                      🟢 Base Rates: <span className="font-bold">{p.cost}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3.5 mt-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={13} className="fill-amber-400" />
                      <span className="text-xs font-bold font-mono">{p.rating.toFixed(1)}</span>
                      <span className="text-stone-400 text-xs">({p.reviewsCount} verified reviews)</span>
                    </div>
                    <a href={`tel:${p.phone}`} className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow">
                      <Phone size={12} />
                      <span>{t('applyJob')}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'jobs' && (
        <div>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-50 border border-dashed rounded-xl">No active daily wage jobs found in this district.</div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map(j => (
                <div key={j.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[10px] uppercase px-2.5 rounded">
                        {t(j.type)}
                      </span>
                      <span className="text-stone-400 text-xs">•</span>
                      <span className="text-xs font-bold text-stone-600">🏔️ {j.district}</span>
                    </div>

                    <h5 className="font-display font-extrabold text-stone-900 text-base">{j.title}</h5>
                    <p className="text-stone-600 text-sm">{j.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400">Payer Name:</span>
                      <span className="text-stone-700 font-bold">{j.contactName}</span>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-0 shrink-0 border-t sm:border-t-0 border-stone-100 flex sm:flex-col items-center sm:items-end justify-between gap-3 text-right">
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">wage pay</p>
                      <p className="font-display font-black text-emerald-900 text-base sm:text-lg">{j.payment}</p>
                    </div>

                    <div className="flex gap-2">
                      {j.isApplied ? (
                        <span className="bg-stone-100 border border-stone-300 text-stone-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <UserCheck size={13} /> Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => onApplyJob(j.id)}
                          className="bg-emerald-800 hover:bg-emerald-900 text-stone-100 font-bold text-xs px-4 py-2 rounded-lg transition shadow"
                        >
                          {t('applyJob')} (98..)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'shops' && (
        <div>
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-50 border border-dashed rounded-xl">No active shops registered here yet. Join & promote yours!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBusinesses.map(b => (
                <div key={b.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-100/50 text-amber-900 font-bold text-[10px] tracking-wide border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={10} /> {b.type}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">🏔️ {b.district}</span>
                    </div>

                    <div>
                      <h5 className="font-display font-black text-stone-900 text-base leading-tight flex items-center gap-1.5">
                        <Building size={16} className="text-emerald-800" />
                        {b.name}
                      </h5>
                      <span className="text-[11px] text-stone-500">📍 Location: {b.location}</span>
                    </div>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{b.description}</p>
                  </div>

                  <div className="border-t border-stone-100 pt-3 mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-none">owner</p>
                      <p className="text-xs font-bold text-stone-800">{b.ownerName}</p>
                    </div>

                    <a href={`tel:${b.phone}`} className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow text-center">
                      <Phone size={12} />
                      <span>Call Shop</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Security alert box */}
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-xs text-amber-950">
        <ShieldAlert size={15} className="text-amber-800 shrink-0 mt-0.5" />
        <p>
          {currentLang === 'en'
            ? 'Safety Guideline: Always ask for reference details or trade credentials. Never transfer monetary deposits in advance through mobile wallets before checking services or jobs details.'
            : 'सुरक्षा सल्लाह: सेवा वा काम लिनु अघि सधैं राम्ररी सोधपुछ गर्नुहोस्। सेवा पाउनु अगाडि कहिल्यै पनि मोबाइल वालेटबाट एडभान्स पेश्की रकम भुक्तानी नगर्नुहोस्।'}
        </p>
      </div>

    </div>
  );
};
