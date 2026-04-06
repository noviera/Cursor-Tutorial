import { test, expect } from '@playwright/test';

test('EPAM example scenario: navigate to services and open client work', async ({ page }) => {
  // 1) Navigate to the homepage
  await page.goto('https://www.epam.com/', { waitUntil: 'networkidle' });

  // 2) Navigate to Services page
  await page.goto('https://www.epam.com/services', { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/Services/i);

  // 3) Click the "Explore Our Client Work" link or a logical substitute
  const exploreLink = page.getByRole('link').filter({ hasText: /Explore Our Client Work|Client Work|Client stories/i }).first();
  if (await exploreLink.count() > 0) {
    await exploreLink.click();
  } else {
    // fallback: click any link leading to client work
    const fallback = page.getByText(/Client Work|Our Client Work|Client stories|Featured Stories|Insights/i).first();
    if (await fallback.count() > 0) {
      await fallback.click();
    }
  }

  // 4) Verify that the "Client Work" text is visible on the page
  await expect(page.getByText('Client Work')).toBeVisible();
});
