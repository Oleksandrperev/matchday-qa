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

### AI Agents
The `agents/` TypeScript classes have been replaced by three Claude subagents in `.claude/agents/`. They are invoked by Claude Code and use the `playwright-test` MCP server for live browser interaction:

- **`playwright-test-planner`** — navigates the live app, explores all UI, and saves a structured markdown test plan to `specs/` via `planner_save_plan`. Always calls `planner_setup_page` first.
- **`playwright-test-generator`** — takes a scenario from a saved plan, executes each step live via MCP tools, reads the generator log, then writes a single `.spec.ts` file via `generator_write_test`. Each generated test lives in a `test.describe` matching the plan group and references `tests/seed.spec.ts` as its seed.
- **`playwright-test-healer`** — runs all tests via `test_run`, debugs failures with `test_debug`, inspects snapshots and selectors, edits test files, and re-runs until green. Marks genuinely broken app behavior as `test.fixme()` with an explanatory comment rather than deleting the test.

### MCP Server
`.mcp.json` and `.vscode/mcp.json` both configure the `playwright-test` MCP server (`npx playwright run-test-mcp-server`). This server provides the `browser_*`, `planner_*`, `generator_*`, and `test_*` tools used by the subagents.

### Test Workflow
1. Run the **planner** agent on a route → plan saved to `specs/`
2. Run the **generator** agent for each scenario in the plan → `.spec.ts` files written to `tests/`
3. Run the **healer** agent if tests fail after app changes

### Test Data
`test-data/formData.ts` exports `validFormData` (used across form/registration/e2e specs) and `minimalFormData`. The `location` and `timeRange` values (`'north-seattle'`, `'afternoon'`, etc.) must match the actual `<option value="">` attributes in the app's dropdowns.

### CI
GitHub Actions (`.github/workflows/playwright.yml`) checks out both repos, installs deps for each, then runs chromium-only. The `matchday` app repo is `Oleksandrperev/matchday` and is cloned into `./soccer` so the `webServer.cwd: '../soccer'` path resolves correctly relative to the QA project root.

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