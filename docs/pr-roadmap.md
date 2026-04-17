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
- Add client-side validation with clear error messages for required fields and format constraints, including positive price values and serial number format.
- Add a publish-readiness checklist for bike identity, condition, serial, provenance, price, and transaction mode.
- Keep publish as prototype-only state.

Acceptance:

- User input visibly changes the preview.
- Visible validation feedback appears in the live preview for invalid or incomplete fields.
- Invalid entries block publish-readiness scoring until the validation rules pass.
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

- Support local-storage-backed saved listing state.
- Enable selection to compare up to three listings.
- Provide a comparison view or panel highlighting key spec and trust differences.

Acceptance:

- Saved and compare state survives refresh.
- Compare handles add/remove and max-selection states.
- `npm run build` passes.

## Slice 6: Image, Data, and Accessibility Quality Pass

Goal: remove remaining generic media, make inventory presentation more credible, and verify baseline accessibility.

Deliverables:

- Replace unsuitable remote images with local assets or curated cycling-specific sources.
- Add alt text that describes the listed item type.
- Review mock listings for unrealistic or inconsistent field values.
- Verify keyboard navigation across listing cards, filters, wizard steps, saved searches, and message actions.
- Check color contrast against WCAG AA expectations for text, badges, controls, and status states.
- Add or refine ARIA labels for complex components such as filters, the future compare panel, and wizard navigation.
- Run a screen reader pass for search, listing detail, sell wizard, and dashboard flows.

Acceptance:

- No listing card shows obviously unrelated product imagery.
- Keyboard navigation works for the primary interactive flows.
- Text and control contrast meets WCAG AA expectations.
- Complex components include appropriate accessible names and ARIA labels.
- `npm run build` passes.

## Slice 7: Testing Strategy

Goal: add automated test coverage before deployment prep so feature PRs have stronger regression protection after Slice 6 and before Slice 8.

Deliverables:

- Add unit tests for core filtering, formatting, and readiness-scoring logic.
- Add integration tests for search filters, saved listings, and compare behavior.
- Add end-to-end tests for critical flows: search to listing detail, sell wizard readiness, and offer thread navigation.
- Define practical coverage thresholds for the logic-heavy modules.
- Update CI so tests run on pull requests before the build check.

Acceptance:

- CI runs lint, tests, and build on pull requests.
- Test coverage thresholds are enforced for the selected logic modules.
- `npm run build` passes.

## Slice 8: Deployment Prep

Goal: make the app ready for Vercel deployment.

Deliverables:

- Add deployment notes to README.
- Confirm Next.js configuration works with Vercel defaults.
- Add production environment notes for future backend/API keys.

Acceptance:

- `npm run build` passes.
- README explains how to deploy the current static prototype.
