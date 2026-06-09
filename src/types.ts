export interface Notice {
  id: string;
  title: string;
  titleRef?: string; // translation link
  description: string;
  descriptionRef?: string;
  category: 'notice' | 'event' | 'announcement';
  date: string;
  author: string;
  upvotes: number;
  district: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: 'blood' | 'volunteering' | 'monetary' | 'disaster' | 'other';
  urgency: 'critical' | 'high' | 'normal';
  contactName: string;
  contactPhone: string;
  status: 'open' | 'resolved';
  date: string;
  district: string;
  lookingFor: string; // items/volunteers details
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: 'plumbing' | 'electrical' | 'teaching' | 'health' | 'guide' | 'other';
  phone: string;
  district: string;
  cost: string;
  description: string;
  rating: number;
  reviewsCount: number;
}

export interface Job {
  id: string;
  title: string;
  payment: string;
  type: 'daily' | 'part-time' | 'agricultural' | 'freelance' | 'full-time';
  description: string;
  contactName: string;
  contactPhone: string;
  district: string;
  isApplied?: boolean;
}

export interface MarketItem {
  id: string;
  title: string;
  price: string;
  category: 'farm' | 'livestock' | 'tools' | 'household' | 'books';
  description: string;
  imagePrompt?: string; // description for visuals
  sellerName: string;
  sellerPhone: string;
  condition: 'new' | 'used' | 'organic'; // e.g. for farm foods, 'organic'
  district: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: 'ambulance' | 'police' | 'bloodbank' | 'hospital' | 'redcross';
  district: string;
  address: string;
}

export interface SkillSharingSession {
  id: string;
  title: string;
  teacher: string;
  duration: string;
  fee: string; // free / token sum
  type: string; // e.g. "Weaving", "Digital", "Tuition"
  description: string;
  timing: string;
  district: string;
}

export interface TravelDestination {
  id: string;
  place: string;
  district: string;
  description: string;
  bestTime: string;
  activities: string[];
  homestayContact?: string;
}

export interface MandiPrice {
  id: string;
  commodity: string;
  commodityNp: string;
  unit: string;
  minPrice: number; // in NPR
  maxPrice: number; // in NPR
  change: number; // negative index indicates decline, positive implies increase
}

export interface LocalBusiness {
  id: string;
  name: string;
  ownerName: string;
  type: string; // e.g., "Chiha Pasal", "Tailoring", "Eatery"
  description: string;
  phone: string;
  location: string;
  district: string;
  rating: number;
  imagePrompt?: string;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  votedOptionId?: string; // Tracks current user voting action
  district: string;
  ended: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  district: string;
  isSafetyAlert?: boolean;
}
