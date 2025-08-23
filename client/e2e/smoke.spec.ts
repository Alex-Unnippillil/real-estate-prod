import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('landing page loads @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        name: /Start your journey to finding the perfect place to call home/i,
      }),
    ).toBeVisible();
  });

  test('search page loads @smoke', async ({ page }) => {
    await page.route('**/properties**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/search?location=New%20York&lat=40.73061&lng=-73.935242');
    await expect(page).toHaveURL(/search/);
  });
});
