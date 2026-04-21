import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  readonly heading: Locator;
  readonly requestSummary: Locator;
  readonly browseGamesButton: Locator;
  readonly backToHomeButton: Locator;
  readonly notificationInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByText(/you're in/i);
    this.requestSummary = page.getByText(/your request/i);
    this.browseGamesButton = page.getByRole('button', { name: /browse available games/i });
    this.backToHomeButton = page.getByRole('button', { name: /back to home/i });
    this.notificationInfo = page.getByText(/notifications sent to/i);
  }

  async goto() {
    await this.navigate('/request-confirmed');
  }

  async clickBrowseGames() {
    await this.browseGamesButton.click();
  }

  async clickBackToHome() {
    await this.backToHomeButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.browseGamesButton).toBeVisible();
    await expect(this.backToHomeButton).toBeVisible();
  }
}
