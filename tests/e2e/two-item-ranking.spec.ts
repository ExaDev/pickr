import { expect, test } from '@playwright/test';

test.describe('Two Item Ranking Flow', () => {
	test('should only require one comparison for two items', async ({ page }) => {
		// Navigate to create page
		await page.goto('/create');

		// Create a pack with exactly 2 items
		await page.fill('input[id="pack-name"]', 'Two Item Test');
		await page.fill('input[id="pack-description"]', 'Testing 2 item ranking');

		// Add first item
		await page.fill('input[placeholder="Enter item to rank..."]', 'Item 1');
		await page.click('button[type="submit"]');
		await expect(page.locator('text=Item 1')).toBeVisible();

		// Add second item
		await page.fill('input[placeholder="Enter item to rank..."]', 'Item 2');
		await page.click('button[type="submit"]');
		await expect(page.locator('text=Item 2')).toBeVisible();

		// Start ranking
		await page.click('button:has-text("Start Ranking")');

		// Should be on ranking page
		await expect(page.url()).toContain('/rank');
		await expect(page.locator('h1:has-text("Two Item Test")')).toBeVisible();

		// Should show comparison 1 of 1
		await expect(page.locator('text=Comparison 1 of 1')).toBeVisible();

		// Should show both items as swipeable cards
		await expect(page.locator('text=Item 1')).toBeVisible();
		await expect(page.locator('text=Item 2')).toBeVisible();

		// Make a decision - click on Item 1 card
		await page.locator('text=Item 1').first().click();

		// Confirm the choice
		await page.click('button:has-text("Confirm Choice")');

		// Should immediately show completion (not another comparison)
		await expect(page.locator('h2:has-text("Ranking Complete!")')).toBeVisible({ timeout: 5000 });
		await expect(page.locator("text=You've completed all comparisons")).toBeVisible();

		// Should NOT show another comparison
		await expect(page.locator('text=Comparison 2 of')).not.toBeVisible();

		// Can view results
		await page.click('button:has-text("View Full Results")');
		await expect(page.url()).toContain('/results');
	});
});
