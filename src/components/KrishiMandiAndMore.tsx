import React, { useState } from 'react';
import { MandiPrice, SkillSharingSession, TravelDestination, CommunityPoll } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { Vote, Users, Search, Calculator, CalendarRange, ArrowUpDown, ChevronRight, HelpCircle, Landmark } from 'lucide-react';

interface KrishiMandiAndMoreProps {
  currentLang: 'en' | 'np';
  mandiPrices: MandiPrice[];
  skills: SkillSharingSession[];
  travels: TravelDestination[];
  polls: CommunityPoll[];
  onAddSkill: (s: Omit<SkillSharingSession, 'id'>) => void;
  onAddPoll: (p: Omit<CommunityPoll, 'id' | 'totalVotes' | 'ended'>) => void;
  onVote: (pollId: string, optionId: string) => void;
  selectedDistrict: string;
}

export const KrishiMandiAndMore: React.FC<KrishiMandiAndMoreProps> = ({
  currentLang,
  mandiPrices,
  skills,
  travels,
  polls,
  onAddSkill,
  onAddPoll,
  onVote,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const [subTab, setSubTab] = useState<'mandi' | 'skills' | 'travel' | 'polls'>('mandi');
  const [showForm, setShowForm] = useState(false);

  // Mandi Price Calculator states
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(mandiPrices[0]?.id || '');
  const [calcWeight, setCalcWeight] = useState<number>(10);

  // Form states - Skill share
  const [skTitle, setSkTitle] = useState('');
  const [skTeacher, setSkTeacher] = useState('');
  const [skDuration, setSkDuration] = useState('');
  const [skFee, setSkFee] = useState('');
  const [skType, setSkType] = useState('');
  const [skDesc, setSkDesc] = useState('');
  const [skTiming, setSkTiming] = useState('');
  const [skDistrict, setSkDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  // Form states - Poll
  const [pollQ, setPollQ] = useState('');
  const [pollOptA, setPollOptA] = useState('');
  const [pollOptB, setPollOptB] = useState('');
  const [pollOptC, setPollOptC] = useState('');
  const [pollDistrict, setPollDistrict] = useState(selectedDistrict || DISTRICTS[0]);

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skTitle.trim() || !skTeacher.trim() || !skDesc.trim()) return;
    onAddSkill({
      title: skTitle,
      teacher: skTeacher,
      duration: skDuration || 'Single Session',
      fee: skFee || 'Free',
      type: skType || 'Heritage Skill',
      description: skDesc,
      timing: skTiming || 'Weekend 2 PM',
      district: skDistrict
    });
    setSkTitle('');
    setSkTeacher('');
    setSkDesc('');
    setShowForm(false);
  };

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQ.trim() || !pollOptA.trim() || !pollOptB.trim()) return;
    
    const options = [
      { id: '1', text: pollOptA, votes: 0 },
      { id: '2', text: pollOptB, votes: 0 }
    ];
    if (pollOptC.trim()) {
      options.push({ id: '3', text: pollOptC, votes: 0 });
    }

    onAddPoll({
      question: pollQ,
      options,
      district: pollDistrict
    });

    setPollQ('');
    setPollOptA('');
    setPollOptB('');
    setPollOptC('');
    setShowForm(false);
  };

  // Filter lists
  const filteredSkills = skills.filter(s => !selectedDistrict || s.district === selectedDistrict);
  const filteredTravels = travels.filter(v => !selectedDistrict || v.district === selectedDistrict);
  const filteredPolls = polls.filter(p => !selectedDistrict || p.district === selectedDistrict);

  // Selected commodity for calculator
  const selectedCommodity = mandiPrices.find(m => m.id === selectedCommodityId) || mandiPrices[0];

  return (
    <div className="space-y-6">
      
      {/* Sub tabs lists */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-stone-100 p-1 rounded-xl gap-1">
        <button
          onClick={() => { setSubTab('mandi'); setShowForm(false); }}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'mandi' ? 'bg-emerald-800 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🥬 {t('tabAgri')}
        </button>

        <button
          onClick={() => { setSubTab('polls'); setShowForm(false); }}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'polls' ? 'bg-emerald-800 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🗳️ {t('tabPolls')}
        </button>

        <button
          onClick={() => { setSubTab('skills'); setShowForm(false); }}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'skills' ? 'bg-emerald-800 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🪵 {t('tabEdu')}
        </button>

        <button
          onClick={() => { setSubTab('travel'); setShowForm(false); }}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            subTab === 'travel' ? 'bg-emerald-800 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          🏔️ {t('tabTravel')}
        </button>
      </div>

      {/* KRISHI MANDI SUBTAB */}
      {subTab === 'mandi' && (
        <div className="space-y-6">
          
          {/* Header rate banner slider */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 block">
            <h4 className="font-display font-bold text-emerald-900 text-base mb-2 flex items-center gap-1.5">
              📈 {t('mandiTitle')}
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm">{t('swappedDisclaimer')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rates Table list */}
            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-4 overflow-hidden shadow-sm">
              <h5 className="font-display font-extrabold text-stone-900 text-sm mb-3 uppercase tracking-wider text-stone-400">
                🌱 {currentLang === 'en' ? 'Today Veggie Index' : 'हालको फलफूल तथा तरकारी दरभाउ'}
              </h5>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600 border-collapse">
                  <thead>
                    <tr className="bg-stone-105 border-b border-stone-150 uppercase text-[10px] text-stone-400 font-bold">
                      <th className="py-2.5 px-3">{t('commodity')}</th>
                      <th className="py-2.5 px-2">{t('unit')}</th>
                      <th className="py-2.5 px-2 text-center">{t('range')}</th>
                      <th className="py-2.5 px-3 text-right">Trend / Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {mandiPrices.map((m) => (
                      <tr key={m.id} className="hover:bg-amber-50/15">
                        <td className="py-3 px-3 font-semibold text-stone-950">
                          {currentLang === 'en' ? m.commodity : m.commodityNp}
                        </td>
                        <td className="py-3 px-2 font-mono text-stone-500">{m.unit}</td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-emerald-850">
                          NPR {m.minPrice} - {m.maxPrice}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {m.change > 0 ? (
                            <span className="text-red-700 font-bold text-[11px]">▲ +{m.change} NPR</span>
                          ) : m.change < 0 ? (
                            <span className="text-emerald-700 font-bold text-[11px]">▼ {m.change} NPR</span>
                          ) : (
                            <span className="text-stone-400 font-bold font-mono text-[11px]">— Stable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price evaluation calculator block */}
            <div className="bg-amber-50/70 border border-amber-250 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
              <h5 className="font-display font-black text-amber-950 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                <Calculator className="text-amber-800" size={16} />
                {currentLang === 'en' ? 'Krishi Trade Calculator' : 'कृषि उपज लागत गणक'}
              </h5>
              <p className="text-stone-600 text-xs">
                {currentLang === 'en' 
                  ? 'Calculate wholesale vs retail pricing of agriculture yields to bargain fairly.'
                  : 'तरकारी वा अन्न मन्डीको थोक दरभाउ हिसाब गरी खरिद बिक्रीमा शुद्धता ल्याउनुहोस्।'}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Select Veg/Crop:</label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-semibold focus:outline-none"
                >
                  {mandiPrices.map(m => (
                    <option key={m.id} value={m.id}>
                      {currentLang === 'en' ? m.commodity : m.commodityNp} (Rs.{((m.minPrice + m.maxPrice)/2).toFixed(0)}/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Quantity / weight (in KGs):</label>
                <input
                  type="number"
                  min="1"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="bg-stone-100 border border-stone-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/60 pb-1.5">
                  <span>Average Rate / KG:</span>
                  <span className="font-bold">NPR {selectedCommodity ? ((selectedCommodity.minPrice + selectedCommodity.maxPrice)/2).toFixed(0) : 0}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Estimated Min Trade Value:</span>
                  <span className="font-mono">NPR {selectedCommodity ? selectedCommodity.minPrice * calcWeight : 0}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Estimated Max Trade Value:</span>
                  <span className="font-mono">NPR {selectedCommodity ? selectedCommodity.maxPrice * calcWeight : 0}</span>
                </div>

                <div className="border-t border-stone-300/80 pt-2 flex items-baseline justify-between">
                  <span className="text-stone-800 text-[11px] font-extrabold uppercase">Calculated Fair Price:</span>
                  <span className="text-emerald-900 font-display font-black text-base sm:text-lg">
                    Rs. {selectedCommodity ? (((selectedCommodity.minPrice + selectedCommodity.maxPrice) / 2) * calcWeight).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POLLS / DECISION MAKING SUBTAB */}
      {subTab === 'polls' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-stone-900 text-lg flex items-center gap-1.5">
              🗳️ {t('activePolls')}
            </h4>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs px-3 py-1.5 rounded-xl transition shadow flex items-center gap-1"
            >
              <Users size={12} />
              <span>{t('createPoll')}</span>
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <form onSubmit={handlePollSubmit} className="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <h5 className="font-display font-bold text-emerald-950 text-sm">🗳️ Launch Local Discussion Poll</h5>
              
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Question / Decisive Proposal:</label>
                <input
                  type="text"
                  required
                  value={pollQ}
                  onChange={(e) => setPollQ(e.target.value)}
                  placeholder="e.g. Do we set fine for open grazing of goats in community forest lanes?"
                  className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Option 1:</label>
                  <input type="text" required value={pollOptA} onChange={(e) => setPollOptA(e.target.value)} placeholder="e.g. Yes, NPR 500 fine" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Option 2:</label>
                  <input type="text" required value={pollOptB} onChange={(e) => setPollOptB(e.target.value)} placeholder="e.g. No, verbal warning is enough" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Option 3 (Optional):</label>
                  <input type="text" value={pollOptC} onChange={(e) => setPollOptC(e.target.value)} placeholder="e.g. Create a designated grazing ring" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
                  <select value={pollDistrict} onChange={(e) => setPollDistrict(e.target.value)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white">
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="bg-stone-300 text-stone-800 px-3 py-2 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="bg-emerald-800 text-white px-4 py-2 rounded-lg shadow">{t('submit')}</button>
              </div>
            </form>
          )}

          {/* List Poll Cards */}
          {filteredPolls.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-50 border border-dashed rounded-xl">No active decision polls inside this district.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPolls.map((poll) => (
                <div key={poll.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-sm transition flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                      📍 {poll.district}
                    </span>
                    <h5 className="font-display font-black text-stone-900 text-base mt-2.5 mb-4 leading-tight">
                      {poll.question}
                    </h5>

                    {/* Options list check */}
                    <div className="space-y-2.5">
                      {poll.options.map((opt) => {
                        const pct = poll.totalVotes > 0 ? (opt.votes / poll.totalVotes) * 100 : 0;
                        const isVoted = poll.votedOptionId === opt.id;

                        return (
                          <div key={opt.id} className="relative block">
                            <button
                              onClick={() => onVote(poll.id, opt.id)}
                              disabled={poll.votedOptionId !== undefined}
                              className={`w-full text-left relative z-10 p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between gap-4 ${
                                isVoted 
                                  ? 'border-emerald-700 bg-emerald-50/15'
                                  : 'border-stone-200 hover:border-emerald-800 bg-stone-50/20'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <span className="font-mono text-stone-500 shrink-0">{pct.toFixed(0)}% ({opt.votes})</span>
                            </button>
                            
                            {/* Graphical back-bar */}
                            <div 
                              style={{ width: `${pct}%` }}
                              className={`absolute left-0 top-0 bottom-0 rounded-xl transition-all duration-300 ${
                                isVoted ? 'bg-emerald-100/60' : 'bg-stone-100/80'
                              }`} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3.5 mt-5 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-medium">📊 {t('totalVoted')} <strong className="text-stone-850 font-bold">{poll.totalVotes}</strong></span>
                    <span className="text-[10px] uppercase font-bold text-amber-800">
                      {poll.votedOptionId ? 'Vote casted ✅' : 'Cast Vote 👇'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Core Principle reminder */}
          <div className="bg-stone-100 border border-stone-200 p-4 rounded-xl text-stone-600 text-xs flex items-start gap-2 leading-relaxed">
            <Landmark className="text-emerald-850 shrink-0 mt-0.5" size={16} />
            <p>
              <strong>Direct Democracy & Chautari Councils</strong>: Community members resolve local infrastructure debates directly. Our tool tracks votes per district, avoiding central bureaucratic delays. Let us improve Nepal together.
            </p>
          </div>

        </div>
      )}

      {/* SKILLS SHARE SUBTAB */}
      {subTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-stone-900 text-lg">🪵 Heritage craft & digital literacy sharing</h4>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-900 text-white hover:bg-emerald-950 font-bold text-xs px-3 py-1.5 rounded-xl transition shadow flex items-center gap-1"
            >
              ➕ Show skill application
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSkillSubmit} className="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <h5 className="font-display font-bold text-emerald-950 text-sm">🪵 List New Educational/Skill Sharing Course</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Class title:</label>
                  <input type="text" required value={skTitle} onChange={(e) => setSkTitle(e.target.value)} placeholder="e.g. Basic Computer Typing & Email Skills" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Teacher / Mentor Name:</label>
                  <input type="text" required value={skTeacher} onChange={(e) => setSkTeacher(e.target.value)} placeholder="Prakash Bhatta" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Duration:</label>
                  <input type="text" value={skDuration} onChange={(e) => setSkDuration(e.target.value)} placeholder="e.g. 5 days, 10 hours" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Fee (NPR or Free):</label>
                  <input type="text" value={skFee} onChange={(e) => setSkFee(e.target.value)} placeholder="Free / NPR 500 for tools" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Topic Type:</label>
                  <input type="text" value={skType} onChange={(e) => setSkType(e.target.value)} placeholder="e.g. Handicraft, Tutoring, Coding" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Class Timing:</label>
                  <input type="text" value={skTiming} onChange={(e) => setSkTiming(e.target.value)} placeholder="Every Sat morning 8-10 AM" className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">{t('selectDistrict')}</label>
                  <select value={skDistrict} onChange={(e) => setSkDistrict(e.target.value)} className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white">
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Brief Description / Requirements:</label>
                <textarea required rows={2} value={skDesc} onChange={(e) => setSkDesc(e.target.value)} placeholder="Who can attend, maximum student limits, laptop or basket requirements..." className="w-full py-2 px-3 border border-stone-300 rounded-lg text-sm bg-white" />
              </div>

              <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="bg-stone-300 text-stone-800 px-3 py-2 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="bg-emerald-800 text-white px-4 py-2 rounded-lg shadow">{t('submit')}</button>
              </div>
            </form>
          )}

          {filteredSkills.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-50 border border-dashed rounded-xl">No active skill workshops listed in this area now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSkills.map(sk => (
                <div key={sk.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-sm transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold font-mono tracking-wider text-emerald-900 bg-stone-105 border px-2 py-0.5 rounded">
                        📚 {sk.type}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">📍 {sk.district}</span>
                    </div>

                    <h5 className="font-display font-black text-stone-900 text-base leading-snug">{sk.title}</h5>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{sk.description}</p>
                  </div>

                  <div className="bg-stone-50/80 border border-stone-100 p-3 rounded-xl mt-4 space-y-1.5 text-xs text-stone-700">
                    <div className="flex justify-between"><span>👤 Teacher:</span><span className="font-bold">{sk.teacher}</span></div>
                    <div className="flex justify-between"><span>🕒 Timing:</span><span className="font-semibold">{sk.timing}</span></div>
                    <div className="flex justify-between"><span>⏳ Duration:</span><span>{sk.duration}</span></div>
                    <div className="flex justify-between border-t border-stone-200/50 pt-1.5 mt-2 text-emerald-950 font-bold">
                      <span>Admission/Fee:</span>
                      <span>{sk.fee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TRAVEL & TOURISM */}
      {subTab === 'travel' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-stone-900 text-lg flex items-center gap-1.5">
              🗺️ {t('localGems')}
            </h4>
            <span className="text-[11px] bg-amber-500 text-amber-950 font-bold px-3 py-1 rounded-full font-mono uppercase">
              Support Village Homestays
            </span>
          </div>

          {filteredTravels.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-50 border border-dashed rounded-xl">No tourism guides listed for this specific district yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTravels.map(tr => (
                <div key={tr.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 bg-stone-105 rounded px-2.5 py-0.5">
                        🏔️ {tr.district}
                      </span>
                    </div>

                    <h5 className="font-display font-black text-stone-900 text-base leading-tight">
                      {tr.place}
                    </h5>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {tr.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tr.activities.map(act => (
                        <span key={act} className="bg-amber-100 text-amber-900 border border-amber-200/70 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⭐ {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-xl p-3 mt-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] text-stone-400 uppercase tracking-widest">{t('bestSeason')}</p>
                      <p className="font-bold text-emerald-950">{tr.bestTime}</p>
                    </div>

                    {tr.homestayContact && (
                      <div className="text-right">
                        <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-none mb-0.5">Community Homestay contact</p>
                        <p className="font-extrabold text-amber-800 leading-tight">{tr.homestayContact.split(':')[0]}</p>
                        <a href={`tel:${tr.homestayContact.split(':')[1]}`} className="text-xs font-mono font-bold text-emerald-800 underline">
                          {tr.homestayContact.split(':')[1]}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
