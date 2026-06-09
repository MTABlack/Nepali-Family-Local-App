import React from 'react';
import { Notice, HelpRequest, ServiceProvider, TravelDestination, CommunityPoll } from '../types';
import { TRANSLATIONS } from '../data';
import { 
  Bell, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  HeartHandshake, 
  ArrowRight, 
  MapPin, 
  Star, 
  Compass, 
  Vote,
  Calendar
} from 'lucide-react';

interface HomeSectionProps {
  currentLang: 'en' | 'np';
  notices: Notice[];
  helpRequests: HelpRequest[];
  services: ServiceProvider[];
  travels: TravelDestination[];
  polls: CommunityPoll[];
  selectedDistrict: string;
  onNavigate: (tab: 'home' | 'community' | 'services' | 'marketplace' | 'help' | 'chat' | 'jobs' | 'profile') => void;
  onUpvoteNotice: (id: string) => void;
  onVotePoll: (pollId: string, optionId: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  currentLang,
  notices,
  helpRequests,
  services,
  travels,
  polls,
  selectedDistrict,
  onNavigate,
  onUpvoteNotice,
  onVotePoll
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Filter based on selected district if any
  const filteredNotices = notices.filter(n => !selectedDistrict || n.district === selectedDistrict);
  const filteredHelp = helpRequests.filter(h => h.status === 'open' && (!selectedDistrict || h.district === selectedDistrict));
  const filteredServices = services.filter(s => !selectedDistrict || s.district === selectedDistrict);
  const filteredPolls = polls.filter(p => !selectedDistrict || p.district === selectedDistrict);

  // Pick topmost items
  const announcements = filteredNotices.filter(n => n.category === 'announcement' || n.category === 'event').slice(0, 2);
  const emergencyAlerts = filteredHelp.filter(h => h.urgency === 'critical');
  const regularRequests = filteredHelp.filter(h => h.urgency !== 'critical').slice(0, 3);
  const recommendedServices = filteredServices.sort((a, b) => b.rating - a.rating).slice(0, 3);
  const activePoll = filteredPolls[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner Card */}
      <div className="relative bg-gradient-to-tr from-emerald-950 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <Sparkles size={300} />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-800/80 border border-emerald-700 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles size={13} className="text-amber-400" />
            <span>{currentLang === 'en' ? 'Community Dashboard' : 'सामुदायिक ड्यासबोर्ड'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
            {currentLang === 'en' ? 'Welcome back to your local circle' : 'हाम्रो डिजिटल चौतारीमा स्वागत छ'}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-base leading-relaxed">
            {currentLang === 'en'
              ? 'Stay updated on ward decisions, secure instant local aid (Guhar), trade direct with local families, and explore verified regional services.'
              : 'आफ्नो वडाका विकास र गतिविधि थाहा पाउनुहोस्, छिटो गुहार प्राप्त गर्नुहोस, छिमेकीसँग सिधा व्यापार गर्नुहोस र गाउँ-टोलका सीपहरू प्रवर्द्धन गर्नुहोस।'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('help')}
              className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow transition"
            >
              🆘 {currentLang === 'en' ? 'Request Immediate Help' : 'अधिकार/गुहार माग्नुहोस्'}
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl border border-white/20 transition"
            >
              👥 {currentLang === 'en' ? 'Explore Communities' : 'सामुदायिक बहस'}
            </button>
          </div>
        </div>
      </div>

      {/* EMERGENCY ALERTS SECTION */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 p-5 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="animate-bounce" size={24} />
            <h3 className="font-display font-black text-lg tracking-wide uppercase">
              🚨 {currentLang === 'en' ? 'Active Local SOS Warnings' : 'तात्कालिक खतरा / आपातकालीन'}: {emergencyAlerts.length}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className="bg-white border border-red-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      {alert.category}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">📍 {alert.district}</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm mt-2">{alert.title}</h4>
                  <p className="text-stone-600 text-xs mt-1">{alert.description}</p>
                  <p className="text-stone-500 text-xs mt-2 font-semibold">🔍 Contact: {alert.contactName} ({alert.contactPhone})</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                  <a href={`tel:${alert.contactPhone}`} className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-red-700 transition">
                    📞 Call Immediate
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Left Column for community, Right Column for secondary lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* COMMUNITY ANNOUNCEMENTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-black text-stone-900 flex items-center gap-2">
                <Bell size={20} className="text-emerald-800" />
                <span>{currentLang === 'en' ? 'Recent Community Updates & Notices' : 'वडा सूचना तथा घोषणा विवरण'}</span>
              </h3>
              <button 
                onClick={() => onNavigate('community')} 
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>{currentLang === 'en' ? 'See all' : 'सबै हेर्नुहोस्'}</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="p-6 bg-stone-50 border border-dashed rounded-2xl text-center text-stone-400 text-xs">
                {currentLang === 'en' ? 'No recent announcements found.' : 'हाल कुनैपनि सूचना प्रकाशित गरिएको छैन।'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {announcements.map(not => (
                  <div key={not.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-xs transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900">
                        🔔 {not.category}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{not.date} • 📍 {not.district}</span>
                    </div>
                    <h4 className="font-extrabold text-stone-900 text-base">{not.title}</h4>
                    <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">{not.description}</p>
                    <div className="border-t border-stone-100 pt-3 mt-4 flex items-center justify-between text-xs text-stone-500">
                      <span>👤 {not.author}</span>
                      <button 
                        onClick={() => onUpvoteNotice(not.id)}
                        className="bg-emerald-50 text-emerald-900 px-3 py-1 rounded-xl font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                      >
                        👍 Upvote ({not.upvotes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE DISCUSSIONS & COMMUNITY DEBATE (POLL) */}
          {activePoll && (
            <div className="bg-gradient-to-br from-stone-50 to-amber-50/40 border border-stone-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  📊 {currentLang === 'en' ? 'Civic Chautari Decision' : 'नागरिक चौतारी जनमत निर्णय'}
                </span>
                <span className="text-xs text-stone-400 font-mono">📍 {activePoll.district}</span>
              </div>
              <div>
                <h4 className="font-display font-black text-stone-900 text-lg">{activePoll.question}</h4>
                <p className="text-xs text-stone-500 mt-1">
                  {currentLang === 'en' 
                    ? 'Take part in this official vote to decide guidelines for local areas.'
                    : 'आफ्नो वडा वा टोलको यस छलफलमा सक्रिय रुपले मतदान गर्नुहोस्।'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {activePoll.options.map(opt => {
                  const pct = activePoll.totalVotes > 0 ? (opt.votes / activePoll.totalVotes) * 100 : 0;
                  const isVoted = activePoll.votedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onVotePoll(activePoll.id, opt.id)}
                      disabled={activePoll.votedOptionId !== undefined}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold relative overflow-hidden transition flex items-center justify-between ${
                        isVoted 
                          ? 'border-emerald-700 text-emerald-950 font-extrabold'
                          : 'border-stone-200 hover:border-stone-400 text-stone-700 bg-white'
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-2">
                        {isVoted && <span className="text-emerald-700">✓</span>}
                        <span>{opt.text}</span>
                      </div>
                      <span className="relative z-10 font-mono text-stone-500">
                        {pct.toFixed(0)}% ({opt.votes})
                      </span>
                      <div 
                        style={{ width: `${pct}%` }}
                        className={`absolute left-0 top-0 bottom-0 ${isVoted ? 'bg-emerald-100/40' : 'bg-stone-150/40'} pointer-events-none transition-all duration-500`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex justify-between items-center text-xs text-stone-400 font-mono">
                <span>📊 {currentLang === 'en' ? 'Total Ballots Cast:' : 'जम्मा खसेको मत:'} <strong className="text-stone-850 font-bold">{activePoll.totalVotes}</strong></span>
                <button onClick={() => onNavigate('community')} className="text-emerald-800 font-bold hover:underline">
                  {currentLang === 'en' ? 'Open Town Hall' : 'सामुदायिक निर्णय हेर्नुहोस्'} →
                </button>
              </div>
            </div>
          )}

          {/* NEARBY ACTIVITIES / GHUMPHIR */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-black text-stone-900 flex items-center gap-2">
                <Compass size={20} className="text-emerald-800" />
                <span>{currentLang === 'en' ? 'Explore Local Tourism & Wanders' : 'पर्यटन तथा घुमफिर गाइडहरू'}</span>
              </h3>
              <button 
                onClick={() => onNavigate('community')} // Let's keep it robust
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                {currentLang === 'en' ? 'Details' : 'विस्तृत'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {travels.slice(0, 2).map(tr => (
                <div key={tr.id} className="bg-white border border-stone-250 p-5 rounded-2xl hover:shadow-xs transition flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-stone-500 bg-stone-100 font-mono px-2 py-0.5 rounded">📍 {tr.district}</span>
                      <span className="text-[10px] text-amber-800 font-medium font-mono uppercase bg-amber-50 px-2 py-0.5 rounded">Seasonal Recommendation</span>
                    </div>
                    <h4 className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">{tr.place}</h4>
                    <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">{tr.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {tr.activities.map(act => (
                        <span key={act} className="text-[9px] font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-stone-400">
                    <span>🍂 Best: {tr.bestTime}</span>
                    <button onClick={() => onNavigate('community')} className="font-bold text-emerald-850 hover:underline">
                      Contact Homestay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Recommended services & help requests */}
        <div className="space-y-8">
          
          {/* TRENDING LOCAL NEEDS */}
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 space-y-4">
            <h4 className="font-display font-black text-stone-950 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <TrendingUp size={16} className="text-amber-600" />
              <span>{currentLang === 'en' ? 'Trending Neighborhood Needs' : 'गाउँ-टोलका माग र बहसहरू'}</span>
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-mono font-bold text-[10px]">#1 URGENT</span>
                <span className="font-semibold text-stone-900">{currentLang === 'en' ? 'Blood Donors O-ve' : 'O- नेगेटिभ रक्तदाता खरिद'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bg-stone-150 text-stone-700 px-2 py-0.5 rounded font-mono font-bold text-[10px]">#2 SEASONAL</span>
                <span className="font-semibold text-stone-900">{currentLang === 'en' ? 'Agriculture Seed Sharing' : 'मकै तथा बीउ बिजन आदानप्रदान'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bg-stone-150 text-stone-700 px-2 py-0.5 rounded font-mono font-bold text-[10px]">#3 OPPORTUNITY</span>
                <span className="font-semibold text-stone-900">{currentLang === 'en' ? 'Ward 4 Road Work labor' : 'वडा नं ४ सडक मर्मत ज्यालाधारी'}</span>
              </div>
            </div>
          </div>

          {/* HELP REQUESTS (GUHAR) */}
          <div className="bg-amber-50/50 border border-amber-250 p-5 rounded-3xl space-y-4">
            <h4 className="font-display font-black text-amber-950 text-sm uppercase tracking-wide flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="text-amber-800" size={16} />
                {currentLang === 'en' ? 'Active Local Guhar' : 'सक्रिय स्थानीय गुहारहरू'}
              </span>
              <button onClick={() => onNavigate('help')} className="text-[11px] font-bold text-amber-805 hover:underline">
                {currentLang === 'en' ? 'Submit' : 'नयाँ'}
              </button>
            </h4>

            {regularRequests.length === 0 ? (
              <p className="text-stone-400 text-xs py-4 text-center">{currentLang === 'en' ? 'No active help requests nearby.' : 'हाल कुनैपनि गुहार अनुरोध छैन।'}</p>
            ) : (
              <div className="space-y-3.5">
                {regularRequests.map(req => (
                  <div key={req.id} className="bg-white p-3.5 rounded-2xl border border-amber-200/60 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                        req.urgency === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {req.urgency} Aid
                      </span>
                      <span className="text-stone-400 font-mono">📍 {req.district}</span>
                    </div>
                    <p className="font-semibold text-stone-900 text-xs leading-snug">{req.title}</p>
                    <p className="text-stone-500 text-[11px] line-clamp-2">{req.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 mt-2 text-[11px]">
                      <span className="font-mono text-emerald-800 font-semibold">{req.contactName}</span>
                      <a href={`tel:${req.contactPhone}`} className="text-emerald-900 hover:underline font-bold">
                        📞 Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECOMMENDED SERVICES */}
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-3xl space-y-4">
            <h4 className="font-display font-black text-stone-905 text-sm uppercase tracking-wide flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Star className="text-amber-500 fill-amber-500" size={16} />
                {currentLang === 'en' ? 'Top Rated Local Helpers' : 'सिफारिस गरिएका विज्ञहरू'}
              </span>
              <button onClick={() => onNavigate('services')} className="text-[11px] font-bold text-emerald-800 hover:underline">
                {currentLang === 'en' ? 'All' : 'सबै'} &rarr;
              </button>
            </h4>

            {recommendedServices.length === 0 ? (
              <p className="text-stone-400 text-xs py-4 text-center">{currentLang === 'en' ? 'No local helpers registered yet.' : 'हाल कुनैपनि दर्ता भएका विज्ञहरू छैनन्।'}</p>
            ) : (
              <div className="space-y-3">
                {recommendedServices.map(ser => (
                  <div key={ser.id} className="bg-white p-3 rounded-2xl border border-stone-200/60 hover:shadow-inner transition flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-display font-extrabold text-sm border">
                      {ser.name.charAt(0)}
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-emerald-900">{ser.category}</span>
                        <div className="flex items-center text-amber-500 gap-0.5 text-xs">
                          <Star size={10} className="fill-amber-500" />
                          <span className="font-bold">{ser.rating}</span>
                        </div>
                      </div>
                      <p className="font-extrabold text-stone-900 text-xs">{ser.name}</p>
                      <p className="text-stone-500 text-[10px] line-clamp-1">{ser.description}</p>
                      <p className="text-[10px] text-stone-400">Rate: {ser.cost} • 📍 {ser.district}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
