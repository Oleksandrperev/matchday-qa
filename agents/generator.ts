/**
 * Generator Agent
 * Auto-generates test code templates from test plans
 */

import { TestScenario } from './planner';

export class GeneratorAgent {
  generateTestCode(scenario: TestScenario): string {
    const steps = scenario.steps
      .map(step => `    // ${step}\n    await page.waitForTimeout(500);`)
      .join('\n');

    return `
test('${scenario.title}', async ({ page }) => {
${steps}
  // Verify: ${scenario.expectedResult}
});
    `.trim();
  }

  generateSpecFile(scenarios: TestScenario[], suiteName: string): string {
    const tests = scenarios.map(s => this.generateTestCode(s)).join('\n\n');

    return `
import { test, expect } from '@playwright/test';

test.describe('${suiteName}', () => {
${tests}
});
    `.trim();
  }

  logGenerated(scenario: TestScenario): void {
    console.log(`\n⚡ Generated test for: ${scenario.title}`);
    console.log(this.generateTestCode(scenario));
  }
}
