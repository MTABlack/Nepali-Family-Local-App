import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// IN-MEMORY COMPATIBLE STUB DATABASE (FOR COMPILATION / MIGRATION)
// ==========================================
interface User {
  id: string;
  phone: string;
  fullName: string;
  username: string;
  province: string;
  district: string;
  municipality: string;
  wardNumber: number;
  verificationStatus: number;
  reputationScore: number;
  createdAt: string;
}

const usersDb: Record<string, User> = {};
const sessionTokens: Record<string, string> = {}; // token -> userId

// Simple Mock Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid credentials' });
  }
  const token = authHeader.substring(7);
  const userId = sessionTokens[token];
  if (!userId || !usersDb[userId]) {
    return res.status(401).json({ error: 'Unauthorized: Session key has expired or is invalid' });
  }
  (req as any).userId = userId;
  (req as any).user = usersDb[userId];
  next();
}

// Helper to construct geographic partition key: province_district_municipality_wardNumber
function getGeoTag(user: User): string {
  return `${user.province}_${user.district}_${user.municipality}_${user.wardNumber}`.replace(/\s+/g, '-');
}

// ==========================================
// MODULE 1: AUTHENTICATION APIs
// ==========================================

const otpStore: Record<string, string> = {}; // phone -> 6-digit-OTP

app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { phone, fullName, username, province, district, municipality, wardNumber } = req.body;
  if (!phone || !fullName || !username || !province || !district || !municipality || !wardNumber) {
    return res.status(400).json({ error: 'All fields are strictly required for registration' });
  }

  // Regex validation check for Nepali mobile phones (Ncell: 980/981/982, NTC: 984/985/986/974, Smart: 961/962, landline: 01)
  const phoneRegex = /^(98|97|96)\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid Nepalese mobile phone number format.' });
  }

  const userId = `usr_${Date.now()}`;
  const newUser: User = {
    id: userId,
    phone,
    fullName,
    username,
    province,
    district,
    municipality,
    wardNumber: Number(wardNumber),
    verificationStatus: 1, // Default Level 1: Phone Verified
    reputationScore: 10,  // Standard default community points
    createdAt: new Date().toISOString()
  };

  usersDb[userId] = newUser;
  const token = `tok_${Math.random().toString(36).substr(2)}`;
  sessionTokens[token] = userId;

  res.status(201).json({
    message: 'User registered successfully. Level 1 Verified unlocked.',
    token,
    user: newUser
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Mobile phone number is strictly required' });
  }

  // Simulate OTP Generation
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otpCode;

  // In production, configure Twilio or Sparrow SMS API to send otpCode to "phone"
  console.log(`[SMS-MOCK] Sent OTP: ${otpCode} to dynamic phone number: ${phone}`);

  res.status(200).json({
    message: 'Verification SMS successfully dispatched.',
    otpSent: true // In development mode
  });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required fields' });
  }

  const storedOtp = otpStore[phone];
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP credentials provided' });
  }

  // Search existing user
  let user = Object.values(usersDb).find(u => u.phone === phone);
  if (!user) {
    return res.status(200).json({
      message: 'OTP verified. Profile registration is required to continue.',
      isNewUser: true,
      phone
    });
  }

  const token = `tok_${Math.random().toString(36).substr(2)}`;
  sessionTokens[token] = user.id;

  res.status(200).json({
    message: 'Authentication validated successfully.',
    isNewUser: false,
    token,
    user
  });
});

app.get('/api/auth/profile', requireAuth, (req: Request, res: Response) => {
  res.status(200).json((req as any).user);
});

// ==========================================
// MODULE 2: COMMUNITIES BOARDS FEEDS APIs
// ==========================================
interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  title: string;
  text: string;
  geoTag: string;
  category: string;
  createdAt: string;
}
const postsDb: CommunityPost[] = [];

app.post('/api/community/post', requireAuth, (req: Request, res: Response) => {
  const { title, text, category } = req.body;
  const currentUser = (req as any).user as User;

  if (!title || !text) {
    return res.status(400).json({ error: 'Title and content text are required' });
  }

  const newPost: CommunityPost = {
    id: `post_${Date.now()}`,
    userId: currentUser.id,
    username: currentUser.username,
    title,
    text,
    geoTag: getGeoTag(currentUser),
    category: category || 'announcement',
    createdAt: new Date().toISOString()
  };

  postsDb.push(newPost);
  res.status(201).json({ message: 'Community announcement posted successfully.', post: newPost });
});

app.get('/api/community/feed', requireAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const userGeoTag = getGeoTag(currentUser);

  // Filters postings relevant to current user is region (Province, District, or Ward)
  const filteredFeed = postsDb.filter(post => {
    // Exact or partial geo-matching for hierarchical bubbles
    return post.geoTag.startsWith(userGeoTag.split('-')[0]); // Province bubble
  });

  res.status(200).json(filteredFeed);
});

// ==========================================
// MODULE 3: HELP CENTER APIs (GUHAR CENTRAL)
// ==========================================
interface HelpRequest {
  id: string;
  userId: string;
  contactName: string;
  contactPhone: string;
  title: string;
  description: string;
  category: 'blood' | 'emergency_sos' | 'disaster' | 'volunteer';
  urgency: 'critical' | 'high' | 'normal';
  status: 'open' | 'resolved';
  geoTag: string;
  createdAt: string;
}
const helpRequestsDb: HelpRequest[] = [];

app.post('/api/help/request', requireAuth, (req: Request, res: Response) => {
  const { title, description, category, urgency } = req.body;
  const currentUser = (req as any).user as User;

  if (!title || !description || !category || !urgency) {
    return res.status(400).json({ error: 'Missing mandatory request criteria' });
  }

  const newHelp: HelpRequest = {
    id: `hlp_${Date.now()}`,
    userId: currentUser.id,
    contactName: currentUser.fullName,
    contactPhone: currentUser.phone,
    title,
    description,
    category,
    urgency,
    status: 'open',
    geoTag: getGeoTag(currentUser),
    createdAt: new Date().toISOString()
  };

  helpRequestsDb.push(newHelp);
  res.status(201).json({ message: 'Guhar dispatch created successfully.', request: newHelp });
});

app.get('/api/help/list', requireAuth, (req: Request, res: Response) => {
  res.status(200).json(helpRequestsDb);
});

// ==========================================
// MODULE 4: HAAT-BAZAAR MARKETPLACE APIs
// ==========================================
interface MarketItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  title: string;
  description: string;
  price: string;
  category: string;
  type: 'sale' | 'rental' | 'exchange';
  geoTag: string;
}
const marketItemsDb: MarketItem[] = [];

app.post('/api/item/create', requireAuth, (req: Request, res: Response) => {
  const { title, description, price, category, type } = req.body;
  const currentUser = (req as any).user as User;

  if (!title || !description || !price || !category || !type) {
    return res.status(400).json({ error: 'Missing marketplace parameters' });
  }

  const newItem: MarketItem = {
    id: `mkt_${Date.now()}`,
    sellerId: currentUser.id,
    sellerName: currentUser.fullName,
    sellerPhone: currentUser.phone,
    title,
    description,
    price,
    category,
    type,
    geoTag: getGeoTag(currentUser)
  };

  marketItemsDb.push(newItem);
  res.status(201).json({ message: 'Market listing posted on Haat Bazaar.', item: newItem });
});

app.get('/api/items', requireAuth, (req: Request, res: Response) => {
  res.status(200).json(marketItemsDb);
});

// ==========================================
// MODULE 5: COOPERATIVE CHAT MESSAGES STORAGE
// ==========================================
interface MessagePayload {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}
const chatStoreDb: Record<string, MessagePayload[]> = {};

app.post('/api/chat/send', requireAuth, (req: Request, res: Response) => {
  const { chatRoomId, text } = req.body;
  const currentUser = (req as any).user as User;

  if (!chatRoomId || !text) {
    return res.status(400).json({ error: 'Room credentials and messages are required' });
  }

  const newMessage: MessagePayload = {
    id: `msg_${Date.now()}`,
    chatRoomId,
    senderId: currentUser.id,
    senderName: currentUser.fullName,
    text,
    timestamp: new Date().toISOString()
  };

  if (!chatStoreDb[chatRoomId]) {
    chatStoreDb[chatRoomId] = [];
  }
  chatStoreDb[chatRoomId].push(newMessage);

  res.status(201).json({ status: 'delivered', message: newMessage });
});

app.get('/api/chat/history', requireAuth, (req: Request, res: Response) => {
  const { roomId } = req.query;
  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ error: 'Room ID selection is invalid' });
  }
  res.status(200).json(chatStoreDb[roomId] || []);
});

// ==========================================
// HEALTH MONITOR & SYSTEM INIT STATUS
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'operational',
    service: 'Nepali Family NoSQL API Endpoint Manager',
    time: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Express server initialized on: http://0.0.0.0:${PORT}`);
});
