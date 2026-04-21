/**
 * Planner Agent
 * Reads user stories and plans test scenarios
 */

export interface TestScenario {
  id: string;
  storyId: string;
  title: string;
  steps: string[];
  expectedResult: string;
  priority: 'high' | 'medium' | 'low';
}

export const testPlans: TestScenario[] = [
  {
    id: 'TP-001',
    storyId: 'US-001',
    title: 'New user sees landing page with two action buttons',
    steps: [
      'Navigate to /',
      'Verify MatchDay title is visible',
      'Verify Want to Play button is visible',
      'Verify Need Players button is visible',
      'Verify Login link is visible',
    ],
    expectedResult: 'All elements visible on landing page',
    priority: 'high',
  },
  {
    id: 'TP-002',
    storyId: 'US-010',
    title: 'Player fills Want to Play form with valid data',
    steps: [
      'Navigate to /want-to-play',
      'Select Today for date',
      'Select Afternoon for time range',
      'Select North Seattle for location',
      'Select Midfielder for position',
      'Select Intermediate for skill level',
      'Click Find a Game button',
    ],
    expectedResult: 'User navigated to /register with form data preserved',
    priority: 'high',
  },
  {
    id: 'TP-003',
    storyId: 'US-011',
    title: 'Form validation triggers on empty submit',
    steps: [
      'Navigate to /want-to-play',
      'Click Find a Game without filling any fields',
      'Verify error messages appear',
    ],
    expectedResult: 'All required field errors displayed in red',
    priority: 'high',
  },
  {
    id: 'TP-004',
    storyId: 'US-012',
    title: 'Registration screen shows correct request summary',
    steps: [
      'Complete Want to Play form',
      'Submit form',
      'Verify registration screen shows Almost there heading',
      'Verify request summary card shows correct data',
      'Verify Google and Email buttons visible',
    ],
    expectedResult: 'Registration screen shows all elements with correct data',
    priority: 'high',
  },
  {
    id: 'TP-005',
    storyId: 'E2E',
    title: 'Full user journey from landing to confirmation',
    steps: [
      'Start at landing page',
      'Click Want to Play',
      'Fill complete form',
      'Submit form',
      'Click Continue with Google',
      'Verify confirmation screen',
    ],
    expectedResult: "User completes full flow and sees You're in! confirmation",
    priority: 'high',
  },
];

export class PlannerAgent {
  getPlansForStory(storyId: string): TestScenario[] {
    return testPlans.filter(plan => plan.storyId === storyId);
  }

  getHighPriorityPlans(): TestScenario[] {
    return testPlans.filter(plan => plan.priority === 'high');
  }

  printPlan(scenario: TestScenario): void {
    console.log(`\n📋 Test Plan: ${scenario.id}`);
    console.log(`Story: ${scenario.storyId}`);
    console.log(`Title: ${scenario.title}`);
    console.log(`Priority: ${scenario.priority.toUpperCase()}`);
    console.log(`Steps:`);
    scenario.steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
    console.log(`Expected: ${scenario.expectedResult}`);
  }
}
