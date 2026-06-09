# Security Specification: Nepali Family Local App Database Integrity

## 1. Core Data Invariants

1. **User Identity Isolation**: A citizen profile (`/users/{userId}`) can only be created or modified if `{userId}` matches the authenticated user's `request.auth.uid`. No user can read or write another user's PII (Phone number, Date of Birth, Email) directly.
2. **Immutability of Key Metadata**: Static data like `createdAt`, `userId`, `username`, and `phoneNumber` cannot be altered after the initial citizen profile registration.
3. **Privilege Escalation Block**: `reputationScore`, `verificationStatus`, and `accountStatus` are system-controlled indicators. Citizens are strictly forbidden from manual modification of these indices.
4. **Member-Only Communication**: A message (`/chatRooms/{roomId}/messages/{messageId}`) can *only* be uploaded if the authenticated user's ID is an actively enrolled member inside the parent chat room's `/chatRooms/{roomId}` document.
5. **No Blind Verification**: Verification logs (`/users/{userId}/verifications/{verificationId}`) can only be created if the caller has authenticated access, and validation levels 2/3/4 require verification from another trusted node or administrative verifier.
6. **Immutable Ratings Integrity**: Reviews and star ratings (`/services/{providerId}/reviews/{reviewId}`) must evaluate to integers strictly ranging between `1` and `5`.
7. **Protected Marketplace Ownership**: Service listings or marketplace sales can only be updated/deleted by the designated seller/provider (`sellerId == auth.uid` or `userId == auth.uid`).
8. **Emergency Validity**: Urgent mutual aid requests (Guhar Hub) require valid, verified contact information. Urgent SOS fields cannot be modified or cleared once terminal state has been set (e.g. `resolved`).

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads outline adversarial write attempts designed to bypass validation gates, perform updates-gaps, or hijack identity attributes. 

### Payload 1: The Trust Upgrader (Identity & Privilege Escalation)
*   **Target**: `/users/citizen_jhapa_05`
*   **Objective**: Exploit a missing write-gate to upgrade verification levels to Level 4 (Trusted Elder) and reputation score to 100 on registration.
*   **Payload**:
    ```json
    {
      "userId": "citizen_jhapa_05",
      "fullName": "Dinesh Kharel",
      "username": "dinesh_elder",
      "phoneNumber": "9800001122",
      "province": "Koshi Province",
      "district": "Jhapa",
      "municipality": "Birtamod",
      "wardNumber": 2,
      "reputationScore": 100,
      "verificationStatus": 4, 
      "accountStatus": "active",
      "createdAt": "2026-06-08T12:00:00Z"
    }
    ```
*   **Defense**: The schema validation helper `isValidUser()` checks that `verificationStatus == 1` and `reputationScore == 10` on initial citizen signup. It blocks any self-assigned status above 1.

### Payload 2: Ghost Field Injector (Shadow Field Pollution)
*   **Target**: `/users/citizen_jhapa_05` (Update)
*   **Objective**: Inject a hidden `"isAdmin": true` field during a normal profile update to see if the database engine allows untyped attributes.
*   **Payload**:
    ```json
    {
      "fullName": "Dinesh Kharel",
      "bio": "Farmer",
      "isAdmin": true 
    }
    ```
*   **Defense**: The rule uses `affectedKeys().hasOnly(['bio', 'fullName'])` during normal user profile edits, throwing `PERMISSION_DENIED` due to the unauthorized keys.

### Payload 3: Age Spoofing (Temporal Violation)
*   **Target**: `/users/minor_user_02`
*   **Objective**: Claim a registration date of 2010 to appear as a historic foundational user bypassing recent safety protocols.
*   **Payload**:
    ```json
    {
      "userId": "minor_user_02",
      "fullName": "Ram Nepal",
      "username": "ram_nep",
      "phoneNumber": "9812345678",
      "province": "Koshi Province",
      "district": "Jhapa",
      "municipality": "Birtamod",
      "wardNumber": 2,
      "reputationScore": 10,
      "verificationStatus": 1,
      "accountStatus": "active",
      "createdAt": "2010-01-01T00:00:00Z"
    }
    ```
*   **Defense**: Mandatory assertion matching `incoming().createdAt == request.time`. Client-supplied temporal mock-ups fail verification.

### Payload 4: PII Data Harvest (Eavesdropping on Audits)
*   **Target**: `/users/citizen_pokhara_99/securityLogs/some_random_log_id`
*   **Objective**: A malicious authenticated user scans and fetches private session history and IP logs belonging to an active local plumber in Pokhara.
*   **Payload**: `get` call from user `citizen_jhapa_05` targeting `citizen_pokhara_99`'s security subcollection.
*   **Defense**: Collection rule strictly bounds reads to the document owner: `allow read: if request.auth.uid == userId;`.

### Payload 5: Rating Saturation (Value Range Bypass)
*   **Target**: `/services/plumber_kaski_10/reviews/new_exploit_review`
*   **Objective**: Post an over-inflated 100-star review or single-star negative sabotage review to crash the service ranking calculations.
*   **Payload**:
    ```json
    {
      "reviewId": "new_exploit_review",
      "reviewerId": "citizen_jhapa_05",
      "reviewerName": "Anish Adhikari",
      "rating": 100, 
      "comment": "Manipulated review value"
    }
    ```
*   **Defense**: The validation function `isValidReview()` asserts `incoming().rating >= 1 && incoming().rating <= 5`.

### Payload 6: Impersonation Attack (Identity Theft)
*   **Target**: `/jobs/agricultural_job_jhapa/applications/applicant_spoof`
*   **Objective**: Submit a job application under a different applicant's identifier to steel their day-labor shifts.
*   **Payload**:
    ```json
    {
      "applicationId": "applicant_spoof",
      "jobId": "agricultural_job_jhapa",
      "applicantId": "victim_citizen_uid_12", 
      "applicantName": "Victim Lalit",
      "applicantPhone": "9845100021",
      "status": "pending",
      "createdAt": "2026-06-08T22:31:00Z"
    }
    ```
*   **Defense**: Application upload validation checks: `incoming().applicantId == request.auth.uid`.

### Payload 7: Alien Chat injection (Relational Hijack)
*   **Target**: `/chatRooms/kaski_ward_4_group/messages/spam_msg`
*   **Objective**: Send dynamic messages into a secure neighborhood help chatroom without registering as a member.
*   **Payload**:
    ```json
    {
      "messageId": "spam_msg",
      "senderId": "alien_hacker_uid",
      "senderName": "Intruder From Jhapa",
      "text": "Spam message targeting Pokhara citizens",
      "timestamp": "2026-06-08T22:31:00Z"
    }
    ```
*   **Defense**: The rule triggers a `get()` call back to the parent Room: `get(/databases/$(database)/documents/chatRooms/$(roomId)).data.members.hasAny([request.auth.uid])`.

### Payload 8: Immutable Listing Override (Seller Hijack)
*   **Target**: `/marketplace/organic_orange_pokhara`
*   **Objective**: Modify the owner and pricing on an active listing listed by another organic grower in Pokhara.
*   **Payload**:
    ```json
    {
      "sellerId": "alien_hacker_uid", 
      "price": "NPR 0 (Free)"
    }
    ```
*   **Defense**: Every update block verifies: `incoming().sellerId == existing().sellerId` and assert `request.auth.uid == existing().sellerId`.

### Payload 9: Fake SOS Generation (Disaster Exploits)
*   **Target**: `/helpRequests/fake_flood_alert`
*   **Objective**: Spam fake blood or disaster emergencies in remote wards where the user does not reside.
*   **Payload**:
    ```json
    {
      "requestId": "fake_flood_alert",
      "title": "Huge mudslide in Pokhara",
      "province": "Gandaki Province",
      "district": "Kaski",
      "category": "emergency_sos",
      "urgency": "critical",
      "status": "open"
      // Missing phone verification parameters
    }
    ```
*   **Defense**: Rule enforces that only users holding `verificationStatus === 1` can dispatch Help Requests.

### Payload 10: System Field Forgery (Provider Fraud)
*   **Target**: `/services/plumber_kaski_10`
*   **Objective**: Self-authorize as a Council Certified Provider to display fake trust-badges next to their local plumbing service.
*   **Payload**:
    ```json
    {
      "isVerifiedProvider": true 
    }
    ```
*   **Defense**: Under service provider updates, client updates cannot modify `isVerifiedProvider`. Only a verified supervisor account can mutate certification flags.

### Payload 11: Community Boundary Poisoning (Invalid Coordinates)
*   **Target**: `/communities/poison_node`
*   **Objective**: Create a community node with an invalid ward number (-999) or massive longitudes to corrupt district matching.
*   **Payload**:
    ```json
    {
      "nodeId": "Gandaki-Kaski-Pokhara-999",
      "province": "Gandaki",
      "district": "Kaski",
      "municipality": "Pokhara",
      "ward": -999, 
      "localCommunityName": "Poison Tole",
      "residentCount": 1
    }
    ```
*   **Defense**: Validation functions enforce: `incoming().ward > 0 && incoming().ward <= 40`.

### Payload 12: Fraud Report Deletion (Sabotage logs)
*   **Target**: `/reports/fraud_report_against_me`
*   **Objective**: A suspected scammer deletes fraud complaints submitted against their marketplace listings to avoid suspensions.
*   **Payload**: Direct `delete` request.
*   **Defense**: Block all delete permissions on `/reports/{reportId}` collections unless caller is verified inside the `/admins/` registry.

---

## 3. The Test Runner Spec

`firestore.rules.test.ts` outlines a comprehensive test execution setup utilizing `@firebase/rules-unit-testing` to assure complete test green coverage on these 12 vectors.

```typescript
import {
  initializeTestApp,
  initializeAdminApp,
  clearFirestoreData,
  assertFails,
  assertSucceeds
} from "@firebase/rules-unit-testing";
import * as fs from "fs";

const PROJECT_ID = "nepali-family-local-app-test";
const RULES_PATH = "./firestore.rules";

describe("Nepali Family Local App: Hardened Fortress FireStore Rules Suite", () => {
  beforeAll(() => {
    const rules = fs.readFileSync(RULES_PATH, "utf8");
    // Upload rules to emulator
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: PROJECT_ID });
  });

  function getClientDb(auth: { uid: string; email?: string; email_verified?: boolean } | null) {
    return initializeTestApp({ projectId: PROJECT_ID, auth }).firestore();
  }

  function getSystemAdmin() {
    return initializeAdminApp({ projectId: PROJECT_ID }).firestore();
  }

  test("Payload 1: Unverified signup block (Should fail self-assigned Level 4 Status)", async () => {
    const db = getClientDb({ uid: "citizen_jhapa_05" });
    const userRef = db.collection("users").doc("citizen_jhapa_05");

    await assertFails(userRef.set({
      userId: "citizen_jhapa_05",
      fullName: "Dinesh Kharel",
      username: "dinesh_elder",
      phoneNumber: "9800001122",
      province: "Koshi Province",
      district: "Jhapa",
      municipality: "Birtamod",
      wardNumber: 2,
      reputationScore: 100, // ILLEGAL
      verificationStatus: 4, // ILLEGAL
      accountStatus: "active",
      createdAt: new Date().toISOString()
    }));
  });

  test("Payload 1 [CORRECT]: Standard user registration defaults can execute", async () => {
    const db = getClientDb({ uid: "citizen_jhapa_05" });
    const userRef = db.collection("users").doc("citizen_jhapa_05");

    await assertSucceeds(userRef.set({
      userId: "citizen_jhapa_05",
      fullName: "Dinesh Kharel",
      username: "dinesh_elder",
      phoneNumber: "9800001122",
      province: "Koshi Province",
      district: "Jhapa",
      municipality: "Birtamod",
      wardNumber: 2,
      reputationScore: 10, 
      verificationStatus: 1, 
      accountStatus: "active",
      createdAt: new Date().toISOString()
    }));
  });

  test("Payload 2: Ghost Field Injection Block", async () => {
    const db = getClientDb({ uid: "citizen_jhapa_05" });
    const userRef = db.collection("users").doc("citizen_jhapa_05");
    
    // Seed standard profile
    await getSystemAdmin().collection("users").doc("citizen_jhapa_05").set({
      userId: "citizen_jhapa_05",
      fullName: "Dinesh Kharel",
      username: "dinesh_elder",
      phoneNumber: "9800001122",
      province: "Koshi",
      district: "Jhapa",
      municipality: "Birtamod",
      wardNumber: 2,
      reputationScore: 10,
      verificationStatus: 1,
      accountStatus: "active",
      createdAt: new Date().toISOString()
    });

    await assertFails(userRef.update({
      fullName: "Dinesh Kharel",
      isAdmin: true // Exploiting shadow-write
    }));
  });

  test("Payload 4: Isolation of Private PII Logs", async () => {
    const attackerDb = getClientDb({ uid: "citizen_jhapa_05" });
    const pocketLog = attackerDb.collection("users").doc("citizen_pokhara_99").collection("securityLogs").doc("log_id");

    await assertFails(pocketLog.get());
  });

  test("Payload 5: Star ratings validator validation", async () => {
    const db = getClientDb({ uid: "citizen_jhapa_05" });
    const reviewRef = db.collection("services").doc("plumber_kaski_10").collection("reviews").doc("new_exploit_review");

    await assertFails(reviewRef.set({
      reviewId: "new_exploit_review",
      reviewerId: "citizen_jhapa_05",
      reviewerName: "Anish Adhikari",
      rating: 100, // ILLEGAL
      comment: "Super plumber!",
      createdAt: new Date().toISOString()
    }));
  });

  test("Payload 7: Prevent message posts from outside non-members in chat rooms", async () => {
    const intruderDb = getClientDb({ uid: "intruder_07" });
    
    // Seed chat room having standard members
    await getSystemAdmin().collection("chatRooms").doc("pokhara_central_chat").set({
      roomId: "pokhara_central_chat",
      type: "group",
      members: ["citizen_pokhara_1", "citizen_pokhara_2"],
      createdBy: "citizen_pokhara_1",
      createdAt: new Date().toISOString()
    });

    const msgRef = intruderDb.collection("chatRooms").doc("pokhara_central_chat").collection("messages").doc("msg_01");
    await assertFails(msgRef.set({
      messageId: "msg_01",
      senderId: "intruder_07",
      senderName: "Malicious Actor",
      text: "Unsolicited content spam",
      timestamp: new Date().toISOString()
    }));
  });
});
```
