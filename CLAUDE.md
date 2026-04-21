# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Type-check without emitting
npx tsc --noEmit

# Run all tests (requires MatchDay app running at ../soccer)
npm test

# Run a single spec file
npx playwright test landing.spec.ts

# Run a single test by title
npx playwright test -g "should display MatchDay title"

# Run with browser visible
npm run test:headed

# Interactive UI mode
npm run test:ui

# Debug a specific test
npm run test:debug

# Open last HTML report
npm run test:report

# Mobile browsers only
npm run test:mobile
```

## Architecture

### App Under Test
MatchDay is a React SPA at `http://localhost:5173`. The QA repo expects the app repo to live at `../soccer` (sibling directory). The Playwright `webServer` config starts `npm run dev` from that path automatically during local runs; in CI, the app is checked out to `./soccer`.

### Page Object Model
All POMs extend `BasePage` (`pages/BasePage.ts`), which holds the `Page` instance and shared helpers (`navigate`, `waitForPageLoad`, `takeScreenshot`). Each page class declares all its `Locator` fields as `readonly` in the constructor and exposes high-level action methods (`fillCompleteForm`, `verifyPageLoaded`, etc.) so tests stay readable.

### Test Flow Dependency
The registration and e2e tests have a hard prerequisite on the Want-to-Play form: `registration.spec.ts` and `e2e-flow.spec.ts` navigate through `/want-to-play` in `beforeEach` to reach `/register`. Direct navigation to `/register` without prior form state may not work depending on app routing.

### AI Agents (`agents/`)
Three utility classes, not Playwright tests:
- **PlannerAgent** — holds `testPlans[]` mapping user story IDs to step-by-step scenarios; use `getPlansForStory(storyId)` to query.
- **GeneratorAgent** — takes a `TestScenario` and produces a Playwright test code string scaffold.
- **HealerAgent** — instantiated with a `Page` object; `runHealthCheck(selectors[])` probes each selector and logs broken ones with suggested Playwright-idiomatic alternatives.

### Test Data
`test-data/formData.ts` exports `validFormData` (used across all form/registration/e2e specs) and `minimalFormData`. The `location` and `timeRange` values (`'north-seattle'`, `'afternoon'`, etc.) must match the actual `<option value="">` attributes in the app's dropdowns.

### CI
GitHub Actions (`.github/workflows/playwright.yml`) checks out both repos, installs deps for each, then runs chromium-only. The `matchday` app repo is `Oleksandrperev/matchday` and is cloned into `./soccer` so the `webServer.cwd: '../soccer'` path resolves correctly relative to the QA project root.

## Current Status
- ✅ Project setup complete
- ✅ Page Object Models created (BasePage, LandingPage, WantToPlayPage, RegisterPage, ConfirmationPage)
- ✅ AI Agents created (Planner, Generator, Healer)
- ✅ GitHub Actions CI/CD configured
- ⬜ Tests — to be written

## Test Files Status
tests/ directory is currently empty.
Tests will be written manually following POM structure.

## App Under Test — Current Screens
| Route | Status |
|---|---|
| `/` | ✅ Built |
| `/want-to-play` | ✅ Built |
| `/register` | ✅ Built |
| `/register/email` | ✅ Built |
| `/request-confirmed` | ✅ Built |
| `/need-players` | ⬜ Placeholder |
| `/login` | ⬜ Placeholder |
| `/games` | ⬜ Placeholder |