import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LandingPage extends BasePage {
  readonly wantToPlayButton: Locator;
  readonly needPlayersButton: Locator;
  readonly loginLink: Locator;
  readonly appTitle: Locator;
  readonly tagline: Locator;
  readonly activePlayers: Locator;
  readonly gamesWeekly: Locator;

  constructor(page: Page) {
    super(page);
    this.wantToPlayButton = page.getByRole('button', { name: /want to play/i });
    this.needPlayersButton = page.getByRole('button', { name: /need players/i });
    this.loginLink = page.getByRole('link', { name: /log in/i });
    this.appTitle = page.getByText('MatchDay');
    this.tagline = page.getByText(/find local soccer games/i);
    this.activePlayers = page.getByText('500+');
    this.gamesWeekly = page.getByText('50+');
  }

  async goto() {
    await this.navigate('/');
  }

  async clickWantToPlay() {
    await this.wantToPlayButton.click();
  }

  async clickNeedPlayers() {
    await this.needPlayersButton.click();
  }

  async clickLogin() {
    await this.loginLink.click();
  }

  async verifyPageLoaded() {
    await expect(this.appTitle).toBeVisible();
    await expect(this.wantToPlayButton).toBeVisible();
    await expect(this.needPlayersButton).toBeVisible();
  }
}
