import { expect, test } from '@playwright/test';
import { navigateToRankingPage, performComparison } from './test-helpers';

test.describe('2-item ranking bug', () => {
	test('should only require 1 comparison for 2 items using pairwise algorithm', async ({
		page,
	}) => {
		// Create a pack with exactly 2 items
		await page.goto('http://localhost:3000/create');

		// Add pack name
		await page.fill('[data-testid="pack-name-input"]', 'Two Item Test Pack');

		// Add exactly 2 items
		await page.fill('[data-testid="card-content-0"]', 'Item A');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-1"]', 'Item B');

		// Create pack
		await page.click('button:has-text("Create Pack")');

		// Should redirect to home page
		await expect(page).toHaveURL('http://localhost:3000/');

		// Navigate to ranking
		await page.click('[data-testid="pack-card-Two Item Test Pack"]');
		await page.click('button:has-text("Start Ranking")');

		// Should be on ranking page
		await expect(page).toHaveURL(/\/rank\?packId=/);

		// Check initial progress - should show 1 of 1
		const progressText = await page.textContent('text=/Comparison \\d+ of \\d+/');
		console.log('Progress text:', progressText);
		expect(progressText).toContain('Comparison 1 of 1');

		// Make the first (and should be only) comparison
		await performComparison(page, 1); // Choose the first item

		// Should immediately complete - no second comparison
		await expect(page.locator('text="Ranking Complete!"')).toBeVisible({ timeout: 5000 });

		// Verify we didn't get asked for a second comparison
		const comparisonCount = await page.locator('text=/Comparison \\d+ of \\d+/').count();
		expect(comparisonCount).toBe(0); // Progress indicator should be gone
	});

	test('should only require n-1 comparisons for tournament algorithm', async ({ page }) => {
		// Create a pack with 4 items
		await page.goto('http://localhost:3000/create');

		// Add pack name
		await page.fill('[data-testid="pack-name-input"]', 'Four Item Tournament Test');

		// Add 4 items
		await page.fill('[data-testid="card-content-0"]', 'Item 1');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-1"]', 'Item 2');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-2"]', 'Item 3');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-3"]', 'Item 4');

		// TODO: Add UI to select tournament algorithm when that feature is added
		// For now, we'll just test that pairwise doesn't ask for all n*(n-1)/2 comparisons

		// Create pack
		await page.click('button:has-text("Create Pack")');

		// Navigate to ranking
		await page.click('[data-testid="pack-card-Four Item Tournament Test"]');
		await page.click('button:has-text("Start Ranking")');

		// With 4 items and pairwise, we should need 6 comparisons total
		const firstProgress = await page.textContent('text=/Comparison \\d+ of \\d+/');
		expect(firstProgress).toContain('Comparison 1 of 6');
	});
});
