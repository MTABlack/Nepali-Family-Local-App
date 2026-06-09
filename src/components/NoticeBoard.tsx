import React, { useState } from 'react';
import { Notice } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { Megaphone, Calendar, ThumbsUp, Search, PlusCircle, User, MapPin } from 'lucide-react';

interface NoticeBoardProps {
  currentLang: 'en' | 'np';
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date' | 'upvotes'>) => void;
  onUpvoteNotice: (id: string) => void;
  selectedDistrict: string;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  currentLang,
  notices,
  onAddNotice,
  onUpvoteNotice,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'notice' | 'event' | 'announcement'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'notice' | 'event' | 'announcement'>('notice');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDistrict, setNewDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newAuthor.trim()) return;

    onAddNotice({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      author: newAuthor,
      district: newDistrict
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewAuthor('');
    setShowAddForm(false);
  };

  // Filtering
  const filteredNotices = notices.filter(notice => {
    const matchesDistrict = selectedDistrict ? notice.district === selectedDistrict : true;
    const matchesCategory = activeCategory === 'all' ? true : notice.category === activeCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow"
        >
          <PlusCircle size={18} />
          <span>{t('addNotice')}</span>
        </button>
      </div>

      {/* Add Form Block */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="font-display font-bold text-emerald-900 text-lg flex items-center gap-2">
            📝 {currentLang === 'en' ? 'Publish Local Bulletin' : 'नयाँ सूचना अथवा जानकारी प्रकाशित गर्नुहोस्'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('title')}</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={currentLang === 'en' ? 'e.g. Village Temple Festivity' : 'शीर्षक लेख्नुहोस्...'}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('category')}</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="notice">📢 {t('notice')}</option>
                <option value="event">📅 {t('event')}</option>
                <option value="announcement">📣 {t('announcement')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('desc')}</label>
            <textarea
              required
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder={currentLang === 'en' ? 'Describe the local event/notice detail...' : 'बारीकी विवरण उल्लेख गर्नुहोस्...'}
              className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('name')}</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder={currentLang === 'en' ? 'Your name / agency' : 'तपाईको नाम वा संस्था...'}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
              <select
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {DISTRICTS.map((dis) => (
                  <option key={dis} value={dis}>{dis}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-stone-300 hover:bg-stone-400 text-stone-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      )}

      {/* Category Toggles */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeCategory === 'all'
              ? 'bg-emerald-900 text-stone-100 shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🌐 {currentLang === 'en' ? 'All Bulletins' : 'सम्पूर्ण बुलेटिन'}
        </button>
        <button
          onClick={() => setActiveCategory('notice')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeCategory === 'notice'
              ? 'bg-emerald-900 text-stone-100 shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📢 {t('notice')}
        </button>
        <button
          onClick={() => setActiveCategory('event')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeCategory === 'event'
              ? 'bg-emerald-900 text-stone-100 shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📅 {t('event')}
        </button>
        <button
          onClick={() => setActiveCategory('announcement')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeCategory === 'announcement'
              ? 'bg-emerald-900 text-stone-100 shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📣 {t('announcement')}
        </button>
      </div>

      {/* Notice List Grid */}
      {filteredNotices.length === 0 ? (
        <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <Megaphone className="mx-auto text-stone-300 mb-2" size={32} />
          <p className="text-stone-500 text-sm">
            {currentLang === 'en' 
              ? 'No notices found for this selection. Be the first to post!' 
              : 'यस विधामा कुनै सूचना फेला परेन। पहिलो सूचनाकर्ता बन्नुहोस्!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${
                    notice.category === 'event' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                      : notice.category === 'announcement' 
                      ? 'bg-rose-100 text-rose-900 border border-rose-200' 
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {notice.category === 'event' ? <Calendar size={10} /> : <Megaphone size={10} />}
                    {t(notice.category)}
                  </span>
                  
                  <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                    <MapPin size={11} /> {notice.district}
                  </span>
                </div>

                <h4 className="font-display font-bold text-stone-900 text-base mb-2 leading-snug">
                  {notice.title}
                </h4>
                
                <p className="text-stone-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {notice.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <User size={13} className="text-stone-400" />
                  <span>{notice.author}</span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-[11px]">{notice.date}</span>
                </div>

                <button
                  onClick={() => onUpvoteNotice(notice.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-emerald-950 font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-colors"
                >
                  <ThumbsUp size={12} className="text-emerald-700" />
                  <span>{notice.upvotes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
