import { Page } from '@playwright/test';

export async function waitForNavigation(page: Page, url: string, timeout = 5000) {
  await page.waitForURL(url, { timeout });
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}
