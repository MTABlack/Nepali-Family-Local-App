# 🏔️ Nepali Family Local App (Chautari Net) - Production Deployment Guide

This dossier outlines the deployment steps, environment parameters, directories hierarchy, database optimization, and replication topologies required to launch the **Nepali Family Local App** nationwide.

---

## 1. Master Folder Directory Structure

```
nepali-family-app /
├── production_code/
│   ├── backend/
│   │   ├── server.ts       # Express + TypeScript Production Backend API Server
│   │   └── database.sql    # Clean SQL Schemas, Indices, and Geohash partitions
│   ├── mobile/
│   │   └── App.tsx         # Working Expo / React Native Client, OTP verification, local caches
│   └── admin/
│       └── AdminDashboard.tsx  # Admin Dashboard interface, kyc reviews, fraud monitors
├── src/
│   ├── components/         # Interactive Preview Sections (GuharHub, HaatBazaar, etc)
│   ├── App.tsx             # Main Chautari Application Module
│   ├── data.ts             # Initial datasets, translations, regional references
│   └── index.css           # Global styled canvas stylesheets
├── firestore.rules         # Hardened Firestore Security Rules
├── security_spec.md        # Comprehensive 12 Payloads defense parameters
├── DATABASE_DESIGN.md      # Scalability schema mappings down to Nepal Ward levels
└── FEATURE_BLUEPRINT.md   # Feature hierarchies
```

---

## 2. Environment Configuration (`.env.example`)

Declare the following environment files inside the root directory (`.env`). Do not push actual production secrets to Git version control.

```env
# SERVER FLAVORS & PORTS
NODE_ENV=production
PORT=3000

# CLOUD RELATIONAL POSTGRES DATABASE
DATABASE_URL=postgresql://postgres_admin:Secure_Gateway_777@database-cluster.gcp.local:5432/nepal_family_app?sslmode=require

# TWILIO SMS GATEWAY (OTP DISPATCH FOR NEPALESE TELEPHONES)
SMS_GATEWAY_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_secure_auth_token_secret
TWILIO_PHONE_NUMBER=+1980XXXXXXX

# SPARROW SMS LOCALE OPTION (Sajha Sparrow Provider)
SPARROW_SMS_API_KEY=your_sparrow_auth_key
SPARROW_SMS_SENDER_IDENTITY=ChautariApp

# GEOLOCATIVE MAPS platform GUIDELINES
GOOGLE_MAPS_API_KEY=AIzaSyA_your_safe_public_maps_key
```

---

## 3. Production Deployment Instructions

### 3.1 Backend Server Installation
To deploy the backend to serverless containers (like GCP Cloud Run):

1. **Build Container Image**:
   Create a basic production `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3000
   CMD ["node", "dist/backend/server.js"]
   ```
2. **Execute Schema Migrations**:
   Using PostgreSQL databases, execute the ANSI SQL migrations registry to populate tables and index coordinates:
   ```bash
   psql -h database-cluster.gcp.local -U postgres_admin -d nepal_family_app -f production_code/backend/database.sql
   ```
3. **Container Delivery**:
   ```bash
   gcloud builds submit --tag gcr.io/nepali-family-app/gateway-api:v1
   gcloud run deploy gateway-api --image gcr.io/nepali-family-app/gateway-api:v1 --platform managed --port 3000 --allow-unauthenticated
   ```

### 3.2 Mobile Client Deployment
To compile optimized Expo APK builds for Android devices under 50MB size limits:

1. **Build Configuration (`app.json`)**:
   Configure Proguard and resource shrinking inside configuration:
   ```json
   {
     "expo": {
       "name": "Nepali Family Local App",
       "slug": "nepali-family-app",
       "version": "1.0.0",
       "android": {
         "package": "com.nepalifamily.localapp",
         "adaptiveIcon": {
           "backgroundColor": "#1E3A8A"
         }
       }
     }
   }
   ```
2. **Execute EAS Build Pipeline**:
   ```bash
   eas build --platform android --profile production
   ```

---

## 4. Scalability Architecture Roadmap

1. **Horizontal Scaling and Multi-Region Read Replicas**:
   - High traffic paths (Chat room logs, bulletin updates) route queries to geographical read-replica nodes near the 7 provinces, offloading stress from master write databases.
2. **Microservices Migration**:
   - As transactional volumes trigger 10 million bounds, separate the `Guhar SOS Hub` dispatch system into a highly partitioned service with dedicated resources, guaranteeing zero network latency during community rescues.
3. **Database Sharding**:
   - Users are naturally partitioned by their registration addresses, allowing seamless horizontal DB sharding across districts (e.g. Koshi database clusters, Gandaki database cluster).
