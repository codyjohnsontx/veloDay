# VeloDay

VeloDay is a bike-native classified marketplace prototype for high-value used bicycles, frames, and wheelsets. The product focuses on trust-heavy listing details: condition, service history, serial verification, provenance, transaction mode, and seller analytics.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn-style UI primitives
- lucide-react icons
- Local typed mock data

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://127.0.0.1:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
```

## Prototype Scope

The current app is a clickable front-end MVP. It includes:

- Marketplace home/search surface
- Bike-native search filters
- Listing detail pages
- Guided sell/listing wizard
- Seller dashboard
- Saved searches
- Message and offer thread mockup

The app does not yet include real authentication, database persistence, payments, shipping labels, moderation tooling, or external serial/theft-check integrations.

## Project Structure

```text
app/          App Router pages and global styles
components/   Reusable UI and marketplace components
lib/          Domain types, mock data, and formatting utilities
public/       Static assets
```

## Validation

Run the production build before pushing changes:

```bash
npm run build
```
