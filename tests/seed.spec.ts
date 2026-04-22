import { test, expect } from '@playwright/test';

test('seed — landing page loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveURL('http://localhost:5173/');
  await expect(page.getByText('PickupSub')).toBeVisible();
});
