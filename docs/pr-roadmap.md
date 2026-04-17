# VeloDay PR Roadmap

This roadmap breaks the next work into reviewable vertical slices. Each slice should ship as its own branch and PR with a passing `npm run build`.

## Slice 1: Review Infrastructure

Goal: make future PRs easy to review and automatically validate.

Deliverables:

- Add this PR roadmap.
- Add GitHub Actions build CI for install and production build.
- Keep the app behavior unchanged.

Acceptance:

- `npm run build` passes locally.
- A pull request gets a GitHub Actions build check.

## Slice 2: Product Identity Cleanup

Goal: make repo/package identity match the VeloDay brand.

Deliverables:

- Rename the package from `bike-classified` to `veloday`.
- Update README references to the local development URL and project name.
- Confirm app metadata and visible header use VeloDay.

Acceptance:

- `npm run build` passes.
- No visible references to the old placeholder project name remain in source files.

## Slice 3: Stateful Sell Wizard

Goal: turn the sell flow from static fields into a realistic listing builder.

Deliverables:

- Store wizard form state in React state.
- Update the live listing preview as fields change.
- Add a publish-readiness checklist for bike identity, condition, serial, provenance, price, and transaction mode.
- Keep publish as prototype-only state.

Acceptance:

- User input visibly changes the preview.
- Readiness score changes as required fields are completed.
- `npm run build` passes.

## Slice 4: URL-Backed Search Filters

Goal: make search filters shareable and easier to review.

Deliverables:

- Read initial search/filter state from URL query params.
- Update URL query params when filters change.
- Preserve current filtering behavior and empty state.

Acceptance:

- Refreshing `/search` keeps selected filters.
- Sharing a filtered URL reproduces the same result set.
- `npm run build` passes.

## Slice 5: Saved Listings and Compare Prototype

Goal: make buyer actions feel real without a backend.

Deliverables:

- Add local-storage backed saved listing state.
- Add compare selection for up to three listings.
- Add a compare view or panel with key spec/trust differences.

Acceptance:

- Saved and compare state survives refresh.
- Compare handles add/remove and max-selection states.
- `npm run build` passes.

## Slice 6: Image and Data Quality Pass

Goal: remove remaining generic media and make inventory presentation more credible.

Deliverables:

- Replace unsuitable remote images with local assets or curated cycling-specific sources.
- Add alt text that describes the listed item type.
- Review mock listings for unrealistic or inconsistent field values.

Acceptance:

- No listing card shows obviously unrelated product imagery.
- `npm run build` passes.

## Slice 7: Deployment Prep

Goal: make the app ready for Vercel deployment.

Deliverables:

- Add deployment notes to README.
- Confirm Next.js configuration works with Vercel defaults.
- Add production environment notes for future backend/API keys.

Acceptance:

- `npm run build` passes.
- README explains how to deploy the current static prototype.
