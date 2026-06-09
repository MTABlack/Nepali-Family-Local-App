# Nepali Family Local App: Database Architecture & System Design Document (Phase 3)

This document details the production-ready NoSQL database architecture, relational models, indexing strategies, localized storage representations, and security systems designed to deploy the **Nepali Family Local App** nationwide across Nepal's 7 Provinces, 77 Districts, 753 Municipalities, and thousands of Wards.

---

## 1. Relational Map & Collection Hierarchies

Although Cloud Firestore is a document-oriented NoSQL database, we enforce logical relationships and cascade guidelines across entities to maintain strict data integrity. Below is our entity-relationship layout:

```
[UserAccount] (1)
  │
  ├───(1:N)──> [VerificationLevel] (Subcollection) — OTP, gov documents, verifier references
  ├───(1:N)──> [SecurityLog] (Subcollection)       — Session IPs, token rotation tracking
  │
  ├───(1:N)──> [ServiceProvider] (Root) — Skills, fee directories, area coverages
  │              └───(1:N)──> [ServiceReview] (Subcollection) — Reviews and rated scores
  │
  ├───(1:N)──> [MarketplaceListing] (Root) — Items for farm, livestock, tool sales, swaps or rent
  │
  ├───(1:N)──> [HelpRequest] (Root) — Life-saving blood requests, disaster SOS alerts, maps
  │
  ├───(1:N)──> [JobListing] (Root) — Daily agricultural or freelance labor announcements
  │              └───(1:N)──> [JobApplication] (Subcollection) — Applications, status values
  │
  └───(1:N)──> [UserReport] (Root) — Scammer tracking, fake emergencies, content complaints

[ChatRoom] (1) — Personal DMs, communal Ward-level channels, group chats
  │
  └───(1:N)──> [Message] (Subcollection) — Text, voice clips (.aac), image or document URLs
```

### Cascade & Integrity Strategy
- **Nullified Orphans (Soft-delete)**: When a citizen profile is suspended or closed (`accountStatus == "suspended"`), any marketplace listings or services associated with their UID are flagged as inactive or deleted via background Cloud Functions.
- **Master Gates (Group Chats)**: Access to messages inside `/chatRooms/{roomId}/messages/{messageId}` is evaluated dynamically by querying the parent `/chatRooms/{roomId}` document. Access is denied instantly to any user removed from the room's members list.
- **Rollup Calculations (Ratings)**: When a new `ServiceReview` is written, a background Cloud Function recalculates the parent `ServiceProvider` rating and reviews counts atomically using transactional increments:
  $$\text{New Rating} = \frac{(\text{Current Rating} \times \text{Reviews Count}) + \text{New Star Rating}}{\text{Reviews Count} + 1}$$

---

## 2. Nepal-Wide Administrative & Community Hierarchy

To organize users and content localized down to their exact ward, the database structures locations using the official administrative tiers of Nepal:

$$\text{Province} \longrightarrow \text{District} \longrightarrow \text{Municipality} \longrightarrow \text{Ward} \longrightarrow \text{Local Community (Tole)}$$

### Data Structure Mapping
Locations are stored as a compound path on documents and in the `/communities/` directory:

```json
{
  "province": "Gandaki Province",
  "district": "Kaski",
  "municipality": "Pokhara Metropolitan City",
  "wardNumber": 5,
  "localCommunityName": "Chipledhunga Tole"
}
```

### Proximity & Geo-Searching Performance
Firestore does not support relative multi-key geo-distance queries natively. To achieve fast, low-cost geolocative queries without calling external GIS engines:

1. **Hierarchy Composite ID Filtering**:
   All root collections contain a indexing-friendly query string, allowing fast partition searches:
   $$\text{geoIndexField} = \text{"province\_district\_municipality\_wardNumber"}$$
   *Example*: `"Gandaki-Kaski-Pokhara-5"`
   
   *Querying Ward notices:*
   ```ts
   query(collection(db, "helpRequests"), where("geoIndexField", "==", "Gandaki-Kaski-Pokhara-5"))
   ```

2. **Geohashes for Dynamic Proximity Plots**:
   In addition to administrative groupings, dynamic locations store their 2D point coordinates accompanied by an **auto-calculated Geohash** string representing precise coordinates:
   ```json
   "currentLocation": {
     "geohash": "tux4zge",
     "latitude": 28.2234,
     "longitude": 83.9856
   }
   ```
   During disaster SOS actions, the client calculates the bounding box geohashes of adjacent territories (approx. 5KM radius grid) and uses a fast range filter across the coordinate clusters:
   ```ts
   query(collection(db, "helpRequests"), orderBy("currentLocation.geohash"), startAt(box.min), endAt(box.max))
   ```

---

## 3. Multi-Language (Nepali-English) Support Strategy

Nepali citizens require seamless localization. We adopt a **Dual-Field Schema & Global Translation Dictionary Model** to balance efficiency, ease of indexing, and responsiveness.

### Approach 1: Dual-Field Declarations (For dynamic user-generated content)
For content created directly by citizens (such as marketplace listing descriptions or SOS updates), fields are split into explicit raw values or dual locales:
```json
{
  "title_en": "Organic Orange Harvest from Pokhara W5",
  "title_np": "पोखरा वडा नं. ५ को अर्गानिक सुन्तला उत्पादन",
  "description_en": "Willing to swap orange seeds or sell bulk crates.",
  "description_np": "सुन्तलाको बीउ साटासाट गर्न वा थोकमा क्रेडहरू बिक्री गर्न इच्छुक।"
}
```

### Approach 2: Translation Reference Links (For system UI and static categories)
For categories, notices, or buttons whose translations are handled programmatically in code (e.g. inside `/src/data.ts`), documents store simple translation string tokens instead of storing complete duplicated strings in the database:
```json
{
  "category": "farm",
  "categoryTitleRef": "category_farm_label" 
}
```

---

## 4. Verification Levels System (Trust Architecture)

Trust is crucial for the stability of a decentralized local community. The application establishes **four progress levels** that unlock progressively higher access bounds:

```
[Level 1: Phone Verified] ──> [Level 2: Government ID Verified] ──> [Level 3: Community Verified] ──> [Level 4: Trusted Member]
```

| Verification Tier | Mechanics | Database Path | Security Rights Unlocked |
| :--- | :--- | :--- | :--- |
| **Level 1: Phone Verified** | SMS OTP verification of owner mobile. | `/users/{userId}` holding `verificationStatus: 1` | Can view notices, join localized group chats, comment, and read marketplace entries. |
| **Level 2: ID Verified** | Submitting citizenship card, license or voter id. | Verified by comparing file records under `/users/{userId}/verifications/gov_id` | Can post active marketplace sales, register standard plumbing/electrical services, apply for jobs. |
| **Level 3: Community Verified** | Signed verification by at least three active Level 3/4 citizen peers. | Submision logs under `/users/{userId}/verifications/community_vouch` | Unlocks credentials for emergency medical donation listings (direct blood requests), community polls creation. |
| **Level 4: Trusted Member** | Official council confirmation or regional authority validation. | Level mapped in account card by administrative keys. | Can write security alerts, moderate ward conversations, dispute fraud incidents. |

---

## 5. Security Audits & Anti-Fraud Logs

To protect vulnerable citizens from financial fraud, identity-hijacking, and spam, our security module implements real-time activity and logging tables:

### Immutable Security Logs
Every authentication event automatically registers an auditable log entry under `/users/{userId}/securityLogs/{logId}` containing:
* Client IP address
* Browser fingerprints / OS markers
* Action category (such as password changes, login attempts, verification uploads)

Because of the immutable configuration `allow update, delete: if false;` written inside `firestore.rules`, attackers cannot erase proof of a login hijack attempt even if they successfully gain entry into an account.

### Fraud Report Escalations
All user reports are stored centrally under `/reports/{reportId}`. A background analyzer counts user-related reports. Exceeding **three active claims** on a single profile triggers an automated rule locking down their listings until reviewed by a Trusted Elder (Level 4):
```ts
// Example conceptual lock
if (user.reportsCount >= 3) {
  accountStatus = "under_verification";
}
```

---

## 6. Future Expansion Roadmap

The NoSQL collection topology is structured to support future expansion features seamlessly:

1. **Krishi Mandi Market Prices Sync**:
   * *Structure*: A root-level collection `/mandiPrices/{priceId}` will hold real-time agricultural commodities pricing pulled from national federations via bulk API cron tasks.
2. **Homestay & Travel Tourism Directories**:
   * *Structure*: `/homestays/{homestayId}` with subcollection `/bookings/{bookingId}` to let rural homestay operators directly receive listings and bookings from travelers.
3. **Micro-Savings / Cooperative Groups (Sajha Savings)**:
   * *Structure*: `/cooperatives/{coopId}/ledgers/{ledgerId}` to track transparent ledgers for small community investment pools.
