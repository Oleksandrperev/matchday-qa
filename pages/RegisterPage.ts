import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly heading: Locator;
  readonly requestSummary: Locator;
  readonly googleButton: Locator;
  readonly emailButton: Locator;
  readonly loginLink: Locator;
  readonly backButton: Locator;
  readonly dateSummary: Locator;
  readonly timeSummary: Locator;
  readonly locationSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByText(/almost there/i);
    this.requestSummary = page.getByText(/your request/i);
    this.googleButton = page.getByRole('button', { name: /continue with google/i });
    this.emailButton = page.getByRole('button', { name: /continue with email/i });
    this.loginLink = page.getByRole('link', { name: /log in/i });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.dateSummary = page.getByText('Date').locator('..');
    this.timeSummary = page.getByText('Time').locator('..');
    this.locationSummary = page.getByText('Location').locator('..');
  }

  async goto() {
    await this.navigate('/register');
  }

  async clickGoogle() {
    await this.googleButton.click();
  }

  async clickEmail() {
    await this.emailButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.googleButton).toBeVisible();
    await expect(this.emailButton).toBeVisible();
  }

  async verifyRequestSummaryVisible() {
    await expect(this.requestSummary).toBeVisible();
  }
}
