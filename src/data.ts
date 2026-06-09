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

// Translation strings mapping for bilingual UI support
export const TRANSLATIONS: Record<string, { en: string; np: string }> = {
  appName: { en: 'Nepali Family', np: 'नेपाली परिवार' },
  tagline: { en: 'Ek Nepal, Ek Family', np: 'एक नेपाल, एक परिवार' },
  allDistricts: { en: 'All Districts', np: 'सबै जिल्लाहरू' },
  districtLabel: { en: 'District:', np: 'जिल्ला चयन:' },
  activeLanguage: { en: 'English', np: 'नेपाली' },
  toggleLanguage: { en: 'नेपाली / English', np: 'English / नेपाली' },
  
  // Navigation Tabs
  tabNotices: { en: 'Notices', np: 'सूचना पाटी' },
  tabHelp: { en: 'Guhar (Help)', np: 'गुहार (सहयोग)' },
  tabServices: { en: 'Services', np: 'स्थानीय सेवाहरू' },
  tabJobs: { en: 'Opportunity', np: 'रोजगार र अवसर' },
  tabMarket: { en: 'Haat Bazaar', np: 'हाट बजार' },
  tabEmergency: { en: 'Sankat (SOS)', np: 'संकट र आपतकालीन' },
  tabEdu: { en: 'Skill-Share', np: 'सीप र शिक्षा' },
  tabTravel: { en: 'Ghumphir', np: 'पर्यटन र घुमफिर' },
  tabAgri: { en: 'Krishi Mandi', np: 'कृषि र मन्डी' },
  tabBusiness: { en: 'Local Shops', np: 'सझा पसलहरू' },
  tabPolls: { en: 'Sajha Chautari', np: 'सामुदायिक निर्णय' },
  tabChat: { en: 'Chautari Chat', np: 'चौतारी गफगाफ' },

  // Notice Strings
  announcement: { en: 'Announcement', np: 'घोषणा' },
  event: { en: 'Event', np: 'कार्यक्रम' },
  notice: { en: 'Notice', np: 'सूचना' },
  upvote: { en: 'Upvote', np: 'समर्थन गर्नुहोस्' },
  postedBy: { en: 'Posted by', np: 'लेखक' },
  addNotice: { en: 'Post Notice / Event', np: 'सूचना वा कार्यक्रम थप्नुहोस्' },

  // Help Strings
  blood: { en: 'Blood Needed', np: 'रक्तदान आवश्यक' },
  volunteering: { en: 'Volunteering', np: 'स्वयंसेवा' },
  monetary: { en: 'Emergency Fund', np: 'आर्थिक सहयोग' },
  disaster: { en: 'Disaster Support', np: 'प्रकोप सामना' },
  other: { en: 'Other Help', np: 'अन्य सहयोग' },
  urgencyCritical: { en: 'Emergency 🚨', np: 'अत्यन्त जरुरी 🚨' },
  urgencyHigh: { en: 'Urgent', np: 'आवश्यक' },
  urgencyNormal: { en: 'Normal', np: 'सामान्य' },
  contactUs: { en: 'Contact Handler', np: 'सम्पर्क व्यक्ति' },
  resolveHelp: { en: 'Mark Resolved', np: 'समाधान भयो' },
  resolved: { en: 'Resolved', np: 'समाधान गरिएको' },
  askHelp: { en: 'Ask for Guhar (Help)', np: 'गुहार माग्नुहोस्' },

  // Service Strings
  plumbing: { en: 'Plumber', np: 'प्लम्बर' },
  electrical: { en: 'Electrician', np: 'इलेक्ट्रिसियन' },
  teaching: { en: 'Tutor / Teacher', np: 'शिक्षक / ट्युसन' },
  health: { en: 'Health Helper', np: 'स्वास्थ्य सेवक' },
  guide: { en: 'Local Guide', np: 'स्थानीय गाइड' },
  serviceProvider: { en: 'Service Provider', np: 'सेवा प्रदायक' },
  addProvider: { en: 'Join as Provider', np: 'सेवा थप्नुहोस्' },

  // Market Strings
  farm: { en: 'Farm Produce', np: 'कृषि उपज' },
  livestock: { en: 'Livestock', np: 'पशुपालन' },
  tools: { en: 'Tools & Gears', np: 'औजार र उपकरण' },
  household: { en: 'Household', np: 'घरायसी सामग्री' },
  books: { en: 'Education Books', np: 'किताबहरू' },
  price: { en: 'Price', np: 'मूल्य' },
  organic: { en: 'Organic / Farm Fresh', np: 'अर्गानिक / ताजा' },
  used: { en: 'Used / Secondhand', np: 'प्रयोग गरिएको' },
  new: { en: 'Brand New', np: 'नयाँ' },
  sellNewItem: { en: 'Sell Item in Haat Bazaar', np: 'हाट बजारमा सामान बेच्नुहोस्' },

  // Jobs
  daily: { en: 'Daily Wage Work', np: 'ज्यालादारी काम' },
  partTime: { en: 'Part-time', np: 'आंशिक समय' },
  agricultural: { en: 'Agri Labor', np: 'कृषि श्रमिक' },
  freelance: { en: 'Freelance / Gig', np: 'फ्रिल्यान्स / गिग' },
  fullTime: { en: 'Regular / Full-time', np: 'पूर्ण समय' },
  applyJob: { en: 'Apply/Call', np: 'सम्पर्क गर्ने' },
  applied: { en: 'Applied ✅', np: 'आवेदन गरियो ✅' },
  postJob: { en: 'Post Job Listing', np: 'रोजगारीको विज्ञापन दर्ता गर्नुहोस्' },

  // Emergency
  sosButton: { en: 'ACTIVATE NEPAL SOS ALERT', np: 'तात्कालिक आपतकालीन सूचना सक्रिय गर्नुहोस्' },
  police: { en: 'Nepal Police', np: 'नेपाल प्रहरी' },
  hospital: { en: 'Hospital', np: 'अस्पताल' },
  ambulance: { en: 'Ambulance service', np: 'एम्बुलेन्स सेवा' },
  bloodbank: { en: 'Blood Bank Service', np: 'रक्त सञ्चार केन्द्र' },
  redcross: { en: 'Red Cross Nepal', np: 'रेड क्रस नेपाल' },

  // Agri Mandi
  mandiTitle: { en: 'Vegetable & Fruit Mandi Rates (Kalimati Market)', np: 'कालिमाटी फलफूल तथा तरकारी बजारको मूल्य विवरण' },
  commodity: { en: 'Product', np: 'सामाग्री' },
  unit: { en: 'Unit', np: 'इकाई' },
  range: { en: 'Price Range', np: 'प्रति केजी बजार मूल्य' },
  swappedDisclaimer: { en: 'Mandi pricing is updated locally to support farmers in selling direct.', np: 'किसान र उपभोक्ताबीच सिधा व्यापार प्रवर्द्धनका लागि दैनिक भाउ।' },

  // Travel
  bestSeason: { en: 'Best Season:', np: 'घुम्ने उत्तम समय:' },
  localGems: { en: 'Hidden Local Gems', np: 'स्थानीय घुमफिर तथा गाइड' },

  // Community Polls
  activePolls: { en: 'Active Community Decisions', np: 'निर्णयको लागि मतदान' },
  castVote: { en: 'Cast Your Vote', np: 'मतदान गर्नुहोस' },
  createPoll: { en: 'Launch New Poll', np: 'सामुदायिक निर्णय/मतदान सुरु गर्नुहोस्' },
  totalVoted: { en: 'Total votes cast:', np: 'जम्मा खसेको मत:' },

  // Shared Strings
  submit: { en: 'Submit / Post', np: 'दर्ता गर्नुहोस्' },
  cancel: { en: 'Cancel', np: 'रद्द गर्नुहोस्' },
  phone: { en: 'Phone:', np: 'फोन नम्बर:' },
  name: { en: 'Name:', np: 'नाम:' },
  title: { en: 'Title:', np: 'शीर्षक:' },
  desc: { en: 'Description:', np: 'विवरण:' },
  selectDistrict: { en: 'Select District', np: 'जिल्ला रोज्नुहोस्' },
  category: { en: 'Category:', np: 'विधा चयन:' },
  searchPlaceholder: { en: 'Search listings...', np: 'खोज्नुहोस्...' },
  welcome: { en: 'Welcome to Nepali Family Platform', np: 'नेपाली परिवार डिजिटल चौतारीमा स्वागत छ' },
  empowering: { en: 'Empathy, Mutual Aid, and Local Integrity', np: 'बिपदमा गुहार, बजारमा मूल्य, चौतारीमा मेलमिलाप र नेपाली ऐक्यवद्धता।' },
  urgency: { en: 'Urgency Level', np: 'प्राथमिकता' },
  aboutPlatform: { en: 'This community initiative helps people share local services directly, bypassing middlemen to keep markets fair and connections tight.', np: 'यो साझा मञ्चले नेपाली समाजमा आपसी भाइचारा कायम गर्न, बिचौलिया बिना सिधा ब्यापार गर्न र दुखमा तुरुन्त सहयोग जुटाउन मद्दत गर्दछ।' }
};

export const DISTRICTS = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Kaski (Pokhara)',
  'Chitwan',
  'Jhapa',
  'Rupandehi',
  'Mustang',
  'Solukhumbu (Everest)',
  'Morang',
  'Banke',
  'Surkhet',
  'Dharan (Sunsari)'
];

// INITIAL DATASETS
export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Clean Bagmati River Campaign - 510th Week',
    description: 'Join us this Saturday morning at 7:00 AM at Thapathali bridge area. Bring your boots and gloves. Tea and snacks will be provided by local businesses.',
    category: 'event',
    date: '2026-06-13',
    author: 'Bagmati Cleanliness Group',
    upvotes: 42,
    district: 'Kathmandu'
  },
  {
    id: 'not-2',
    title: 'Vaccination Drive for Lumpy Skin in Cattle',
    description: 'The Agriculture Unit is hosting a free vaccination drive for cows and buffaloes next Tuesday in Gitanagar. Register your farm before Monday.',
    category: 'notice',
    date: '2026-06-15',
    author: 'Chitwan Agri Association',
    upvotes: 29,
    district: 'Chitwan'
  },
  {
    id: 'not-3',
    title: 'Local Path Expansion Discussion near Fewa Lake',
    description: 'Ward 6 is hosting a community meeting to decide on high priority storm drainage and lane widening. Let us build local infrastructure ourselves.',
    category: 'announcement',
    date: '2026-06-10',
    author: 'Ward 6 Secretary',
    upvotes: 56,
    district: 'Kaski (Pokhara)'
  }
];

export const INITIAL_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'help-1',
    title: 'Urgent: B+ Blood Needed for Child in Pokhara',
    description: 'A 6-year-old child admitted to Gandaki Medical College is undergoing emergency surgery. We need 2 pints of B Positive blood immediately. Please contact the father directly.',
    category: 'blood',
    urgency: 'critical',
    contactName: 'Ramesh Adhikari',
    contactPhone: '9846051122',
    status: 'open',
    date: '2026-06-08',
    district: 'Kaski (Pokhara)',
    lookingFor: '2 Volunteers'
  },
  {
    id: 'help-2',
    title: 'Help Needed: Rebuilding Roof After Landslide Spill',
    description: 'Yesterday evening heavy rain triggered a localized dirt flow over Baishari village. The roof of Gurung Uncle\'s shed collapsed. We need 5 local volunteers with shovels on Saturday to help clear the mud and lay basic tin sheets.',
    category: 'disaster',
    urgency: 'high',
    contactName: 'Niranjan Gurung',
    contactPhone: '9856012499',
    status: 'open',
    date: '2026-06-07',
    district: 'Kaski (Pokhara)',
    lookingFor: '5 Helpers with basic tools'
  },
  {
    id: 'help-3',
    title: 'Books & School Bags Donation for Rural Primary Kids',
    description: 'We are collecting gently used high-school and primary textbooks, copies, and pencils for Sri Janakalyan School in Jiri. If you have extra children books at home, drop them off at Milan Chowk.',
    category: 'volunteering',
    urgency: 'normal',
    contactName: 'Saraswati Acharya',
    contactPhone: '9841223344',
    status: 'resolved',
    date: '2026-06-02',
    district: 'Kathmandu',
    lookingFor: 'Books & Bags'
  }
];

export const INITIAL_SERVICES: ServiceProvider[] = [
  {
    id: 'ser-1',
    name: 'Hari Bahadur Shrestha',
    category: 'plumbing',
    phone: '9841334455',
    district: 'Kathmandu',
    cost: 'NPR 350 onwards',
    description: 'Experienced in pipeline leaks, tap installations, sewer line unblocks, and water pump repair. Available 24/7 in Patan & Baneshwor.',
    rating: 4.8,
    reviewsCount: 34
  },
  {
    id: 'ser-2',
    name: 'Sushma Thapa',
    category: 'teaching',
    phone: '9851098765',
    district: 'Lalitpur',
    cost: 'NPR 1,200/month',
    description: 'Secondary school math and science tutor with 6 years experience. Provides group classes and single individual attention.',
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: 'ser-3',
    name: 'Prem Chaudhary',
    category: 'electrical',
    phone: '9813554433',
    district: 'Chitwan',
    cost: 'NPR 400 fixed base',
    description: 'Inverter maintenance, solar system panel installations, house wiring wiring repair, and water heater element fix. Reliable and fast.',
    rating: 4.6,
    reviewsCount: 22
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Harvest Helper needed for Paddy fields',
    payment: 'NPR 800 / day + Lunch',
    type: 'agricultural',
    description: 'Looking for 4 agricultural laborers to harvest monsoon rice in Shivaganj. Work starts at 8 AM. Direct payment in evening.',
    contactName: 'Bhim Prasain',
    contactPhone: '9801234567',
    district: 'Jhapa'
  },
  {
    id: 'job-2',
    title: 'Wall Painting & Plaster Finishing Job (House)',
    payment: 'NPR 1,500 / day',
    type: 'daily',
    description: 'Need skilled house painters for 3 days of work in Lakeside. Must have experience with external emulsion paint coats.',
    contactName: 'Roshan Baral',
    contactPhone: '9846011223',
    district: 'Kaski (Pokhara)'
  },
  {
    id: 'job-3',
    title: 'Womens Tailoring & Blouse Design Assistant',
    payment: 'NPR 12,000 / month',
    type: 'part-time',
    description: 'Looking for a part-time seamstress assistant at our shop in Baneshwor. Knowledge of embroidery is a major plus point.',
    contactName: 'Geeta Shrestha',
    contactPhone: '9818345112',
    district: 'Kathmandu'
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'mkt-1',
    title: 'Local Hill Goat (Bokhra)',
    price: 'NPR 14,000',
    category: 'livestock',
    description: 'Healthy, grass-fed local goat direct from rural hills. Weighs around 18-20 kg. Great for family festivals or breeding purposes.',
    sellerName: 'Kanchha Tamang',
    sellerPhone: '9813567111',
    condition: 'organic',
    district: 'Dharan (Sunsari)'
  },
  {
    id: 'mkt-2',
    title: 'Organic Mustang Marpha Apple Cordial',
    price: 'NPR 650 (750ml glass bottle)',
    category: 'farm',
    description: 'Pure hill apple cordial juice direct from Marpha. Absolutely no synthetic additives. Perfect local farm syrup.',
    sellerName: 'Pema Norbu',
    sellerPhone: '9846098311',
    condition: 'organic',
    district: 'Mustang'
  },
  {
    id: 'mkt-3',
    title: 'Used Hand Rotavator / Tiller Machine',
    price: 'NPR 18,500',
    category: 'tools',
    description: 'Small 7HP agricultural hand tiller. Runs on petrol. Used for 2 seasons in vegetable garden fields. Starts in first pull.',
    sellerName: 'Ram Avatar Sah',
    sellerPhone: '9855011223',
    condition: 'used',
    district: 'Chitwan'
  }
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'District Police Office - Pokhara',
    phone: '100 / 061-520100',
    category: 'police',
    district: 'Kaski (Pokhara)',
    address: 'Gairapatan, Pokhara'
  },
  {
    id: 'em-2',
    name: 'Nepal Blood Bank Service Association',
    phone: '01-4212344 / 9841443311',
    category: 'bloodbank',
    district: 'Kathmandu',
    address: 'Exhibition Road, Kathmandu'
  },
  {
    id: 'em-3',
    name: 'Red Cross Sub-Branch Ambulance',
    phone: '056-520120',
    category: 'ambulance',
    district: 'Chitwan',
    address: 'Bharatpur Metro'
  },
  {
    id: 'em-4',
    name: 'Himalayan Rescue Association (Sankat Rescuer)',
    phone: '01-4440277',
    category: 'redcross',
    district: 'Solukhumbu (Everest)',
    address: 'Namche Bazaar Base'
  }
];

export const INITIAL_SKILLS: SkillSharingSession[] = [
  {
    id: 'sk-1',
    title: 'Traditional Bamboo Basket (Doko/Choya) Weaving',
    teacher: 'Som Tharu',
    duration: '2 Days (4 Hours each)',
    fee: 'NPR 200 (For Materials)',
    type: 'Weaving & Craft',
    description: 'Learn the ancient heritage craft of weaving document/carrying dokos from raw green bamboo strips. All raw items provided.',
    timing: 'Saturday & Sunday 1 PM',
    district: 'Chitwan'
  },
  {
    id: 'sk-2',
    title: 'Smartphone Literacy, QR codes & Mobile Banking for Elderly',
    teacher: 'Anuj Chhetri',
    duration: '3 hours session',
    fee: 'Free of Cost',
    type: 'Digital Skills',
    description: 'Helping grandpas and grandmas safely set up eSewa, send secure SMS blocks, use Fonepay QR scan triggers, and avoid mobile traps.',
    timing: 'Friday 2:00 PM',
    district: 'Kathmandu'
  }
];

export const INITIAL_TRAVEL: TravelDestination[] = [
  {
    id: 'tr-1',
    place: 'Kagbeni Village Trek',
    district: 'Mustang',
    description: 'Gateway to upper Mustang. Features breathtaking medieval stone homes, high Apple dry houses, historic clay monasteries, and dry wind tunnels.',
    bestTime: 'September to November, March to May',
    activities: ['Lodge Homestay', 'Fossil Hunting', 'Monastery tour'],
    homestayContact: 'Urgen Phuntsok: 9846059124'
  },
  {
    id: 'tr-2',
    place: 'Sauraha Jungle Walk & Tharu Culture Exchange',
    district: 'Chitwan',
    description: 'Experience pure nature with deep forest buffer walks, elephant health camps, canoe rides on Rapti river, and evening Tharu tribal stick dance meals.',
    bestTime: 'October to February',
    activities: ['Jungle Safari', 'Cultural Show', 'Local Fish Dining'],
    homestayContact: 'Tharu Community Homestay: 9855023441'
  }
];

export const INITIAL_MANDI_PRICES: MandiPrice[] = [
  { id: 'md-1', commodity: 'Tomato Local (गोलभेडा)', commodityNp: 'गोलभेडा (स्थानीय)', unit: '1 KG', minPrice: 45, maxPrice: 60, change: 5 },
  { id: 'md-2', commodity: 'Potato Red (रातो आलु)', commodityNp: 'रातो आलु', unit: '1 KG', minPrice: 38, maxPrice: 44, change: -2 },
  { id: 'md-3', commodity: 'Cauliflower Local (काउली)', commodityNp: 'स्थानीय काउली', unit: '1 KG', minPrice: 70, maxPrice: 90, change: 12 },
  { id: 'md-4', commodity: 'Ginger (अदुवा)', commodityNp: 'अदुवा', unit: '1 KG', minPrice: 120, maxPrice: 150, change: 0 },
  { id: 'md-5', commodity: 'Large Cardamom (अलैंची)', commodityNp: 'अलैंची (सुकेको)', unit: '1 KG', minPrice: 950, maxPrice: 1100, change: 35 },
  { id: 'md-6', commodity: 'Red Chilli (रातो खुर्सानी)', commodityNp: 'रातो सुकेको खुर्सानी', unit: '1 KG', minPrice: 280, maxPrice: 320, change: -10 }
];

export const INITIAL_BUSINESSES: LocalBusiness[] = [
  {
    id: 'bus-1',
    name: 'Bhattarai Chiya corner & Chatpate',
    ownerName: 'Ram Chandra Bhattarai',
    type: 'Chiha & Snacks',
    description: 'Authentic local cardamom hot milk tea, fried mathri, and fresh spicy chatpate. Meet-up point for central Baneshwor neighborhood discussions.',
    phone: '9841890212',
    location: 'Baneshwor Chowk, near Ward Office',
    district: 'Kathmandu',
    rating: 4.7
  },
  {
    id: 'bus-2',
    name: 'Gurung Weaving & Dhaka Topi',
    ownerName: 'Mina Gurung',
    type: 'Handicrafts & Tailors',
    description: 'Genuine handmade Palpali and Purpeli Dhaka Topis, shawls, and ladies bags. Promoting native cottage weaving directly.',
    phone: '9846023190',
    location: 'Ananda Chowk, Lakeside',
    district: 'Kaski (Pokhara)',
    rating: 4.9
  }
];

export const INITIAL_POLLS: CommunityPoll[] = [
  {
    id: 'pol-1',
    question: 'Should we run a community fund to buy a grass/chaff cutter machine representing our local cooperative?',
    options: [
      { id: 'a', text: 'Yes, each family puts NPR 1,000 and we buy a shared cutter.', votes: 24 },
      { id: 'b', text: 'No, let us continue manual cutting or hire privately.', votes: 6 },
      { id: 'c', text: 'Need more detailed costing on maintenance and electricity first.', votes: 11 }
    ],
    totalVotes: 41,
    district: 'Chitwan',
    ended: false
  },
  {
    id: 'pol-2',
    question: 'Proposal to plant wild cardamom and bamboo trees in the landslide-prone slope below Ward 4.',
    options: [
      { id: 'x', text: 'Yes, plant on next Saturday volunteer drive', votes: 48 },
      { id: 'y', text: 'No, we need stone retainers from government first', votes: 14 }
    ],
    totalVotes: 62,
    district: 'Kaski (Pokhara)',
    ended: false
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'Kailash Karki',
    text: 'Namaste everyone! Does anyone know if the road to Dhulikhel is clear of monsoon lane muds? Planning a dry goods delivery.',
    timestamp: '22:04 Z',
    district: 'Kathmandu'
  },
  {
    id: 'msg-2',
    sender: 'Sanjay Lama',
    text: 'Sajha update: The roads are completely open! Highway dry-goods trucks passed smoothly half an hour ago.',
    timestamp: '22:06 Z',
    district: 'Kathmandu'
  },
  {
    id: 'msg-3',
    sender: 'SYSTEM SAFETY BANNER',
    text: '⚠️ Local rain forecast is high in Kaski. Emergency SOS teams are on stand-by near Ward offices.',
    timestamp: '22:09 Z',
    district: 'Kaski (Pokhara)',
    isSafetyAlert: true
  }
];
