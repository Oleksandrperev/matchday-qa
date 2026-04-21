import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WantToPlayPage extends BasePage {
  readonly pageTitle: Locator;
  readonly backButton: Locator;
  readonly todayButton: Locator;
  readonly tomorrowButton: Locator;
  readonly pickDateButton: Locator;
  readonly timeRangeSelect: Locator;
  readonly locationSelect: Locator;
  readonly positionSelect: Locator;
  readonly beginnerButton: Locator;
  readonly intermediateButton: Locator;
  readonly advancedButton: Locator;
  readonly competitiveButton: Locator;
  readonly submitButton: Locator;
  readonly dateError: Locator;
  readonly timeError: Locator;
  readonly locationError: Locator;
  readonly skillError: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByText('Want to Play');
    this.backButton = page.getByRole('button', { name: /back/i });
    this.todayButton = page.getByRole('button', { name: /^today$/i });
    this.tomorrowButton = page.getByRole('button', { name: /^tomorrow$/i });
    this.pickDateButton = page.getByRole('button', { name: /pick a date/i });
    this.timeRangeSelect = page.getByRole('combobox', { name: /time/i });
    this.locationSelect = page.getByRole('combobox', { name: /location/i });
    this.positionSelect = page.getByRole('combobox', { name: /position/i });
    this.beginnerButton = page.getByRole('button', { name: /beginner/i });
    this.intermediateButton = page.getByRole('button', { name: /intermediate/i });
    this.advancedButton = page.getByRole('button', { name: /advanced/i });
    this.competitiveButton = page.getByRole('button', { name: /competitive/i });
    this.submitButton = page.getByRole('button', { name: /find a game/i });
    this.dateError = page.getByText(/please select when you want to play/i);
    this.timeError = page.getByText(/please select a time range/i);
    this.locationError = page.getByText(/please select your area/i);
    this.skillError = page.getByText(/please select your skill level/i);
  }

  async goto() {
    await this.navigate('/want-to-play');
  }

  async selectToday() {
    await this.todayButton.click();
  }

  async selectTomorrow() {
    await this.tomorrowButton.click();
  }

  async selectTimeRange(value: string) {
    await this.timeRangeSelect.selectOption(value);
  }

  async selectLocation(value: string) {
    await this.locationSelect.selectOption(value);
  }

  async selectPosition(value: string) {
    await this.positionSelect.selectOption(value);
  }

  async selectSkillLevel(level: 'beginner' | 'intermediate' | 'advanced' | 'competitive') {
    const buttons = {
      beginner: this.beginnerButton,
      intermediate: this.intermediateButton,
      advanced: this.advancedButton,
      competitive: this.competitiveButton,
    };
    await buttons[level].click();
  }

  async fillCompleteForm(data: {
    date: 'today' | 'tomorrow';
    timeRange: string;
    location: string;
    position?: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'competitive';
  }) {
    if (data.date === 'today') await this.selectToday();
    else await this.selectTomorrow();
    await this.selectTimeRange(data.timeRange);
    await this.selectLocation(data.location);
    if (data.position) await this.selectPosition(data.position);
    await this.selectSkillLevel(data.skillLevel);
  }

  async submit() {
    await this.submitButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.todayButton).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async verifyValidationErrors() {
    await expect(this.dateError).toBeVisible();
    await expect(this.timeError).toBeVisible();
    await expect(this.locationError).toBeVisible();
    await expect(this.skillError).toBeVisible();
  }
}
