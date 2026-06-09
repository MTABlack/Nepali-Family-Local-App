import React, { useState } from 'react';
import { Notice, HelpRequest } from '../types';
import { TRANSLATIONS } from '../data';
import { 
  Users, 
  Map, 
  Layers, 
  Building2, 
  Home, 
  Send, 
  CheckCircle,
  MessageSquare, 
  Megaphone, 
  Handshake, 
  Heart 
} from 'lucide-react';

interface CommunitySectionProps {
  currentLang: 'en' | 'np';
  notices: Notice[];
  helpRequests: HelpRequest[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date' | 'upvotes'>) => void;
  onAddHelpRequest: (request: Omit<HelpRequest, 'id' | 'date' | 'status'>) => void;
  onUpvoteNotice: (id: string) => void;
  selectedDistrict: string;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  currentLang,
  notices,
  helpRequests,
  onAddNotice,
  onAddHelpRequest,
  onUpvoteNotice,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // JOINS COPES (Active Joined Scopes States)
  const [activeScope, setActiveScope] = useState<'country' | 'province' | 'district' | 'city' | 'ward' | 'local'>('district');

  // SUBSECTIONS inside the active scope
  const [subTab, setSubTab] = useState<'discussions' | 'notices' | 'requests' | 'support'>('discussions');

  // Joined States list (simulating which scopes are joined)
  const [joinedScopes, setJoinedScopes] = useState({
    country: true,
    province: true,
    district: true,
    city: false,
    ward: false,
    local: false,
  });

  // Discussions feed state
  const [discussions, setDiscussions] = useState<Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    scope: string;
    upvotes: number;
  }>>([
    {
      id: 'd-1',
      sender: 'Kiran Thapa',
      text: 'Shall we request the municipality to repair the streetlights near the central temple lane? It gets very dark after 7:00 PM.',
      timestamp: '3 hours ago',
      scope: 'ward',
      upvotes: 12,
    },
    {
      id: 'd-2',
      sender: 'Saraswati Adhikari',
      text: 'Organizing a cultural dance class for children during the upcoming summer break. Let me know if any parent is interested in joining.',
      timestamp: '1 day ago',
      scope: 'local',
      upvotes: 8,
    },
    {
      id: 'd-3',
      sender: 'Prakash Rijal',
      text: 'Highly recommend we establish a community organic composting station in our layout. I can help share the baseline technical layout.',
      timestamp: '2 days ago',
      scope: 'district',
      upvotes: 15,
    }
  ]);

  const [typedDisc, setTypedDisc] = useState('');
  const [senderDisc, setSenderDisc] = useState('');

  // Form toggles
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // New Notice form states
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeCat, setNoticeCat] = useState<'notice' | 'event' | 'announcement'>('notice');

  // New Public request states
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqUrgency, setReqUrgency] = useState<'critical' | 'high' | 'normal'>('normal');

  const toggleJoin = (scope: 'country' | 'province' | 'district' | 'city' | 'ward' | 'local') => {
    setJoinedScopes({
      ...joinedScopes,
      [scope]: !joinedScopes[scope]
    });
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedDisc.trim()) return;

    const newDisc = {
      id: `disc-${Date.now()}`,
      sender: senderDisc.trim() ? senderDisc.trim() : (currentLang === 'en' ? 'Helpful Neighbor' : 'सहयोगी छिमेकी'),
      text: typedDisc.trim(),
      timestamp: 'Just now',
      scope: activeScope,
      upvotes: 1
    };

    setDiscussions([newDisc, ...discussions]);
    setTypedDisc('');
    setSenderDisc('');
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDesc.trim()) return;

    onAddNotice({
      title: noticeTitle.trim(),
      description: noticeDesc.trim(),
      category: noticeCat,
      author: currentLang === 'en' ? 'Community Admin' : 'सामुदायिक सदस्य',
      district: selectedDistrict || 'Kathmandu'
    });

    setNoticeTitle('');
    setNoticeDesc('');
    setShowNoticeForm(false);
  };

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqDesc.trim()) return;

    onAddHelpRequest({
      title: reqTitle.trim(),
      description: reqDesc.trim(),
      category: 'volunteering',
      urgency: reqUrgency,
      contactName: currentLang === 'en' ? 'Local Citizen' : 'स्थानीय नागरिक',
      contactPhone: reqPhone.trim() || '9851000000',
      district: selectedDistrict || 'Kathmandu',
      lookingFor: 'Community Aid'
    });

    setReqTitle('');
    setReqDesc('');
    setReqPhone('');
    setShowRequestForm(false);
  };

  const handleUpvoteDisc = (id: string) => {
    setDiscussions(discussions.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
  };

  // Scopes definition metadata
  const SCOPES_CONFIG = {
    country: { label: currentLang === 'en' ? 'National Level' : 'संघीय स्तर', icon: <Map className="text-emerald-700" size={16} />, detail: 'Ek Nepal - All 77 Districts' },
    province: { label: currentLang === 'en' ? 'Province Circle' : 'प्रदेश घेरा', icon: <Layers className="text-emerald-700" size={16} />, detail: 'State/Province communities (Bagmati, Koshi, etc.)' },
    district: { label: currentLang === 'en' ? 'District Level' : 'जिल्ला स्तर', icon: <Users className="text-emerald-700" size={16} />, detail: selectedDistrict ? `${selectedDistrict} District` : 'Your Primary District' },
    city: { label: currentLang === 'en' ? 'City / Rural Muni' : 'नगरपालिका / गाउँपालिका', icon: <Building2 className="text-emerald-700" size={16} />, detail: 'Metropolitan or local government pocket' },
    ward: { label: currentLang === 'en' ? 'Ward Circle' : 'वडा कार्यक्षेत्र', icon: <Building2 className="text-emerald-700" size={16} />, detail: 'Your local Ward community circle' },
    local: { label: currentLang === 'en' ? 'Tole & Local Area' : 'टोल र गाउँ समाज', icon: <Home className="text-emerald-700" size={16} />, detail: 'Basti, block level local support' },
  };

  // Filter content based on active scope
  const filteredDiscussions = discussions.filter(d => d.scope === activeScope);
  const filteredNotices = notices.filter(n => !selectedDistrict || n.district === selectedDistrict);
  const filteredHelp = helpRequests.filter(h => !selectedDistrict || h.district === selectedDistrict);

  return (
    <div className="space-y-6">

      {/* HEADER CONTROLS: COMMUNTIY SCOPE TABS */}
      <div className="bg-white border border-stone-200 p-5 rounded-3xl shadow-sm">
        <h3 className="font-display font-black text-stone-900 text-lg mb-1 flex items-center gap-2">
          <Users className="text-emerald-950" />
          <span>{currentLang === 'en' ? 'Multi-Tiered Civic Communities' : 'तहगत सामुदायिक चौतारी'}</span>
        </h3>
        <p className="text-xs text-stone-500 mb-5">
          {currentLang === 'en'
            ? 'Access customized forums and support links matching your geographic needs. Toggle join to receive notices.'
            : 'आफ्नो आवश्यकता अनुसार देश, प्रदेश, जिल्ला वा टोल स्तरको डिजिटल चौतारीमा सामेल हुन र बहस गर्न सक्नुहुन्छ।'}
        </p>

        {/* Horizontal scroll grid of tier levels */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {(Object.keys(SCOPES_CONFIG) as Array<keyof typeof SCOPES_CONFIG>).map((scopeKey) => {
            const active = activeScope === scopeKey;
            const config = SCOPES_CONFIG[scopeKey];
            const isJoined = joinedScopes[scopeKey];

            return (
              <div 
                key={scopeKey} 
                className={`p-3 rounded-2xl border text-center flex flex-col justify-between space-y-2 transition-all ${
                  active 
                    ? 'border-emerald-800 bg-emerald-50/20 shadow-xs' 
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div 
                  onClick={() => setActiveScope(scopeKey)}
                  className="cursor-pointer flex-grow block space-y-1"
                >
                  <div className="mx-auto w-8 h-8 rounded-full bg-emerald-50 border flex items-center justify-center">
                    {config.icon}
                  </div>
                  <p className="font-extrabold text-[11px] text-stone-900 truncate leading-tight">{config.label}</p>
                  <p className="text-[9px] text-stone-500 leading-none">{config.detail}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleJoin(scopeKey)}
                  className={`w-full py-1 rounded text-[10px] font-bold ${
                    isJoined 
                      ? 'bg-emerald-900 text-white hover:bg-emerald-950' 
                      : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {isJoined ? '✓ Joined' : '+ Join'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED WORKSPACE FOR SELECTED COMMUNITY */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Sub-sub navigation */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-stone-105 border border-stone-200 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-900">Active Workspace</span>
            <h4 className="font-display font-black text-stone-900 text-sm capitalize">{activeScope} Level Forum</h4>
            <p className="text-[11px] text-stone-500">
              {joinedScopes[activeScope] 
                ? '✅ You are an active registered member.' 
                : '❌ Joint recommended to participate in votes.'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 bg-white border border-stone-200 p-2 rounded-2xl shadow-xs">
            <button
              onClick={() => setSubTab('discussions')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2 transition ${
                subTab === 'discussions' ? 'bg-emerald-900 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <MessageSquare size={14} />
              <span>💬 Discussions & Chat</span>
            </button>

            <button
              onClick={() => setSubTab('notices')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2 transition ${
                subTab === 'notices' ? 'bg-emerald-900 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Megaphone size={14} />
              <span>📢 Community Notices</span>
            </button>

            <button
              onClick={() => setSubTab('requests')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2 transition ${
                subTab === 'requests' ? 'bg-emerald-900 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Handshake size={14} />
              <span>🤝 Public Aid Requests</span>
            </button>

            <button
              onClick={() => setSubTab('support')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2 transition ${
                subTab === 'support' ? 'bg-emerald-900 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Heart size={14} />
              <span>❤️ Community Support</span>
            </button>
          </div>
        </div>

        {/* Right Columns: Main panel contents */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm min-h-[450px]">
          
          {/* 1. DISCUSSIONS TAB */}
          {subTab === 'discussions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-black text-stone-900 text-base">💬 Local Discussion Boards</h4>
                <span className="text-[11px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {filteredDiscussions.length} Threads
                </span>
              </div>

              {/* Thread formulation */}
              {joinedScopes[activeScope] ? (
                <form onSubmit={handlePostDiscussion} className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                  <h5 className="font-display font-bold text-stone-800 text-xs">Post new feedback into this level</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={senderDisc}
                      onChange={(e) => setSenderDisc(e.target.value)}
                      className="text-xs bg-white border rounded-lg p-2 focus:ring-1 focus:ring-emerald-800"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Discuss local safety, parks, stray animals..."
                      value={typedDisc}
                      onChange={(e) => setTypedDisc(e.target.value)}
                      className="sm:col-span-2 text-xs bg-white border rounded-lg p-2 focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                      <Send size={11} />
                      <span>Post Thread</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-xs text-amber-900 p-4 rounded-2xl text-center">
                  ⚠️ Join this circle scope above to post discussions or vote on debates.
                </div>
              )}

              {/* Feed lists */}
              <div className="space-y-4">
                {filteredDiscussions.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-xs">No active discussions in this scope. Start one above!</div>
                ) : (
                  filteredDiscussions.map((disc) => (
                    <div key={disc.id} className="border-b border-stone-100 pb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 font-bold text-[10px] flex items-center justify-center">
                            {disc.sender.charAt(0)}
                          </span>
                          <span className="font-bold text-stone-900 text-xs">{disc.sender}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">{disc.timestamp}</span>
                      </div>
                      <p className="text-stone-650 text-xs sm:text-sm pl-7 leading-relaxed">{disc.text}</p>
                      
                      <div className="pl-7 flex justify-end">
                        <button
                          onClick={() => handleUpvoteDisc(disc.id)}
                          className="text-[10px] font-bold text-stone-400 bg-stone-50 border px-2 py-1 rounded hover:bg-stone-100 hover:text-stone-700 flex items-center gap-1 transition"
                        >
                          👍 Help/Support Discussion ({disc.upvotes})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. NOTICES TAB */}
          {subTab === 'notices' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-black text-stone-900 text-base">📢 Community Bulletins & Announcements</h4>
                <button
                  type="button"
                  onClick={() => setShowNoticeForm(!showNoticeForm)}
                  className="bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow hover:bg-emerald-950 transition"
                >
                  {showNoticeForm ? 'Close form' : '+ Publish bulletin'}
                </button>
              </div>

              {/* Form publication */}
              {showNoticeForm && (
                <form onSubmit={handlePostNotice} className="bg-emerald-50/40 border border-emerald-200 p-4 rounded-2xl space-y-3.5">
                  <h5 className="font-bold text-xs text-emerald-950">Publish notice into district: {selectedDistrict || 'Kathmandu'}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-605 mb-0.5">Bulletin Headline:</label>
                      <input type="text" required value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} placeholder="Repair of central road/Ward meeting..." className="w-full text-xs p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-605 mb-0.5">Classification Category:</label>
                      <select value={noticeCat} onChange={(e) => setNoticeCat(e.target.value as any)} className="w-full text-xs p-2 border rounded-lg bg-white">
                        <option value="notice">Notice (सूचना)</option>
                        <option value="event">Event (कार्यक्रम)</option>
                        <option value="announcement">Announcement (घोषणा)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-650 mb-0.5">Comprehensive Description:</label>
                    <textarea required rows={2} value={noticeDesc} onChange={(e) => setNoticeDesc(e.target.value)} placeholder="Provide exact timings, venue, contact details..." className="w-full text-xs p-2 border rounded-lg" />
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button type="button" onClick={() => setShowNoticeForm(false)} className="bg-stone-200 text-stone-850 px-3 py-1.5 rounded-lg font-bold">Cancel</button>
                    <button type="submit" className="bg-emerald-800 text-white px-4 py-1.5 rounded-lg font-bold shadow">Submit</button>
                  </div>
                </form>
              )}

              {/* Bulletins list */}
              <div className="space-y-4">
                {filteredNotices.map((not) => (
                  <div key={not.id} className="bg-stone-50 border p-4 rounded-2xl hover:bg-stone-100/50 transition">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">{not.category}</span>
                      <span className="text-[10px] text-stone-400 font-mono">Published by: {not.author}</span>
                    </div>
                    <h5 className="font-extrabold text-stone-900 text-sm">{not.title}</h5>
                    <p className="text-stone-605 text-xs mt-1 leading-relaxed">{not.description}</p>
                    <div className="flex justify-between items-center text-[10px] pt-3 border-t border-stone-200/50 mt-3 text-stone-500">
                      <span>📆 Date: {not.date} • 📍 District: {not.district}</span>
                      <button onClick={() => onUpvoteNotice(not.id)} className="bg-white px-2 py-1 border rounded text-[10px] hover:bg-amber-100 font-bold text-stone-700">
                        👍 Endorse/Upvote ({not.upvotes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. REQUESTS TAB */}
          {subTab === 'requests' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-black text-stone-900 text-base">📢 Regional Public Requests & Welfare Aid</h4>
                <button
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="bg-emerald-990 bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow"
                >
                  {showRequestForm ? 'Close form' : '+ Register Public Aid'}
                </button>
              </div>

              {/* Form implementation */}
              {showRequestForm && (
                <form onSubmit={handlePostRequest} className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl space-y-3">
                  <h5 className="font-bold text-xs text-amber-950">Publish community welfare concern</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-650 mb-0.5">Need title:</label>
                      <input type="text" required value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} placeholder="e.g., Volunteers needed to build retaining wall..." className="w-full text-xs p-2 border bg-white rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-650 mb-0.5">Urgency:</label>
                      <select value={reqUrgency} onChange={(e) => setReqUrgency(e.target.value as any)} className="w-full text-xs p-2 border bg-white rounded-lg">
                        <option value="normal">Normal</option>
                        <option value="high">Urgent</option>
                        <option value="critical">Critical 🚨</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-650 mb-0.5">Contact mobile:</label>
                      <input type="text" value={reqPhone} onChange={(e) => setReqPhone(e.target.value)} placeholder="e.g. 9851082103" className="w-full text-xs p-2 border bg-white rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-650 mb-0.5">Need Description:</label>
                    <textarea required rows={2} value={reqDesc} onChange={(e) => setReqDesc(e.target.value)} placeholder="Please detail how neighbors can pitch in. List items or workforce count needed." className="w-full text-xs p-2 border bg-white rounded-lg" />
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button type="button" onClick={() => setShowRequestForm(false)} className="bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-emerald-800 text-white px-4 py-1.5 rounded-lg shadow font-bold">Publish</button>
                  </div>
                </form>
              )}

              {/* Requests list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHelp.map((req) => (
                  <div key={req.id} className="bg-white border hover:shadow-xs transition p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          req.urgency === 'critical' ? 'bg-red-100 text-red-950 font-black' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {req.urgency} Action
                        </span>
                        <span>📍 {req.district}</span>
                      </div>
                      <h5 className="font-extrabold text-stone-900 text-xs sm:text-sm leading-tight">{req.title}</h5>
                      <p className="text-stone-605 text-xs mt-1.5 leading-relaxed">{req.description}</p>
                    </div>
                    <div className="pt-3 border-t border-stone-105 mt-4 flex items-center justify-between text-xs text-stone-400">
                      <span>👤 {req.contactName}</span>
                      <a href={`tel:${req.contactPhone}`} className="text-emerald-800 font-bold hover:underline">
                        📞 Call: {req.phone || req.contactPhone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUPPORT TAB */}
          {subTab === 'support' && (
            <div className="space-y-6">
              <div className="bg-emerald-900/5 border border-emerald-900/10 p-5 rounded-2xl">
                <h4 className="font-display font-black text-emerald-950 text-sm flex items-center gap-1.5 mb-2">
                  <Heart className="text-red-700 fill-red-700" size={16} />
                  <span>Chautari Local Mutual Welfare Support</span>
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed">
                  The local council organizes cooperative circles designed to provide direct financial handouts, winter blanket drives, and disaster recovery kits without red tape. Verified accounts by local ward inspectors below ensure absolute safety.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-stone-200 p-4 rounded-2xl space-y-3">
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded">
                    Cooperative Trust Saving
                  </span>
                  <h5 className="font-extrabold text-stone-900 text-sm">Prithvi Chautari Emergency Cooperative</h5>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Provides matching loans for high-tunnel onion farming and micro-poultry. Register with your voter card at Ward Section.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-stone-500">
                    <span>Active Savers: <strong>214</strong></span>
                    <a href="tel:014234509" className="text-emerald-800 font-bold">Call Manager</a>
                  </div>
                </div>

                <div className="border border-stone-200 p-4 rounded-2xl space-y-3">
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-red-100 text-red-950 px-2 py-0.5 rounded">
                    Active Fundraiser
                  </span>
                  <h5 className="font-extrabold text-stone-900 text-sm">Lekhnath Neighborhood Monsoon Kit Fund</h5>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Targeting 15 families stranded near riverside banks. We seek zinc sheets, steel pots, and warm infant food.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-stone-500">
                    <span>Raised: <strong>NPR 45,000</strong></span>
                    <span className="text-red-700 font-bold">Donate direct &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
