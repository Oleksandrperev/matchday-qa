# MatchDay Smoke Test Plan

## Application Overview

Smoke test plan for the MatchDay app at http://localhost:5173. MatchDay is a React SPA that helps users find local soccer games in Washington. The landing page presents two primary navigation options: "Want to play" (find a game) and "Need players" (post a game). This smoke test verifies the core navigation flow is functional.

## Test Scenarios

### 1. Smoke Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. should verify core navigation flow

**File:** `tests/smoke/smoke.spec.ts`

**Steps:**
  1. Open http://localhost:5173
    - expect: The MatchDay landing page is displayed with the heading 'MatchDay' and the tagline 'Find local soccer games in Washington'
  2. Verify the 'Want to play' button is visible on the page
    - expect: A button containing the text 'Want to play' and the subtitle 'Find a game near you' is visible on the landing page
  3. Verify the 'Need players' button is visible on the page
    - expect: A button containing the text 'Need players' and the subtitle 'Post a game, find subs' is visible on the landing page
  4. Click the 'Want to play' button
    - expect: The user is redirected to the /want-to-play page
    - expect: The page URL changes to http://localhost:5173/want-to-play
  5. Click the browser back button
    - expect: The user is redirected back to the landing page
    - expect: The page URL changes back to http://localhost:5173/
