# Nepali Family Local App: UI/UX Design System & Screen Specifications (Phase 5)

This document establishes the UI/UX design specifications, screen-by-screen navigation layouts, structural wireframe designs, and workflow criteria for the **Nepali Family Local App**. This architecture is structured to operate seamlessly on local environments, low-end mobile devices, and under poor networks (2G/3G/4G).

---

## 1. Global UI Style Guide

The visual design system prioritizes clarity, readability, fast loading speeds, and low-data usage. There are no heavy dynamic visual elements or complex parallax layers.

### 1.1 Color Palette
The color hierarchy centers on trust, safety, and rapid municipal navigation:

| Usage Class | Tailwind Class | HEX Value | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Blue** | `bg-blue-600` / `text-blue-600` | `#2563EB` | Trust, verification signs, primary buttons |
| **Danger / Emergency Red** | `bg-red-600` / `text-red-600` | `#DC2626` | Emergency SOS indicators, active blood requests, SOS triggers |
| **Forest Green (Growth)** | `bg-emerald-600` | `#059669` | Agriculture hub, livestock, organic status, successful completions |
| **Slate Dark (Text)** | `text-slate-800` | `#1E293B` | High-contrast main display text, headings |
| **Muted Slate** | `text-slate-500` | `#64748B` | Secondary details, metadata lines, date trackers |
| **Pure Canvas (Light)** | `bg-white` / `bg-slate-50` | `#FFFFFF` / `#F8FAFC` | Main app background, clean card bodies |

### 1.2 Layout & Grid Rules
- **Device Shell Limit**: Desktop sizes are bound by a responsive centered column (`max-w-md mx-auto w-full min-h-screen shadow-2xl relative bg-slate-50`) to replicate the physical dimensions of standard Android devices (mobile preview mode).
- **Safe Padding Scales**: Consistent spatial metrics prevent structural overlaps:
  - Screen containers: `px-4 py-3`
  - Inner card gaps: `space-y-3`
  - Minimum touch target dimension: `44px x 44px` for all clickable items.
- **Card Styling Guidelines**: High-contrast, borders-only or lightweight shadow card configurations:
  `bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm`

### 1.3 Typography Setup
- **Display Headings**: `font-sans font-bold tracking-tight text-slate-800` (e.g. Inter or Outfit).
- **Secondary Body Text**: `font-sans text-sm font-normal text-slate-600`
- **Data / Status Tags**: `font-mono text-xs tracking-mono uppercase text-slate-500` (e.g. JetBrains Mono).

---

## 2. Shared Interface Infrastructure & Offline Assets

To support disconnected use (offline-friendly caches), all core icons and static data assets are bundled directly inside the local distributable build:

### 2.1 Offline Mode Custom Cues
- When network drops (`!navigator.onLine` or local states), a permanent non-blocking alert banner mounts directly underneath the main header:
  ```
  +--------------------------------------------------------+
  |  [!] operating in Offline Cache Mode. edits will sync  |
  +--------------------------------------------------------+
  `bg-amber-50 text-amber-800 border-b border-amber-200 px-4 py-1.5 text-xs text-center font-medium`
  ```
- Any form submitted when offline appends a small circular queue arrow symbol (`○`) onto the card status field until synced.

### 2.2 Global Icon Strategy
All icons rely strictly on **Lucide React** vectors loaded locally:
- **Search**: `Search`
- **SOS / Help**: `AlertOctagon`
- **Personal / Profile**: `User`
- **Marketplace**: `ShoppingBag`
- **Chat**: `MessageSquare`
- **Communities**: `MapPin`
- **Jobs**: `Briefcase`
- **Agriculture**: `Sprout`

---

## 3. Comprehensive Screen Specifications (14 Screen Layouts)

### Screen 1: Splash Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  |                                   |
  |                                   |
  |               Logo                |
  |           [Hand hands]            |
  |                                   |
  |     Nepali Family Local App       |
  |        "Ek Nepal, Ek Family"       |
  |                                   |
  |                                   |
  |         [Loading spinner]         |
  |                                   |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Main app vector logo: Two interlocking hands forming a home silhouette themed in `text-blue-600`.
  - Brand heading: "Nepali Family Local App".
  - Sub-tagline: "एक नेपाल, एक परिवार (Ek Nepal, Ek Family)".
  - Bottom copyright statement: "Secured local network".
- **Primary & Secondary Action Targets**:
  - *No manual inputs*. Transition trigger completes within 1000ms, routing directly to **Screen 2: Login / Signup** or **Screen 3: Home Dashboard** if the session token is active.
- **Interactive States**:
  - Subtle fade-in entrance for tagline.
  - Spinner shows if local DB setup is loading.

---

### Screen 2: Login / Signup Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  |                                   |
  |           Select Language         |
  |        [ English ]  [ नेपाली ]     |
  |                                   |
  |        Enter Mobile Number:       |
  |        [ +977 | 98XXXXXXXX ]      |
  |                                   |
  |        [  REQUEST OTP GATE ]      |
  |                                   |
  |        Enter 6-Digit OTP:         |
  |        [ _ _ _ _ _ _ ]            |
  |                                   |
  |        [ CONFIRM AND SIGN IN ]    |
  |                                   |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Two language selectors toggle (English/नेपाली).
  - country dial-code selection input (`+977` defaulted) and mobile number text input text-field with length caps checked to standard Nepali cell numbers (98/97 starting digits).
  - Validation message banner slot ("Invalid phone number format").
  - 6-digit PIN input panel with discrete verification trigger code inputs.
- **Primary & Secondary Action Targets**:
  - **Primary**: "Request OTP Verification" button (`bg-blue-600 text-white rounded-lg py-3 font-semibold`).
  - **Secondary**: "Resend Verification Code" timer label link.
- **Interactive States**:
  - Disable input boxes during OTP transfer steps.
  - Show a countdown clock timer ("Resend in 45s").

---

### Screen 3: Home Dashboard Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | App Logo  [ District Picker v ] [!] |
  +-----------------------------------+
  | EMERGENCY SOS SUPPORT BUTTON [!]  |
  +-----------------------------------+
  | NEED HELP       | OFFER HELP      |
  +-----------------------------------+
  | QUICK ACTION RAILS:               |
  | [Post Job] [Post Market] [Service] |
  +-----------------------------------+
  | ACTIVE LOCAL HELP REQUESTS PANEL: |
  | - Blood request (Ward 4) [CRITICAL]|
  | - Missing goat report             |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Main district selector dropdown representing all 77 districts of Nepal, dynamically filtering the feed below.
  - Bright red prominent SOS action area button: "EMERGENCY SOS CALL (Sankat Guhar)".
  - Side-by-side action triggers: "Need Help (सहायता चाहिन्छ)" (green font) / "Offer Help (सेवा उपलब्ध गराउनुहोस्)" (blue font).
  - Quick launch micro-grid containing direct buttons for dynamic postings.
- **Primary & Secondary Action Targets**:
  - **One-Click Critical Route**: Pressing the red SOS triggers a 3-second countdown to cancel or auto-creates a local alert dispatching client information to adjacent users.
- **Interactive States**:
  - District dropdown triggers visual filter flags over home cards instantly.
  - Skeleton frames replace lists while performing cache operations.

---

### Screen 4: Community Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | [ Search region or ward...      ] |
  +-----------------------------------+
  | PROVINCE:   [ Koshi ] [ Bagmati ] |
  +-----------------------------------+
  | WARD 5 CHAUTARI COMMUNITY BOARD:  |
  | [!] Road blockade at Tole corner  |
  | [*] Ward vaccination next Sunday  |
  +-----------------------------------+
  | [ ADD COMMUNTY ANNOUNCEMENT CARD ] |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Dynamic local search toolbar text box.
  - horizontal tabs showing individual Provinces, Districts, and Municipalities.
  - A real-time scrolling bulletin board displaying official Wada (Ward) announcements, stamped with validation badges.
- **Primary & Secondary Action Targets**:
  - **Primary Add Action**: "Add Announcement" floating action bubble button.
  - **Secondary Tab Switches**: Selecting an individual region to focus posts from that target geographic sector.
- **Interactive States**:
  - Search entries filter elements on keystroke without initiating database roundtrips by assessing cached entries.

---

### Screen 5: Help Center Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  |  [ Need Help ]     [ Offer Help ] |
  +-----------------------------------+
  | CATEGORIES:                       |
  | [ Blood ] [ Food ] [ Rescue ]     |
  +-----------------------------------+
  | EMERGENCY HELP CARDS LISTING:     |
  | + B+ Blood needed (Hospital W1)   |
  |   Disp: Ram Shrestha - 9845X...   |
  |   [ Call Dispatcher Button ]      |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Category horizontal scrolling pills: "Blood", "Emergency SOS", "Missing Person", "Volunteer Needs".
  - Listing Feed cards displaying urgency tags (`CRITICAL` in deep red outline, `HIGH` in yellow background).
  - Directly accessible "Call Now" buttons embedding dialer hooks (`href="tel:..."`).
- **Primary & Secondary Action Targets**:
  - **Primary**: "Post a Help Request" bright colored action button.
  - **Secondary Action**: Contact dispatch button to initiate a quick audio-call.
- **Interactive States**:
  - Resolved items are dynamically faded-out, showing a green check stamp "RESOLVED".

---

### Screen 6: Marketplace Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | Category: [Farm] [Tools] [Books]  |
  +-----------------------------------+
  | Sort: [Lowest Price] [Organic Only]|
  +-----------------------------------+
  | HAAT-BAZAAR ITEMS:                |
  | + Organic Apples crate (Mustang)  |
  |   NPR 450 - [Swap/Rent Allowed]   |
  |   Contact: 981244XXXX             |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Dynamic categories selector options representing localized production (Farm produce, seed exchange, water pumps, textbooks, livestock).
  - Trading status tags: "For Sale", "For Rent", "Barter Swap".
  - Cost input tags in Nepalese currency values ("NPR XXX").
  - Item listing cards with optional visual layout grids for item photographs.
- **Primary & Secondary Action Targets**:
  - **Primary Action**: "List New Item in Bazaar" button.
  - **Secondary Action**: "Chat with Seller" routing directly to personal messaging channels.
- **Interactive States**:
  - Toggling "Organic Only" automatically masks processed or chemical products instantly.

---

### Screen 7: Chat Screen (Chautari Chats)
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | [ Search contacts/chats...      ] |
  +-----------------------------------+
  | CHANNELS: [Personal] [Group]      |
  +-----------------------------------+
  | - Ward 4 Central Group            |
  |   "Water supply active at 4PM"     |
  | - Shyam Lal [Level 3 Verified]    |
  |   "Are the tools ready today?"    |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Global searching filter input.
  - Category segmentation sliders ("Personal Contacts", "Neighborhood Groups", "Community Boards").
  - Activity thread list elements displaying user avatar nodes, name variables, specific verification badges, and timestamps.
- **Primary & Secondary Action Targets**:
  - **Primary Action**: Selecting an active message room to pull real-time chat histories.
  - **Secondary Action**: Search target user within the local directory to initialize 1-to-1 rooms.
- **Interactive States**:
  - Unread channels highlight in bold text with a small blue dot alert on the margin.

---

### Screen 8: Profile Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  |  Avatar  Shyam Kumar Adhikari     |
  |          [Level 3: Community]     |
  +-----------------------------------+
  |  Reputation Point Index:  [ 85 ]   |
  +-----------------------------------+
  |  Skills: Gardening, Carpentry     |
  |  Services: Handyman               |
  +-----------------------------------+
  |  ACTIVITY TRAIL RECORDS:          |
  |  - Completed 3 blood donations    |
  |  - Shared 2 plow-tools            |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - User avatar frame displaying full name and username.
  - Structured Verification level container representation ("Level 1: Phone Verified", "Level 2: ID Checked", "Level 3: Community Certified", "Level 4: Trustee Elder").
  - Total Accumulated reputation Score widget metric out of 100 points scale.
  - Declared Skills profile labels list.
- **Primary & Secondary Action Targets**:
  - **Primary**: "Edit Profile Details / Manage Services Offered" panel.
  - **Secondary Action**: "Verify Identity Tier" queueing request.
- **Interactive States**:
  - Verification badges pulse softly while evaluation uploads are under verification review queues.

---

### Screen 9: Post Creation Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  |  SELECT CONTENT CATEGORY TYPE:    |
  |  [ Help ] [ Service ] [ Market ] |
  +-----------------------------------+
  |  Title / Name of Posting:         |
  |  [______________________________] |
  |  Brief Description / Parameters:  |
  |  [______________________________] |
  |  Contact Phone:                   |
  |  [ 98XXXXXXXXXXXXXXXXX ]         |
  +-----------------------------------+
  |  [ PUBLISH LOCAL NEW POST CARD ]  |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Category selector radio controls ("Guhar Help Center", "Bazaar Marketplace", "Service Provider Registry", "Jobs Bulletin").
  - Title input field with a placeholder ("Title of post (e.g. Need A+ Blood)").
  - Multi-line descriptive box ("Provide detailed instructions").
  - Direct telephone callback coordinate text field.
- **Primary & Secondary Action Targets**:
  - **Primary Publish Action**: "Publish Location Posting" with robust validations enforcing positive bounds.
  - **Secondary Action**: Cancel & go back to previous view dashboard.
- **Interactive States**:
  - Select options dynamically reorganize the lower form requirements. (Entering "Marketplace" reveals Price field, whereas entering "Help Center" shifts tags to "Urgency Level").

---

### Screen 10: Service Directory Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | [ Search plumber, electrician...] |
  +-----------------------------------+
  | CAT: [Plumber] [Electrician] [Edu]|
  +-----------------------------------+
  | LOCAL ACTIVE TRADESMEN REGISTER:   |
  | + Hari Prasad - Plumber           |
  |   Rating: 4.9 (42 Reviews)        |
  |   NPR 500 / Hour Call fee         |
  |   [ Call Plumber Button ]         |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Search service filter field.
  - Horizontal services categorization panels (Handyman, Electrician, Carpenter, Agriculturalist, Local Teacher, Driver).
  - Directory card listings containing rating counters, total verified seals indicators, and estimated cost fees.
- **Primary & Secondary Action Targets**:
  - **Primary Dial Action**: "Direct Dialer hook" button inside Card layout.
  - **Secondary Action**: "View detail reviews log".
- **Interactive States**:
  - Hovering or highlighting cards highlights them in soft light blue bordered outline structures.

---

### Screen 11: Jobs Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | Filter: [Daily Wage] [Agriculture] |
  +-----------------------------------+
  | COMPATIBLE DAY WORK OPPORTUNITIES|
  | + Rice Harvest Labor Needed       |
  |   NPR 1,200 per standard day      |
  |   Wada 4 Rice Farm, Jhapa         |
  |   [ QUICK APPLY APPLICANT ]      |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Filter parameters targeting work categories (Daily field labor, Construction, Skill work, Home teaching).
  - Job card details displaying direct payment indices ("NPR XXX per Day").
  - Action tags highlighting status ("APPLIED" checkbox, "URGENT").
- **Primary & Secondary Action Targets**:
  - **Primary**: "Quick Apply App Submission" linking user ID and phone registers instantly.
  - **Secondary**: Request more information callback.
- **Interactive States**:
  - Changes "Apply" button status instantly to "APPLICATION SUBMITTED" accompanied by green checks.

---

### Screen 12: Lost & Found Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | STATUS TABS: [ Lost ]  [ Found ]  |
  +-----------------------------------+
  | ACTIVE LOGS IN REGION:            |
  | - Lost: Brown Cow (Jhapa Wada 2)  |
  |   Date Lost: Yesterday            |
  |   [ Claim Finder Contact Info ]   |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Filtering tab panels indicating status: "Lost Items (हराएको)" / "Found Items (भेटिएको)".
  - Log details: item descriptors, date markings, region boundaries, and finder contact points.
  - Direct secure notification system controls to avoid spam calls.
- **Primary & Secondary Action Targets**:
  - **Primary Action**: "Register Lost/Found Card".
  - **Secondary Action**: Verify description parameters to claim object.
- **Interactive States**:
  - Active selection overlays matching details cards on visual displays.

---

### Screen 13: Notifications Screen (Wada Alert Hub)
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  |  Notification Hub                 |
  +-----------------------------------+
  |  - [CRITICAL ALERT] Rain blockages|
  |    declared in Kaski highways.    |
  |  - [Private message] Shyam sent:    |
  |    "I can deliver seeds tomorrow" |
  |  - [System] Verified as level 2!  |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Alert stream listing items classified into categories: `Emergency Alerts` (Red alerts code style), `Chat Requests` (Blue indicators), `System Updates` (Slate grey checks).
  - Clear All Alerts button.
- **Primary & Secondary Action Targets**:
  - **Primary**: Pressing is message notification routes pathing context straight to original trigger item.
- **Interactive States**:
  - Clicking single logs marks items instantly from unread formats to faint muted lines.

---

### Screen 14: Settings Screen
- **Visual wireframe layout**:
  ```
  +-----------------------------------+
  | SETTINGS PANEL:                   |
  +-----------------------------------+
  | Choose System Language:           |
  | (o) नेपाली (Nepali)                |
  | ( ) English (English)             |
  +-----------------------------------+
  | Privacy & Security Controls:      |
  | [x] Hide mobile number if offline |
  | [x] Restrict chats to Wada 4 only |
  +-----------------------------------+
  | [ CLEAR LOCAL DATABASE CACHE ]    |
  +-----------------------------------+
  ```
- **Fields & Elements**:
  - Language selection options.
  - Privacy toggles checkbox parameters (SMS tracking control, localized coordinate display mask, restricted community chats).
  - Hard button action triggers to clear localized caches and log out profiles.
- **Primary & Secondary Action Targets**:
  - **Primary**: Language toggle updates state configs instantly.
  - **Secondary Action**: Cache cleaning buttons resets memory allocation records.
- **Interactive States**:
  - Shows success modal or simple confirmation alert stating "Language configured (नेपालीमा परिवर्तन भयो)".

---

## 4. User Flow Rules

### 4.1 Two-Click Resolution Criteria
In order to provide maximum accessibility for low-literacy or elderly users on the field:
1. **To Seek Medical/Emergency Assistance**:
   - *Click 1*: Press "Need Help / Emergency Support" on Home.
   - *Click 2*: Tap "Request Blood" / "SOS Dispatcher" button. This auto-completes and submits their listing utilizing verified identity fields.
2. **To Find a Plumber**:
   - *Click 1*: Tap bottom tab / Home icon "Services".
   - *Click 2*: Tap the green telephone icon on the closest plumber to initiate the physical call.

### 4.2 One-Click Safety Escalation
In critical crises, users can trigger emergency alert dispatches directly:
- **Rule**: If a user is on the main Home dashboard, clicking and holding the red Emergency SOS circle for **1.5 seconds** instantly generates an SOS record without requiring any field inputs. The system uses the device's cached location and identity parameters to publish a help request to all adjacent neighbors automatically.
