# Nepali Family Local App: Master Feature Blueprint (Phase 4)

This blueprint details the complete, production-ready feature ecosystem, administrative architecture, and scalability models designed for the **Nepali Family Local App**—Nepal's premier community-driven local network.

---

## 1. Feature Hierarchy & System Topology

The platform's features are designed with a **nested geographic boundary model**, which aligns access privileges, content sharing, and routing targets:

```
[Local Neighborhood / Tole] ────> [Ward Community] ────> [Municipality] ────> [District] ────> [Province]
```

### Modular Interaction Topology
```
                     ┌──────────────────────────────────────────┐
                     │          State/User Registry             │
                     │  - Citizen accounts, verification, PII    │
                     └────────────────────┬─────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │  Functional Pipelines  │                      │  Social & Decisioning  │
     │  - Services, Haat      │                      │  - Ward Chat, Forums   │
     │  - Jobs, Agriculture    │                      │  - Polls, Surveys      │
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │             Guhar SOS Hub                │
                     │  - High priority mutual aid and rescue   │
                     └────────────────────┬─────────────────────┘
                                          │
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │          Safety & Moderation             │
                     │  - Fraud engines, Trusted Elder reviews   │
                     └──────────────────────────────────────────┘
```

---

## 2. Core Modules Specification

### Module 1: User System (Citizen Identity)
*   **Aesthetic & UX**: A streamlined, mobile-first onboarding flow that uses SMS OTP verification (via Twilio/Local SMS gateways like Sparrow SMS). No complicated email passwords.
*   **Functional Mechanics**:
    *   **Self-Asserted Profiles**: Multi-step registration wizard collecting real Name, chosen `@username` (must pass regex validation), phone numbers, and administrative credentials (province, district, municipality, ward).
    *   **Level-Gate Unlocks**: Users begin at Level 1 (Phone Verified). They can request upgrades by uploading ID documents (citizenship card, license, voter ID) to enter Level 2 queues.
    *   **Reputation Engine**: A dynamic state parameter (`reputationScore`, scale: 0-100) that increments or decrements automatically based on volunteer activity (answering Guhar requests, completing day labor shifts, and peer recommendations).

### Module 2: Personal Communication (Chautari Chat)
*   **Aesthetic & UX**: Clean, chat layout utilizing a high-contrast sand-drift/off-white background with forest green accents. Features clear message delivery handles and visual badges for user verification tiers.
*   **Functional Mechanics**:
    *   **1-to-1 & Group Chats**: Real-time messaging powered by Firestore reactive streams or highly scaleable WebSocket gateways.
    *   **Localized Media Attachments**: Supports raw text, voice notes (compressed as `.aac`/`.webm`), images (JPEG/PNG), and local documents (PDFs for job certs).
    *   **Chat Search Indexing**: Offline-first clients cache logs in IndexedDB (using Dexie.js) to allow immediate, zero-latency text matching over previous message histories.

### Module 3: Community Network (National Hierarchy)
*   **Aesthetic & UX**: A multi-tiered community explorer view that lists activities, local announcements, and notices grouped by hierarchical regions.
*   **Functional Mechanics**:
    *   **Automated Content Partitioning**: Real-time content routing based on user profiles. For example, a Notice posted in `Kaski-Pokhara-5` is immediately accessible to users registered in that exact ward, while also bubbling up into the *Pokhara* municipality board.
    *   **Tole Nodes**: Highly granular neighborhood subsets (e.g. "Chipledhunga Tole") let citizens publish micro-local updates (e.g., local dog missing, loose electrical cables).

### Module 4: Help Center (Guhar Hub)
*   **Aesthetic & UX**: High-contract, red-accented dashboard prioritizes critical, real-time requests. Avoids layout clutter to keep loading times fast under poor connectivity (2G/3G).
*   **Functional Mechanics**:
    *   **Emergency SOS**: Dispatches global alerts within a 5km radius to adjacent citizens using geohash lookups.
    *   **Blood Requests**: Standardized inputs for Blood Type (e.g., A Rh-), required units, specific hospital address, and verified dispatcher contact numbers.
    *   **Disaster Assistance & Missing Persons**: Pinpoints request coordinates on mapping components using the Google Maps platform and supports direct photo uploads to help with identification.

### Module 5: Service Hub (Skilled Labor Directory)
*   **Aesthetic & UX**: A user-friendly "Yellow Pages" interface designed for local tradespeople, featuring easy-to-use search filters for category types and ratings.
*   **Functional Mechanics**:
    *   **Direct Dial Matching**: Connects local residents with plumbers, electricians, tanners, tutors, or drivers within their municipality.
    *   **Vetting Pipeline**: Service providers display their specific verified badges based on verification achievements (e.g., "Municipal certified").
    *   **Star Ratings & Performance Rollups**: Enforces mandatory single-submission reviews from users who hire providers to prevent rating manipulation.

### Module 6: Haat-Bazaar Marketplace
*   **Aesthetic & UX**: A grid-based trading feed highlighting fresh crops, livestock, hand-tools, and household items. Uses clear labels to distinguish items for "Sale", "Rent", or "Barter Swap".
*   **Functional Mechanics**:
    *   **Barter / Seed Swap Matrix**: Lets farmers negotiate swaps directly (e.g., swapping dynamic tomato seeds for fertilizer bags).
    *   **Booking Leases**: Tracks availability dates and lock statuses for items listed as rentals (e.g., water pumps, tractors).

### Module 7: Job Hub (Day Work Registry)
*   **Aesthetic & UX**: A job board optimized for short-term and daily-wage agricultural labor. Displays payout rates directly at the top of listings (e.g., NPR 1200 / Day).
*   **Functional Mechanics**:
    *   **Proximity Alerts**: Alerts job hunters when agricultural, freelance, or physical construction needs arise nearby.
    *   **Applicant Safety Check**: Employers must verify their identity (Level 2+) before posting jobs to ensure workplace safety for applicants.

### Module 8: Education Hub (Sikshya Desk)
*   **Aesthetic & UX**: A lightweight, minimal forum styled as a knowledge vault, categorized by grades (Class 10, NEB Class 11/12, Lok Sewa prep) and skills.
*   **Functional Mechanics**:
    *   **Notes sharing**: Enables students to share PDFs of handwriting notes, study guides, and test preparations.
    *   **Local Private Tuition Matching**: Parents can request tutors for specialized subjects near their ward.

### Module 9: Agriculture Hub (Krishi Mandi)
*   **Aesthetic & UX**: High-fidelity charts displaying daily crop prices across the major Mandi markets (Kalimati, Pokhara, Biratnagar). Includes quick links to buy, sell, or rent shared farm equipment.
*   **Functional Mechanics**:
    *   **Equipment sharing**: Tracks shared co-op farm equipment (tractors, tillers, threshers) to lower capital costs for smallholder farmers.
    *   **Seed Exchange & Livestock Registry**: Provides dedicated forums for trading animal breeds (goats, buffaloes) and seed varieties.

### Module 10: Business Hub (Local Promotion)
*   **Aesthetic & UX**: Beautiful, clean grid displays promoting local home-bakers, tailors, handicraft creators, and neighborhood shops mapping to the region.
*   **Functional Mechanics**:
    *   **Targeted Ward Ads**: Local shops can promote special listings or events specifically to citizens registered inside their ward, preventing ad fatigue and reducing spam.

### Module 11: Travel Hub (Local Tourism Guide)
*   **Aesthetic & UX**: Visual cards introducing authentic local home-stays, hidden waterfalls, trekking paths, and municipal highlights.
*   **Functional Mechanics**:
    *   **Local Guides Hub**: Lets certified local guides list their specialty packages (high-altitude hiking, botanical observation, river rafting).
    *   **Homestay booking**: Supports booking requests directly with family-run homestays, routing travel spending back into local communities.

### Module 12: Lost & Found Registry
*   **Aesthetic & UX**: A structured grid categorized by lost items (citizenship cards, keys, wallets, cows/goats) and found items.
*   **Functional Mechanics**:
    *   **Claim Verification Gate**: Item finders can hide specific details (e.g., serial number, key bundle distinct characteristics, inner wallet pocket color) to ensure items are returned to their rightful owners.

### Module 13: Community Decision System (Chautari Polls)
*   **Aesthetic & UX**: Visual poll cards featuring real-time rating scales and percentage bar charts showing voting distributions across local decisions.
*   **Functional Mechanics**:
    *   **Ward Surveys**: Lets local leaders poll ward residents on public decisions (e.g., park road maintenance, community forest pruning timetables).
    *   **Sybil-Attack Prevention**: Enforces a strict one-vote-per-authenticated-citizen rule, validated by the parent document tracking individual UIDs inside vote ledgers.

### Module 14: Safety Center (Scam Watch)
*   **Aesthetic & UX**: A safety alert widget displayed on home dashboards, featuring prominent notices about reported neighborhood phone scams, counterfeit bill issues, or suspicious activity.
*   **Functional Mechanics**:
    *   **Immediate Reports Processing**: Users can report fraudulent listings, fake SOS alerts, or scammers. Accumulating 3 active reports automatically freezes the reported profile until municipal admins review the case.

### Module 15: Local Information Center (Wada Bulletin)
*   **Aesthetic & UX**: A micro-widget displaying road closures, water supply interruptions, planned power outages (Load shedding schedules), and community announcements.
*   **Functional Mechanics**:
    *   **Authority Dispatch**: Verified ward leaders with municipal credentials can announce service notices directly to all localized devices.

---

## 3. Administrative Architecture

The administration dashboard is split into segregated modules designed to coordinate citizen lifecycle verifications, content moderation, and safety monitoring:

```
                            ┌─────────────────────────────────┐
                            │      Unified Admin Hub          │
                            └────────────────┬────────────────┘
                                             │
      ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
      ▼                      ▼                               ▼                      ▼
┌───────────────┐     ┌───────────────┐               ┌───────────────┐      ┌───────────────┐
│     User      │     │ Verification  │               │    Abuse &    │      │  Security &   │
│  Management   │     │    Review     │               │  Fraud Center │      │   Analytics   │
└───────────────┘     └───────────────┘               └───────────────┘      └───────────────┘
```

1.  **User Management**:
    *   Enables central administrators to monitor profiles and adjust account flags (`active`, `suspended`, `under_verification`). Allows searching users by phone number or administrative ward.
2.  **Verification Review (KYC Pipeline)**:
    *   A dashboard displaying submitted Level 2 and Level 3 verification requests, showing original documents side-by-side with profile data for manual validation.
3.  **Abuse & Fraud Hotline (Reports)**:
    *   Lists report logs submitted by users. Admins can view complete dispute details, review linked listings, read chat room logs related to fraud claims, and suspend fraudulent profiles with one click.
4.  **Content Moderation Workspace**:
    *   Automatically flags posts contains blacklist terms (harassment, dangerous materials, unverified spam) for admin review.
5.  **Telemetry & Analytics Control**:
    *   Tracks real-time system performance: active SOS counts, active service provider registrations, and help completion speeds across municipalities.

---

## 4. Scalability Architecture

To support scaling from **100K users** to **10 million citizens**, the platform's backend is designed around a three-tier scalability architecture:

### Phase 1: Up to 100,000 Users (Standard Cloud Run + Firestore)
*   **Topology**: Fast Serverless hosting utilizing **GCP Cloud Run** routing to **Cloud Firestore** and standard Firebase Auth.
*   **Data Footprint**:
    *   All regional boards are grouped by composite keys (e.g., `Gandaki-Kaski-Pokhara-5`) to fetch and update entries instantly in one database request.
    *   Standard local client-side `localStorage` caching caches basic assets like data catalogs, icons, and static strings to reduce database read costs.

### Phase 2: Up to 1 Million Users (Redis Caching + Write-Debouncing)
*   **Topology**: Integrates a serverside caching layer using **Redis** paired with background worker queues (BullMQ/Node) to optimize database access under high load.
*   **Data Footprint**:
    *   **Read Optimization**: High-frequency, low-write data paths (such as the daily Krishi Mandi agricultural prices and active community poles) are stored in the Redis caching layer to avoid duplicate database read charges.
    *   **Write Batching**: Chat message writes are compiled into memory buffers and written to the database in bulk batches every 5 seconds, rather than triggering single real-time writes.

### Phase 3: Up to 10 Million Users (Segmented Databases + Cloud Spanner option)
*   **Topology**: Migrates the database of high-scale transaction services (Marketplace bids, user checkouts, messaging logs) into a segmented structure using **Cloud SQL PostgreSQL (with PgBouncer)** or global routing with **Cloud Spanner**.
*   **Data Footprint**:
    *   **Sharding by Province**: Direct shards separate database servers according to Nepal's 7 Provinces (e.g. Province 1 database cluster, Gandaki Province cluster). This localizes database traffic within the physical geography of the users, ensuring high speed and reliability.
    *   **Cold Storage Offloading**: Historical chat histories and resolved SOS notices are moved out of active memory and archived into low-cost cold storage Buckets, keeping active databases lightweight, responsive, and cost-effective.
