/**
 * Healer Agent
 * Detects broken selectors and suggests fixes
 */

import { Page } from '@playwright/test';

export interface HealResult {
  originalSelector: string;
  isWorking: boolean;
  suggestedFix?: string;
  confidence: 'high' | 'medium' | 'low';
}

export class HealerAgent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkSelector(selector: string): Promise<HealResult> {
    try {
      const element = this.page.locator(selector);
      const count = await element.count();

      if (count > 0) {
        return {
          originalSelector: selector,
          isWorking: true,
          confidence: 'high',
        };
      }

      const suggestion = await this.suggestAlternative(selector);
      return {
        originalSelector: selector,
        isWorking: false,
        suggestedFix: suggestion,
        confidence: 'medium',
      };
    } catch {
      return {
        originalSelector: selector,
        isWorking: false,
        suggestedFix: undefined,
        confidence: 'low',
      };
    }
  }

  private async suggestAlternative(brokenSelector: string): Promise<string> {
    const textMatch = brokenSelector.match(/text=["'](.+)["']/);
    if (textMatch) {
      return `getByText('${textMatch[1]}', { exact: false })`;
    }

    const roleMatch = brokenSelector.match(/role=["'](.+)["']/);
    if (roleMatch) {
      return `getByRole('${roleMatch[1]}')`;
    }

    return `// Could not auto-heal: ${brokenSelector} — please update manually`;
  }

  async healSelectors(selectors: string[]): Promise<HealResult[]> {
    const results: HealResult[] = [];
    for (const selector of selectors) {
      const result = await this.checkSelector(selector);
      results.push(result);
      if (!result.isWorking) {
        console.log(`🔧 Broken selector detected: ${selector}`);
        if (result.suggestedFix) {
          console.log(`💡 Suggested fix: ${result.suggestedFix}`);
        }
      }
    }
    return results;
  }

  async runHealthCheck(selectors: string[]): Promise<void> {
    console.log('\n🏥 Running selector health check...');
    const results = await this.healSelectors(selectors);
    const broken = results.filter(r => !r.isWorking);
    const working = results.filter(r => r.isWorking);
    console.log(`\n✅ Working: ${working.length}`);
    console.log(`❌ Broken: ${broken.length}`);
    if (broken.length === 0) {
      console.log('🎉 All selectors healthy!');
    }
  }
}
