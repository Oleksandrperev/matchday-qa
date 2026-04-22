# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Type-check without emitting
npx tsc --noEmit

# Run all tests (requires MatchDay app running at ../soccer)
npm test

# Run smoke tests only
npx playwright test tests/smoke/smoke.spec.ts

# Run a single spec file
npx playwright test tests/landing.spec.ts

# Run a single test by title
npx playwright test -g "should verify core navigation flow"

# Run with browser visible
npm run test:headed

# Run in debug mode
npx playwright test --debug

# Interactive UI mode
npm run test:ui

# Open last HTML report
npx playwright show-report

# Mobile browsers only
npm run test:mobile

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Architecture

### App Under Test
MatchDay is a React SPA at `http://localhost:5173`. The QA repo expects the app repo to live at `../soccer` (sibling directory). The Playwright `webServer` config starts `npm run dev` from that path automatically during local runs; in CI, the app is checked out via GitHub Actions.

### Page Object Model
All POMs extend `BasePage` (`pages/BasePage.ts`), which holds the `Page` instance and shared helpers (`navigate`, `waitForPageLoad`, `takeScreenshot`). Each page class declares all its `Locator` fields as `readonly` in the constructor and exposes high-level action methods (`fillCompleteForm`, `verifyPageLoaded`, etc.) so tests stay readable.

Available Page Objects:
- `BasePage` — shared helpers and navigation
- `LandingPage` — landing page locators and actions
- `WantToPlayPage` — form locators, fill helpers, validation
- `RegisterPage` — registration screen locators
- `ConfirmationPage` — success screen locators

### Test Flow Dependency
The registration and e2e tests have a hard prerequisite on the Want-to-Play form: `registration.spec.ts` and `e2e-flow.spec.ts` navigate through `/want-to-play` in `beforeEach` to reach `/register`. Direct navigation to `/register` without prior form state may not work depending on app routing.

### AI Agents
Three official Playwright AI agents configured in `.claude/agents/` and `.vscode/agents/`. Invoked by Claude Code using the `playwright-test` MCP server:

- **`playwright-test-planner`** — navigates the live app, explores all UI, and saves a structured markdown test plan to `specs/`. Always call with a seed test and target route.
- **`playwright-test-generator`** — reads a plan from `specs/`, executes each step live, then writes `.spec.ts` files to `tests/`. Reference `tests/seed.spec.ts` as the seed.
- **`playwright-test-healer`** — runs failing tests, inspects snapshots, fixes broken selectors, re-runs until green. Marks genuinely broken app behavior as `test.fixme()`.

### Agent Workflow
```
1. Ask Planner  → explores live app → saves plan to specs/
2. Ask Generator → reads specs/ plan → writes tests/ spec files
3. Run tests    → npx playwright test
4. If failing   → ask Healer → auto-fixes broken selectors
```

### MCP Servers
Two MCP servers configured in `.mcp.json`:
- **`playwright-test`** — powers the Planner, Generator, Healer agents (`npx playwright run-test-mcp-server`)
- **`playwright`** — gives Claude Code direct browser control (`npx @playwright/mcp@latest`)

### Playwright CLI
Installed globally for token-efficient browser automation:
```bash
npm install -g @playwright/cli
playwright-cli open http://localhost:5173 --headed
```

### Test Data
`test-data/formData.ts` exports `validFormData` and `minimalFormData`. The `location` and `timeRange` values must match the actual `<option value="">` attributes in the app dropdowns.

### CI
Two GitHub Actions workflows protect both repos:

**matchday-qa repo** (`.github/workflows/playwright.yml`):
- Triggers on push and PR to main
- Checks out matchday app repo into `./soccer`
- Runs smoke tests on Chromium
- Branch protection active on main — merge blocked if tests fail

**matchday repo** (`.github/workflows/smoke-tests.yml`):
- Triggers on push and PR to main
- Checks out matchday-qa repo
- Starts app and runs smoke tests
- Branch protection active on main — merge blocked if tests fail

## Current Test Status

| Test File | Tests | Status |
|---|---|---|
| `tests/smoke/smoke.spec.ts` | 3 | ✅ Passing |
| `tests/landing.spec.ts` | - | ⬜ Not written yet |
| `tests/want-to-play.spec.ts` | - | ⬜ Not written yet |
| `tests/registration.spec.ts` | - | ⬜ Not written yet |
| `tests/e2e-flow.spec.ts` | - | ⬜ Not written yet |

## Test Plans (specs/)

| Plan File | Status |
|---|---|
| `specs/smoke-test.md` | ✅ Created by Planner |
| `specs/landing-page-plan.md` | ✅ Created by Planner (27 tests) |
| `specs/matchday-flows.md` | ⬜ Pending |

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

## Git Commit Convention
```
feat: description    # new feature
fix: description     # bug fix
chore: description   # maintenance
test: description    # adding tests
```