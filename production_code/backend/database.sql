-- =========================================================================
-- DATABASE CONFIGURATION & SCHEMA BLUEPRINT
-- PRODUCT: Nepali Family Local App
-- DATABASE TARGET: PostgreSQL / Cloud SQL / PostgreSQL 15+
-- =========================================================================

-- Enable PostGIS extension for advanced geo-spatial lookups (Optional scale expansion)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. USERS REGISTRY & PRIVILEGE ACCOUNTS
CREATE TYPE account_status_type AS ENUM ('active', 'suspended', 'under_verification');

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    ward_number INTEGER NOT NULL CHECK (ward_number >= 1 AND ward_number <= 40),
    verification_status INTEGER DEFAULT 1 CHECK (verification_status >= 1 AND verification_status <= 4),
    reputation_score INTEGER DEFAULT 10 CHECK (reputation_score >= 0 AND reputation_score <= 100),
    account_status account_status_type DEFAULT 'active',
    device_info VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index user queries by phone and district for fast regional filters
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_district_ward ON users(district, ward_number);


-- 2. VERIFICATION LOG RECORDS
CREATE TABLE IF NOT EXISTS verification_logs (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4),
    vouch_by VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
    id_card_type VARCHAR(50), -- 'citizenship', 'license', 'voter'
    id_card_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ver_logs_uid ON verification_logs(user_id);


-- 3. AUDITABLE SECURITY SESSION RECORDS
CREATE TABLE IF NOT EXISTS security_logs (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- 'login', 'failed_attempt', 'device_added'
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 4. CHAUTARI COMMUNITIES & REGIONAL FEED TABLE
CREATE TABLE IF NOT EXISTS community_posts (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    text_content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'announcement', -- 'bulletin', 'mandi', 'announcement'
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    ward_number INTEGER NOT NULL,
    upvotes_count INTEGER DEFAULT 0 CHECK (upvotes_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_geo_hierarchy ON community_posts(province, district, municipality, ward_number);


-- 5. HELP CENTER (GUHAR LEDGER)
CREATE TYPE help_category_type AS ENUM ('blood', 'emergency_sos', 'disaster', 'missing_person', 'community_help');
CREATE TYPE urgency_type AS ENUM ('critical', 'high', 'normal');
CREATE TYPE help_status_type AS ENUM ('open', 'resolved');

CREATE TABLE IF NOT EXISTS help_requests (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category help_category_type NOT NULL,
    urgency urgency_type DEFAULT 'normal',
    status help_status_type DEFAULT 'open',
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    ward_number INTEGER NOT NULL,
    geohash VARCHAR(12),
    location_coordinates GEOMETRY(Point, 4326), -- PostGIS coordinates point mapping
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_help_status ON help_requests(status);
CREATE INDEX idx_help_geohash ON help_requests(geohash);


-- 6. SERVICE PROVIDER CARDS REGISTER
CREATE TABLE IF NOT EXISTS service_providers (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    category VARCHAR(50) NOT NULL, -- 'plumber', 'electrician', 'carpenter'
    business_name VARCHAR(100),
    contact_phone VARCHAR(20) NOT NULL,
    service_area TEXT[], -- Array of nearby districts or wards covered
    estimated_cost VARCHAR(100), -- 'NPR 500 Call out'
    overall_rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (overall_rating >= 0.0 AND overall_rating <= 5.0),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    is_verified_provider BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 7. HAAT-BAZAAR MARKETPLACE DIRECTORY
CREATE TYPE trade_type_enum AS ENUM ('sale', 'rental', 'exchange');
CREATE TYPE trade_status_enum AS ENUM ('available', 'pending', 'completed');

CREATE TABLE IF NOT EXISTS marketplace_items (
    id VARCHAR(128) PRIMARY KEY,
    seller_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price_tag VARCHAR(100) NOT NULL, -- e.g. 'NPR 1,200/Crate' or 'Barter'
    category VARCHAR(50) NOT NULL, -- 'vegetables', 'livestock', 'hand_tools'
    trade_type trade_type_enum DEFAULT 'sale',
    status trade_status_enum DEFAULT 'available',
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 8. JOB LISTINGS TABLE
CREATE TYPE job_type_enum AS ENUM ('daily', 'part-time', 'agricultural', 'freelance');

CREATE TABLE IF NOT EXISTS job_listings (
    id VARCHAR(128) PRIMARY KEY,
    employer_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    payment_rate VARCHAR(100) NOT NULL, -- e.g. 'NPR 1,500/Day'
    job_type job_type_enum DEFAULT 'agricultural',
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    skills_required TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 9. FRAUD RED-ALERTS & COMPLAINTS LEDGER
CREATE TYPE report_category_enum AS ENUM ('harassment', 'scam', 'spam', 'impersonation');
CREATE TYPE report_status_enum AS ENUM ('open', 'investigating', 'resolved');

CREATE TABLE IF NOT EXISTS fraud_reports (
    id VARCHAR(128) PRIMARY KEY,
    reporter_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    category report_category_enum NOT NULL,
    description TEXT NOT NULL,
    status report_status_enum DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 10. REAL-TIME MESSAGES REGISTRY
CREATE TABLE IF NOT EXISTS chat_rooms (
    id VARCHAR(128) PRIMARY KEY,
    room_type VARCHAR(30) DEFAULT 'personal', -- 'personal', 'group', 'ward'
    members VARCHAR(128)[] NOT NULL, -- UIDs inside room array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(128) PRIMARY KEY,
    room_id VARCHAR(128) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    message_text TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_msg_room_time ON messages(room_id, created_at DESC);
