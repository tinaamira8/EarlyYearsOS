import { test, expect } from '@playwright/test';

const navigationGroups = [
  ['Home', ['Dashboard', 'Reception Kiosk', 'Director Office', 'Director General']],
  ['Children & Families', ['Daily Care', 'Child Portfolio', 'Medical Manager', 'Medication Log', 'Sleep Tracker', 'Child Protection', 'Inclusion Support', 'School Readiness', 'Transition Statements', 'Waitlist Manager', 'Enrolment Manager', 'Parent Portal', 'Parent Messages', 'Family Audit Log']],
  ['Curriculum & Learning', ['Observations', 'Digital Journal', 'Activity Planner', 'Activity Library', 'Planning Cycle', 'Curriculum Board', 'EYLF Reference', 'Development Report', 'Goal Planner (QIP)', 'Critical Reflection', 'Philosophy Builder', 'Routine Manager']],
  ['Staff & HR', ['Staff Roster', 'Staff Qualifications', 'Staff Onboarding', 'PD Portfolio', 'Required Training', 'Wellbeing Trends', 'Professional Standards', 'Code of Conduct']],
  ['Compliance & Safety', ['NQS Overview', 'Assessment Rating', 'Compliance Alerts', 'Health Compliance', 'Safety Center', 'Walkthrough Checklist', 'Risk Assessment', 'Incident Reports', 'Emergency Hub', 'Policy Portal', 'Legal']],
  ['Operations', ['Room Manager', 'Floor Plan', 'Operational Log', 'Maintenance Log', 'Excursion Manager', 'Resource Booking', 'Occupancy Analytics', 'Occupancy Dashboard', 'Chef Station', 'Inventory Manager', 'Asset Register']],
  ['Finance', ['Invoicing System', 'Expense Tracker', 'CCS Estimator', 'Revenue Forecasting']],
  ['Community & Marketing', ['Newsletter', 'Marketing Studio', 'Community Hub', 'Cultural Audit', 'Green Audit', 'Sustainability Tracker']],
  ['AI & Tools', ['AI Assistant', 'Media Studio', 'Observation Writer']],
  ['Admin', ['User Settings', 'System Audit Log']],
] as const;

test('every sidebar feature renders without a runtime failure', async ({ page }) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome to EarlyYearsOS' })).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });

  for (const [group, items] of navigationGroups) {
    const firstItem = navigation.getByRole('button', { name: items[0], exact: true });
    if (!(await firstItem.isVisible())) {
      await navigation.getByRole('button', { name: group, exact: true }).click();
      await expect(firstItem).toBeVisible();
    }

    for (const item of items) {
      await test.step(item, async () => {
        await navigation.getByRole('button', { name: item, exact: true }).click();
        const main = page.locator('main');
        await expect(main).not.toContainText('Something went wrong.');
        await expect(main.getByRole('heading').first()).toBeVisible();
        expect((await main.innerText()).trim().length, `${item} should render meaningful content`).toBeGreaterThan(20);
      });
    }
  }

  expect(pageErrors).toEqual([]);
});
