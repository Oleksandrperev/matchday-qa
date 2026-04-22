// spec: specs/smoke-test.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should verify core navigation flow', async ({ page }) => {
    // 1. Open http://localhost:5173
    await page.goto('http://localhost:5173');
    await expect(page.getByRole('heading', { name: 'MatchDay' })).toBeVisible();
    await expect(page.getByText('Find local soccer games in Washington')).toBeVisible();

    // 2. Verify the 'Want to play' button is visible on the page
    await expect(page.getByRole('button', { name: 'soccer ball Want to play Find' })).toBeVisible();

    // 3. Verify the 'Need players' button is visible on the page
    await expect(page.getByRole('button', { name: 'soccer ball Need players Post' })).toBeVisible();

    // 4. Click the 'Want to play' button
    await page.getByRole('button', { name: 'soccer ball Want to play Find' }).click();
    await expect(page).toHaveURL('http://localhost:5173/want-to-play');

    // 5. Click the browser back button
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
