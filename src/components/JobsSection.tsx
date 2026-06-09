import React, { useState } from 'react';
import { Job } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { 
  Building, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  X,
  Compass
} from 'lucide-react';

interface JobsSectionProps {
  currentLang: 'en' | 'np';
  jobs: Job[];
  onAddJob: (job: Omit<Job, 'id'>) => void;
  selectedDistrict: string;
}

export const JobsSection: React.FC<JobsSectionProps> = ({
  currentLang,
  jobs,
  onAddJob,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Search, classification & category states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<string>('all');

  // Contact Overlay states
  const [contactingJob, setContactingJob] = useState<Job | null>(null);

  // Listing creation form states
  const [showForm, setShowForm] = useState(false);
  const [jTitle, setJTitle] = useState('');
  const [jContact, setJContact] = useState('');
  const [jPhone, setJPhone] = useState('');
  const [jSalary, setJSalary] = useState('');
  const [jType, setJType] = useState<'Full-Time' | 'Part-Time' | 'Freelance' | 'Internship' | 'Local Hack'>('Full-Time');
  const [jDesc, setJDesc] = useState('');
  const [jDistrict, setJDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  // Types list mappings corresponding to Phase 2 requirements (Local, Freelance, Part-Time, Full-Time, Internship)
  const JOB_TYPES = [
    { key: 'all', label: currentLang === 'en' ? 'All Roles' : 'सबै काम' },
    { key: 'local', label: currentLang === 'en' ? 'Local Jobs' : 'स्थानीय रोजगारी' },
    { key: 'freelance', label: currentLang === 'en' ? 'Freelance Work' : 'फ्रिल्यान्स कार्य' },
    { key: 'part-time', label: currentLang === 'en' ? 'Part-Time' : 'आंशिक समय (Part-Time)' },
    { key: 'full-time', label: currentLang === 'en' ? 'Full-Time' : 'पूर्ण समय (Full-Time)' },
    { key: 'internship', label: currentLang === 'en' ? 'Internship Paths' : 'प्रशिक्षार्थी अवसर' }
  ];

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jTitle.trim() || !jContact.trim() || !jPhone.trim() || !jSalary.trim()) return;

    onAddJob({
      title: jTitle.trim(),
      company: jContact.trim(),
      phone: jPhone.trim(),
      salary: jSalary.trim(),
      type: `${jType} Job`, // Maps safely to standard string
      description: jDesc.trim() || 'Urgent neighborhood requirement looking for trustworthy hands.',
      district: jDistrict
    });

    setJTitle('');
    setJContact('');
    setJPhone('');
    setJSalary('');
    setJDesc('');
    setShowForm(false);
  };

  // Filter listings
  const filteredJobs = jobs.filter((job) => {
    const matchesDistrict = !selectedDistrict || job.district === selectedDistrict;

    const matchesType = activeType === 'all' || 
      job.type.toLowerCase().includes(activeType.toLowerCase()) ||
      (activeType === 'local' && job.type.toLowerCase().includes('local')) ||
      (activeType === 'freelance' && job.type.toLowerCase().includes('freelance')) ||
      (activeType === 'part-time' && job.type.toLowerCase().includes('part')) ||
      (activeType === 'full-time' && job.type.toLowerCase().includes('full')) ||
      (activeType === 'internship' && job.type.toLowerCase().includes('intern'));

    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDistrict && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Header and Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display font-black text-stone-900 text-xl flex items-center gap-2">
            <Building className="text-emerald-800" />
            <span>{currentLang === 'en' ? 'Local Jobs & Opportunities' : 'स्थानीय श्रम र रोजगारी अवसर'}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {currentLang === 'en'
              ? 'Find verified corporate and neighborhood manual openings near your district.'
              : 'दक्ष तथा ज्यालाधारी स्थानीय काम खोज्नुहोस् वा आफ्ना परियोजनाका लागि कामदार खोज्नुहोस्।'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow transition flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus size={16} />
          <span>{currentLang === 'en' ? 'Advertise Job Opening' : 'रोजगारी विज्ञापन थप्नुहोस्'}</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-stone-200 p-4 rounded-3xl shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentLang === 'en' ? 'Search job titles, skills needed, or company contacts...' : 'काम वा सीप खोज्नुहोस् (उदा. ड्राइभर, अकाउन्टिङ, शिक्षक)...'}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 border border-stone-300 rounded-2xl bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* Categories roll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {JOB_TYPES.map((typeObj) => (
            <button
              key={typeObj.key}
              onClick={() => setActiveType(typeObj.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                activeType === typeObj.key
                  ? 'bg-emerald-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {typeObj.label}
            </button>
          ))}
        </div>

      </div>

      {/* PUBLISH FORM EXPANSION */}
      {showForm && (
        <form onSubmit={handlePostJob} className="bg-emerald-50/40 border border-emerald-250 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-black text-emerald-950 text-sm">
              💼 {currentLang === 'en' ? 'Post Local Job opportunity / Manual help needed' : 'नयाँ रोजगारी सुचीकृत गर्नुहोस्'}
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-700">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Job Headline / Position:</label>
              <input type="text" required value={jTitle} onChange={(e) => setJTitle(e.target.value)} placeholder="e.g. Graphic Designer / Farm Tractor Pilot" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Company / Hiring Person:</label>
              <input type="text" required value={jContact} onChange={(e) => setJContact(e.target.value)} placeholder="e.g. Kathmandu Agro-Tech Corp." className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Hiring Mobile phone:</label>
              <input type="tel" required value={jPhone} onChange={(e) => setJPhone(e.target.value)} placeholder="e.g. 9845012304" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Compensation / Salary Details:</label>
              <input type="text" required value={jSalary} onChange={(e) => setJSalary(e.target.value)} placeholder="e.g. NPR 25,000 / month or NPR 800 / day" className="w-full bg-white p-2.5 border rounded-lg focus:outline-none" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Contract Type Classification:</label>
              <select value={jType} onChange={(e) => setJType(e.target.value as any)} className="w-full bg-white p-2.5 border rounded-lg focus:outline-none">
                <option value="Full-Time">Full-Time (पूर्ण समय)</option>
                <option value="Part-Time">Part-Time (आंशिक समय)</option>
                <option value="Freelance">Freelance (फ्रिल्यान्स)</option>
                <option value="Internship">Internship (प्रशिक्षार्थी)</option>
                <option value="Local Hack">Local Work / Manual Labor (घरायसी श्रम)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('selectDistrict')}:</label>
              <select value={jDistrict} onChange={(e) => setJDistrict(e.target.value)} className="w-full bg-white p-2.5 border rounded-lg">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Responsibility expectations / Requirement bounds (Skills required, timing schedules):</label>
            <textarea required rows={3} value={jDesc} onChange={(e) => setJDesc(e.target.value)} placeholder="e.g. Looking for a skilled mechanic with 3+ years experience to work in our ward garage. Must understand automatic scooters, electric cycles and main engine assembly. Timings: 9:00 AM to 6:00 PM." className="w-full text-xs bg-white p-3 border rounded-lg focus:outline-none" />
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-xl">Cancel</button>
            <button type="submit" className="bg-emerald-900 text-white px-5 py-2 rounded-xl shadow">Advertise Opening</button>
          </div>
        </form>
      )}

      {/* RENDER LISTINGS CARDS */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 text-stone-400 bg-stone-50 border border-dashed rounded-3xl">
          😢 {currentLang === 'en' ? 'No job openings found matching your criteria.' : 'यस विधामा कुनै नयाँ जागिरहरू फेला परेनन्।'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-stone-200 hover:shadow-md transition duration-200 rounded-3xl p-5 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-emerald-50 text-emerald-950 font-bold border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    💼 {job.type}
                  </span>

                  <span className="text-stone-500 font-mono">📍 {job.district}</span>
                </div>

                <div>
                  <h4 className="font-display font-black text-stone-90c text-base leading-tight">
                    {job.title}
                  </h4>
                  <p className="text-[11px] font-bold text-stone-400 mt-0.5">👤 {job.company}</p>
                </div>

                <p className="text-stone-605 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Salary & Action button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-none">Offered Salary</p>
                  <p className="font-display font-black text-emerald-900 text-sm sm:text-base mt-1">
                    {job.salary}
                  </p>
                </div>

                <button
                  onClick={() => setContactingJob(job)}
                  className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Phone size={11} />
                  <span>Call & Apply</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* JOBS APPLY DETAILS OVERLAY */}
      {contactingJob && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150 relative">
            
            <button
              onClick={() => setContactingJob(null)}
              className="absolute right-5 top-5 text-stone-400 hover:text-stone-700"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-2 pt-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border flex items-center justify-center text-emerald-850">
                <Briefcase size={22} />
              </div>
              <h4 className="font-display font-black text-stone-90c text-base leading-snug">
                Apply for "{contactingJob.title}"
              </h4>
              <p className="text-xs text-stone-500">
                Contact the recruiter directly. Mention <strong className="font-bold underline text-emerald-900">नेपाली परिवार</strong> application during your discussion.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl text-xs space-y-2.5 font-sans">
              <div className="flex justify-between">
                <span>Recruiter Agent:</span>
                <span className="font-bold text-stone-900">{contactingJob.company}</span>
              </div>
              <div className="flex justify-between">
                <span>Proposed Compensation:</span>
                <span className="font-extrabold text-emerald-900">{contactingJob.salary}</span>
              </div>
              <div className="flex justify-between">
                <span>Location Pocket:</span>
                <span className="font-semibold text-stone-750">📍 {contactingJob.district} District</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`tel:${contactingJob.phone}`}
                className="w-full bg-emerald-900 hover:bg-emerald-905 text-white font-black text-xs sm:text-sm py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <Phone size={15} />
                <span>Call Hotline: {contactingJob.phone}</span>
              </a>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              *Local job listings are regulated. Never pay upfront fees for employment visas or tests.
            </p>

          </div>
        </div>
      )}

    </div>
  );
};
