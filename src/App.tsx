import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { CommunitySection } from './components/CommunitySection';
import { ServicesSection } from './components/ServicesSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { HelpCenterSection } from './components/HelpCenterSection';
import { ChatSection } from './components/ChatSection';
import { JobsSection } from './components/JobsSection';
import { ProfileSection } from './components/ProfileSection';

// Types
import {
  Notice,
  HelpRequest,
  ServiceProvider,
  Job,
  MarketItem,
  EmergencyContact,
  SkillSharingSession,
  TravelDestination,
  MandiPrice,
  LocalBusiness,
  CommunityPoll,
  ChatMessage
} from './types';

// Default mock datasets
import {
  TRANSLATIONS,
  INITIAL_NOTICES,
  INITIAL_HELP_REQUESTS,
  INITIAL_SERVICES,
  INITIAL_JOBS,
  INITIAL_MARKET_ITEMS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_SKILLS,
  INITIAL_TRAVEL,
  INITIAL_MANDI_PRICES,
  INITIAL_BUSINESSES,
  INITIAL_POLLS,
  INITIAL_CHAT
} from './data';

export default function App() {
  const [lang, setLang] = useState<'en' | 'np'>('np'); // Defaulting to Nepali language for cultural alignment
  const [selectedDistrict, setSelectedDistrict] = useState<string>(''); // Default to Countrywide (All districts)

  // MAIN STATE REPOSITORIES
  const [notices, setNotices] = useState<Notice[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [polls, setPolls] = useState<CommunityPoll[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'services' | 'marketplace' | 'help' | 'chat' | 'jobs' | 'profile'>('home');

  // LOAD IN THE STATE FROM LOCALSTORAGE OR FALLBACK TO SOURCE DATASETS
  useEffect(() => {
    const loadedNotices = localStorage.getItem('n_notices');
    const loadedHelp = localStorage.getItem('n_help');
    const loadedServices = localStorage.getItem('n_services');
    const loadedJobs = localStorage.getItem('n_jobs');
    const loadedMarket = localStorage.getItem('n_market');
    const loadedBusiness = localStorage.getItem('n_business');
    const loadedPolls = localStorage.getItem('n_polls');
    const loadedChat = localStorage.getItem('n_chat');

    setNotices(loadedNotices ? JSON.parse(loadedNotices) : INITIAL_NOTICES);
    setHelpRequests(loadedHelp ? JSON.parse(loadedHelp) : INITIAL_HELP_REQUESTS);
    setServices(loadedServices ? JSON.parse(loadedServices) : INITIAL_SERVICES);
    setJobs(loadedJobs ? JSON.parse(loadedJobs) : INITIAL_JOBS);
    setMarketItems(loadedMarket ? JSON.parse(loadedMarket) : INITIAL_MARKET_ITEMS);
    setBusinesses(loadedBusiness ? JSON.parse(loadedBusiness) : INITIAL_BUSINESSES);
    setPolls(loadedPolls ? JSON.parse(loadedPolls) : INITIAL_POLLS);
    setChats(loadedChat ? JSON.parse(loadedChat) : INITIAL_CHAT);
  }, []);

  // SAVE REPOSITORIES TO STORAGE ON SECURE MUTATION
  const saveStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // 1. Notice Board actions
  const handleAddNotice = (newNotice: Omit<Notice, 'id' | 'date' | 'upvotes'>) => {
    const noticeObj: Notice = {
      ...newNotice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      upvotes: 0
    };
    const updated = [noticeObj, ...notices];
    setNotices(updated);
    saveStorage('n_notices', updated);
  };

  const handleUpvoteNotice = (id: string) => {
    const updated = notices.map(not => not.id === id ? { ...not, upvotes: not.upvotes + 1 } : not);
    setNotices(updated);
    saveStorage('n_notices', updated);
  };

  // 2. Help Requests actions
  const handleAddHelpRequest = (newRequest: Omit<HelpRequest, 'id' | 'date' | 'status'>) => {
    const reqObj: HelpRequest = {
      ...newRequest,
      id: `help-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'open'
    };
    const updated = [reqObj, ...helpRequests];
    setHelpRequests(updated);
    saveStorage('n_help', updated);
  };

  const handleResolveHelpRequest = (id: string) => {
    const updated = helpRequests.map(rec => rec.id === id ? { ...rec, status: 'resolved' as const } : rec);
    setHelpRequests(updated);
    saveStorage('n_help', updated);
  };

  // 3. Service provider additions
  const handleAddServiceProvider = (newProvider: Omit<ServiceProvider, 'id' | 'rating' | 'reviewsCount'>) => {
    const provObj: ServiceProvider = {
      ...newProvider,
      id: `ser-${Date.now()}`,
      rating: 4.8,
      reviewsCount: 1
    };
    const updated = [provObj, ...services];
    setServices(updated);
    saveStorage('n_services', updated);
  };

  // 4. Job postings and applications
  const handleAddJob = (newJob: Omit<Job, 'id'>) => {
    const jobObj: Job = {
      ...newJob,
      id: `job-${Date.now()}`
    };
    const updated = [jobObj, ...jobs];
    setJobs(updated);
    saveStorage('n_jobs', updated);
  };

  const handleApplyJob = (id: string) => {
    const updated = jobs.map(j => j.id === id ? { ...j, isApplied: true } : j);
    setJobs(updated);
    saveStorage('n_jobs', updated);
  };

  // 5. Haat Bazaar addition
  const handleAddMarketItem = (newItem: Omit<MarketItem, 'id'>) => {
    const mktObj: MarketItem = {
      ...newItem,
      id: `mkt-${Date.now()}`
    };
    const updated = [mktObj, ...marketItems];
    setMarketItems(updated);
    saveStorage('n_market', updated);
  };

  const handleDeleteMarketItem = (id: string) => {
    const updated = marketItems.filter(item => item.id !== id);
    setMarketItems(updated);
    saveStorage('n_market', updated);
  };

  // 6. Business Promotion addition
  const handleAddBusiness = (newBus: Omit<LocalBusiness, 'id' | 'rating'>) => {
    const busObj: LocalBusiness = {
      ...newBus,
      id: `bus-${Date.now()}`,
      rating: 5.0
    };
    const updated = [busObj, ...businesses];
    setBusinesses(updated);
    saveStorage('n_business', updated);
  };

  // 7. Community Decision Polls and casting votes
  const handleAddPoll = (newPoll: Omit<CommunityPoll, 'id' | 'totalVotes' | 'ended'>) => {
    const pollObj: CommunityPoll = {
      ...newPoll,
      id: `pol-${Date.now()}`,
      totalVotes: 0,
      ended: false
    };
    const updated = [pollObj, ...polls];
    setPolls(updated);
    saveStorage('n_polls', updated);
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    const updated = polls.map((p) => {
      if (p.id !== pollId) return p;
      if (p.votedOptionId) return p; // user already voted

      const updatedOptions = p.options.map((opt) => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );

      return {
        ...p,
        options: updatedOptions,
        totalVotes: p.totalVotes + 1,
        votedOptionId: optionId
      };
    });
    setPolls(updated);
    saveStorage('n_polls', updated);
  };

  // 8. Chautari Chat Messaging system & emergency broadcast
  const handleSendMessage = (text: string, isSafety: boolean = false) => {
    const messageObj: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isSafety ? 'PUBLIC SOS SIGNAL' : text.split(':')[0],
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Z',
      district: selectedDistrict || 'All Nepal',
      isSafetyAlert: isSafety
    };
    const updated = [...chats, messageObj];
    setChats(updated);
    saveStorage('n_chat', updated);
  };

  // 9. Main Action header SOS buttons
  const triggerSosConsole = () => {
    setActiveTab('chat');
  };

  // Helper translating UI indices
  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Prime Header Block */}
      <Header
        currentLang={lang}
        setLang={setLang}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        onSosTrigger={triggerSosConsole}
      />

      {/* Main Grid structure Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 flex-grow pb-24 sm:pb-6">
        
        {/* District selection status bar alert */}
        {selectedDistrict && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-950">
            <span>
              🏔️ {lang === 'en' ? 'Currently viewing filter content inside ' : 'अहिले तपाई '}
              <strong className="underline underline-offset-4 text-emerald-940 text-emerald-900 font-bold">{selectedDistrict}</strong>
              {lang === 'en' ? ' region.' : ' जिल्लाको विवरण हेर्दै हुनुहुन्छ।'}
            </span>
            <button
              onClick={() => setSelectedDistrict('')}
              className="text-emerald-700 hover:text-emerald-950 underline font-mono text-[10px]"
            >
              [Clear Filter]
            </button>
          </div>
        )}

        {/* Primary Page Navigation Tabs Grid */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-250 pb-3">
          
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            🏠 {lang === 'en' ? 'Home' : 'गृहपृष्ठ'}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            👥 {lang === 'en' ? 'Community' : 'चौतारी बहस'}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            🛠️ {lang === 'en' ? 'Services' : 'विज्ञ सेवाहरू'}
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'marketplace'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            🌽 {lang === 'en' ? 'Marketplace' : 'हाट बजार'}
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'help'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            ❤️ {lang === 'en' ? 'Help Center' : 'गुहार केन्द्र'}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-rose-900 text-white shadow animate-pulse'
                : 'bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-950 font-bold shadow-xs'
            }`}
          >
            💬 {lang === 'en' ? 'Chat' : 'गफगाफ चौतारी'}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            💼 {lang === 'en' ? 'Jobs' : 'जागिर खोज्नुहोस्'}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-emerald-900 text-stone-100 shadow'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            👤 {lang === 'en' ? 'Profile' : 'मेरो विवरण'}
          </button>

        </div>

        {/* Content Renderers container */}
        <div className="bg-stone-50/50 p-1 sm:p-4 rounded-3xl min-h-[500px]">
          
          {activeTab === 'home' && (
            <HomeSection
              currentLang={lang}
              notices={notices}
              helpRequests={helpRequests}
              services={services}
              travels={INITIAL_TRAVEL}
              polls={polls}
              selectedDistrict={selectedDistrict}
              onNavigate={(tab) => setActiveTab(tab)}
              onUpvoteNotice={handleUpvoteNotice}
              onVotePoll={handleVotePoll}
            />
          )}

          {activeTab === 'community' && (
            <CommunitySection
              currentLang={lang}
              notices={notices}
              helpRequests={helpRequests}
              onAddNotice={handleAddNotice}
              onAddHelpRequest={handleAddHelpRequest}
              onUpvoteNotice={handleUpvoteNotice}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'services' && (
            <ServicesSection
              currentLang={lang}
              providers={services}
              onAddProvider={handleAddServiceProvider}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceSection
              currentLang={lang}
              items={marketItems}
              onAddItem={handleAddMarketItem}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'help' && (
            <HelpCenterSection
              currentLang={lang}
              requests={helpRequests}
              onAddRequest={handleAddHelpRequest}
              onResolveRequest={handleResolveHelpRequest}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'chat' && (
            <ChatSection
              currentLang={lang}
              chatMessages={chats}
              onSendMessage={handleSendMessage}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'jobs' && (
            <JobsSection
              currentLang={lang}
              jobs={jobs}
              onAddJob={handleAddJob}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              currentLang={lang}
              activeMarketplaceListings={marketItems}
              registeredServices={services}
              onDeleteListing={handleDeleteMarketItem}
              selectedDistrict={selectedDistrict}
            />
          )}

        </div>

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR FOR ANDROID-FIRST FEEL */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 py-2.5 px-1 sm:hidden flex justify-around items-center shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeTab === 'home' ? 'text-emerald-900' : 'text-stone-400'}`}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeTab === 'community' ? 'text-emerald-900' : 'text-stone-400'}`}
        >
          <span className="text-base">👥</span>
          <span>Community</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeTab === 'services' ? 'text-emerald-900' : 'text-stone-400'}`}
        >
          <span className="text-base">🛠️</span>
          <span>Services</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeTab === 'marketplace' ? 'text-emerald-900' : 'text-stone-400'}`}
        >
          <span className="text-base">🌽</span>
          <span>Haat</span>
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeTab === 'help' ? 'text-emerald-900' : 'text-stone-400'}`}
        >
          <span className="text-base">❤️</span>
          <span>Guhar</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${activeTab === 'profile' ? 'text-emerald-900' : 'text-stone-400'}`}
        >
          <span className="text-base">👤</span>
          <span>Profile</span>
        </button>
      </div>

      {/* Humble Footer info */}
      <footer className="bg-stone-900 text-stone-400 py-10 mt-12 border-t border-stone-800 text-xs sm:text-sm text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-1.5 font-display font-extrabold text-stone-200">
            <span>नेपाली परिवार</span>
            <span className="text-red-500">•</span>
            <span>Nepali Family Local App</span>
          </div>
          <p className="max-w-2xl mx-auto text-stone-500 leading-relaxed text-xs">
            {lang === 'en'
              ? 'This is a grassroot community initiative build with integrity and mutual trust to connect Nepali families. Data is cached locally in your window browser.'
              : 'यो नेपाली परिवारबीच एकापसमा सद्भाव, सहयोग, र ब्यापार वृद्धिको लागि निर्माण गरिएको नि:शुल्क सामुदायिक सेवा हो। सूचनाहरू तपाईकै ब्राउजरमा सुरक्षित हुन्छन्।'}
          </p>
          <div className="text-stone-600 font-mono text-[11px] uppercase tracking-widest pt-4">
            🏔️ Nepal’s Dignity & Self-Sufficiency • 2026 🏔️
          </div>
        </div>
      </footer>

    </div>
  );
}
