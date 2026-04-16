# Build Prompt: Bike Classified Marketplace Clickable MVP

You are implementing a polished clickable MVP for a bicycle classified marketplace. Treat `deep-research-report.md` as the source-of-truth product brief and build the first realistic product surface from it.

## Goal

Build a web-first, US-focused marketplace prototype for complete bikes, frames, and premium wheelsets. The app should feel like a real bike-native transaction marketplace, not a generic classifieds board or SaaS landing page.

The core product thesis from the report is:

- High-value used-bike listings should read like service records, not forum posts.
- Provenance, serial verification, service history, condition, pricing intelligence, and transaction mode should be first-class product concepts.
- The marketplace should support browsing, trust evaluation, listing creation, seller analytics, saved searches, and message/offer workflows in a cohesive UI.

## Stack

Replace the current minimal Vite scaffold with a Next.js TypeScript app.

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react icons
- Local typed mock data

Do not build a production backend in this pass. Represent backend-dependent behavior with typed mock data and realistic UI states.

## Product Scope

Build a clickable MVP, not a complete production marketplace.

Include these screens and flows:

- Marketplace home/search surface
- Search results with bike-native filters
- Listing detail page
- Guided sell/listing wizard
- Seller dashboard
- Saved searches page or panel
- Message/offer thread mockup

Defer these to later:

- Real authentication
- Real payments
- Real shipping-label generation
- Real database persistence
- Real moderation tooling
- Real serial theft-check integrations
- Real image upload/storage
- Real email/SMS notifications
- Native mobile apps

The app can fake state locally where useful, but the UI should make the intended product behavior obvious.

## UX Direction

Prioritize a premium, dense, practical marketplace interface.

Do:

- Start users on a browsable marketplace surface, not a marketing-only landing page.
- Use restrained color, strong typography, clean spacing, and clear hierarchy.
- Make bike data scannable: price, size, category, condition, location, seller trust, transaction modes, service recency, and serial/provenance status.
- Use icons for trust, location, saved search, comparison, messages, offer actions, and seller analytics.
- Make filters feel useful and bike-specific.
- Keep copy short and product-oriented.
- Use cards only for actual listings, repeated result items, or contained interactive widgets.

Avoid:

- Generic SaaS hero sections.
- Decorative dashboard mosaics that do not help users browse or decide.
- Purple/blue gradient-heavy styling.
- Large blocks of explanatory text in the UI.
- Fake backend claims such as "payment complete" unless clearly represented as prototype state.

## Core Data Model

Create TypeScript types for at least:

```ts
type ListingCategory = "complete-bike" | "frame" | "wheelset";
type TransactionMode = "local-pickup" | "managed-shipping" | "inspection-partner";
type SellerType = "private" | "shop" | "consignment" | "certified-partner";
type VerificationState = "unverified" | "pending" | "verified";
type ConditionGrade = "excellent" | "very-good" | "good" | "fair";

interface BikeModel {
  id: string;
  brand: string;
  modelFamily: string;
  modelName: string;
  modelYear: number;
  discipline: "road" | "gravel" | "mountain" | "triathlon" | "commuter" | "e-bike";
}

interface ConditionReport {
  overallGrade: ConditionGrade;
  structuralFlag: "clear" | "disclosed-issue" | "inspection-recommended";
  estimatedMiles?: number;
  lastMajorService?: string;
  serviceNotes: string[];
  defectTags: string[];
}

interface ProvenanceRecord {
  ownershipType: "original-owner" | "second-owner" | "shop-owned" | "demo" | "race" | "rental";
  proofOfPurchase: VerificationState;
  commercialUse: boolean;
  accidentDisclosed: boolean;
}

interface SerialVerification {
  state: VerificationState;
  maskedSerial: string;
  theftCheckStatus: "clear" | "pending" | "not-checked";
  verificationMethod: "seller-entry" | "receipt-match" | "inspection-partner";
}

interface SellerProfile {
  id: string;
  name: string;
  sellerType: SellerType;
  location: string;
  verifiedIdentity: boolean;
  reviewScore: number;
  reviewCount: number;
  responseRate: number;
  accountAgeMonths: number;
}

interface BikeListing {
  id: string;
  category: ListingCategory;
  title: string;
  model: BikeModel;
  seller: SellerProfile;
  price: number;
  originalMsrp?: number;
  dealScore: "below-market" | "fair" | "premium";
  frameSize?: string;
  riderHeightRange?: string;
  wheelSize?: string;
  frameMaterial?: string;
  drivetrain?: string;
  brakes?: string;
  suspension?: string;
  condition: ConditionReport;
  provenance: ProvenanceRecord;
  serial: SerialVerification;
  transactionModes: TransactionMode[];
  location: string;
  shipsTo?: string;
  daysOnMarket: number;
  views: number;
  saves: number;
  inquiries: number;
  heroImage: string;
  gallery: string[];
}

interface Offer {
  id: string;
  listingId: string;
  buyerName: string;
  amount: number;
  status: "open" | "countered" | "accepted" | "declined";
  lastMessage: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, string | number | boolean>;
  resultCount: number;
  alertFrequency: "instant" | "daily" | "weekly";
}
```

Expand these types only when the UI needs it.

## Mock Data

Seed the app with realistic inventory:

- At least 8 complete bikes
- At least 3 frames
- At least 3 premium wheelsets
- A mix of private sellers, shops, consignment sellers, and certified partners
- A mix of local pickup, managed shipping, and inspection-partner listings
- A mix of serial/provenance states so trust UI has meaningful variation

Use realistic brand/model examples, sizes, prices, and service notes. Avoid placeholder copy like "lorem ipsum" or "bike title."

Use remote image URLs from stable public sources or local generated placeholders with realistic alt text. Images should be visually appropriate for bicycles or cycling gear.

## Screen Requirements

### Marketplace Home/Search

The initial screen should be a real marketplace working surface.

Include:

- Search input
- Category switcher for complete bikes, frames, wheelsets
- Featured listings or newest trusted listings
- Key quick filters such as size, discipline, price, and transaction mode
- A compact trust/value explanation anchored in product UI, not marketing prose

### Search Results

Include:

- Listing grid or list with clear comparison data
- Desktop filter rail and mobile filter drawer
- Filters for discipline, category, frame size, wheel size, material, condition, verified serial, proof of purchase, seller type, local radius, transaction mode, and price
- Sort controls for recommended, newest, price, deal score, and days on market
- Active filter chips
- Empty state when filters produce no results

Filters should visibly affect the displayed results.

### Listing Detail

Include:

- Large image area with gallery thumbnails
- Price, title, location, seller profile, and transaction modes
- Bike spec snapshot
- Condition report with service notes and defect tags
- Provenance panel
- Serial verification panel with masked serial
- Trust graph/badges visible near the purchase decision
- Offer, message seller, save, and compare actions
- Seller responsiveness and review summary

### Sell Wizard

Create a guided multi-step flow.

Steps:

1. Identify bike
2. Specs and components
3. Condition and defects
4. Serial and provenance
5. Pricing assistant
6. Shipping or pickup
7. Preview and publish

The wizard does not need real persistence, but the UI should show progress, required fields, example inputs, and a realistic preview.

### Seller Dashboard

Include:

- Listings overview
- Views, saves, inquiries, and offer conversion metrics
- Price-position indicator or market-comparison cue
- Listing status
- Recent offers/messages
- Suggested actions such as lower price, add proof of purchase, or enable managed shipping

### Saved Searches

Include:

- Saved filter sets
- Alert frequency
- Result counts
- Quick actions to open, pause, or edit alerts

### Message/Offer Thread

Include:

- A buyer/seller conversation mockup
- Offer amount and status
- Counteroffer action
- Trust reminders such as using platform checkout or verified pickup
- Clear transaction timeline state

## Routing

Use App Router routes similar to:

- `/`
- `/search`
- `/listing/[id]`
- `/sell`
- `/dashboard`
- `/saved-searches`
- `/messages/[threadId]`

If implementation time is limited, keep routes simple and share components, but all listed flows should be reachable by clicking through the app.

## Component Guidance

Create reusable components where they reduce duplication:

- Listing card
- Filter rail
- Trust badge
- Condition summary
- Provenance summary
- Serial verification summary
- Seller mini-profile
- Metric tile
- Wizard stepper
- Offer thread panel

Keep components typed and avoid unnecessary abstraction.

## Styling Guidance

Use Tailwind CSS and shadcn/ui primitives.

Recommended visual direction:

- Calm off-white or light neutral app background
- Deep green or ink as the primary text/action color
- A restrained safety/accent color for trust and verification states
- Subtle borders instead of heavy shadows
- Compact tables/lists where density helps comparison
- Responsive layouts that are useful on mobile, not merely stacked

Text must not overflow in buttons, cards, filters, or listing cards.

## Acceptance Criteria

The implementation is complete when:

- `npm run build` passes.
- The app uses TypeScript rather than JSX-only React files.
- The homepage/search surface, search results, listing detail, sell wizard, seller dashboard, saved searches, and message/offer thread are reachable.
- Search filters visibly affect listing results.
- Listing detail exposes condition, service history, provenance, serial verification, and seller trust as first-class sections.
- The sell wizard includes all seven required steps.
- Mock data is typed and realistic.
- The UI works on desktop and mobile widths without obvious clipping or overlap.
- No production-only backend behavior is implied as functional unless it is clearly mock/prototype state.

## Suggested Implementation Order

1. Replace the Vite scaffold with a fresh Next.js TypeScript setup.
2. Add Tailwind CSS, shadcn/ui, and lucide-react.
3. Create the typed mock data and shared domain types.
4. Build the marketplace shell, navigation, and responsive layout.
5. Build search results and filtering.
6. Build listing detail and trust/provenance sections.
7. Build sell wizard.
8. Build dashboard, saved searches, and message/offer views.
9. Run `npm run build` and fix TypeScript/layout issues.
10. Start the dev server and provide the local URL.
