import { expect, test } from '@playwright/test';

test.describe('Enhanced Sharing System', () => {
	// Helper to complete a ranking and get to results page
	async function completeRankingAndGetResults(page: any, packName = 'Test Pack') {
		await page.goto('/');
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Create pack
		await page.getByLabel('Pack Name').fill(packName);
		await page.getByLabel('Description').fill('Test description');

		// Add items
		await page.getByPlaceholder('Enter item to rank...').fill('Option A');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Option B');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Option C');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Start ranking
		await page.getByRole('button', { name: 'Start Ranking' }).click();

		// Complete comparisons
		for (let i = 0; i < 3; i++) {
			const hasComparison = await page.getByText('Which do you prefer?').isVisible();
			if (hasComparison) {
				await page.locator('.cursor-grab').first().click();
				await page.waitForTimeout(1000);
			}
		}

		// Wait for completion and go to results
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 10000 });
		await page.getByRole('button', { name: /view full results/i }).click();
		await expect(page.url()).toContain('/results/');

		return page.url(); // Return results URL
	}

	test('should generate shareable URL with Paco code', async ({ page }) => {
		await completeRankingAndGetResults(page);

		// Open share modal
		await page.getByRole('button', { name: /share results/i }).click();
		await expect(page.getByText('Share Your Results')).toBeVisible();

		// Should have a readable input with URL
		const shareInput = page.locator('input[readonly]');
		await expect(shareInput).toBeVisible();

		const shareUrl = await shareInput.inputValue();

		// URL should contain Paco code
		expect(shareUrl).toMatch(/results\/shared\?code=p_/);
		expect(shareUrl.length).toBeGreaterThan(50); // Paco codes are reasonably long
	});

	test('should copy share URL to clipboard', async ({ page }) => {
		await completeRankingAndGetResults(page);

		// Open share modal
		await page.getByRole('button', { name: /share results/i }).click();

		// Copy URL
		await page.getByRole('button', { name: /copy/i }).click();

		// Should show feedback
		await expect(page.getByRole('button', { name: /copied/i })).toBeVisible();
	});

	test('should handle share URL generation errors gracefully', async ({ page }) => {
		// Navigate directly to results page with potential invalid state
		await page.goto('/results/invalid-session-id');

		// Should handle gracefully (redirect or show error)
		await expect(page.getByText(/loading|not found|error/i)).toBeVisible({ timeout: 10000 });
	});

	test('should access shared results via URL', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareInput = page.locator('input[readonly]');
		const shareUrl = await shareInput.inputValue();
		await page.getByRole('button', { name: /close/i }).click();

		// Visit the shared URL in new context (simulate different user)
		await page.goto(shareUrl);

		// Should show shared results page
		await expect(page.getByText('Shared Ranking Results')).toBeVisible();
		await expect(page.getByText(/results from \d+ items/i)).toBeVisible();
	});

	test('should display shared results with proper metadata', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page, 'Shared Test Pack');

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Should show metadata
		await expect(page.getByText('Ranking Method')).toBeVisible();
		await expect(page.getByText('Date Created')).toBeVisible();
		await expect(page.getByText(/pairwise/i)).toBeVisible();
	});

	test('should show visualization in shared results', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Should show chart visualization
		await expect(page.getByText('Shared Results Visualization')).toBeVisible();

		// Should have chart controls
		await expect(
			page.getByRole('button', { name: /bar chart|horizontal chart|podium|scatter/i })
		).toBeVisible();
	});

	test('should display detailed rankings in shared results', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Should show detailed rankings
		await expect(page.getByText('Detailed Rankings')).toBeVisible();

		// Should show ranking positions
		await expect(page.locator('.bg-yellow-500').filter({ hasText: '1' })).toBeVisible(); // First place
		await expect(page.locator('.bg-gray-400').filter({ hasText: '2' })).toBeVisible(); // Second place

		// Should show win rates
		await expect(page.getByText(/\d+% win rate/)).toBeVisible();
		await expect(page.getByText(/\d+W - \d+L/)).toBeVisible();
	});

	test('should handle invalid Paco codes', async ({ page }) => {
		await page.goto('/results/shared?code=invalid-paco-code');

		// Should show error message
		await expect(page.getByText(/invalid sharing code/i)).toBeVisible();
		await expect(page.getByText(/please check the code/i)).toBeVisible();
	});

	test('should handle corrupted Paco codes', async ({ page }) => {
		await page.goto('/results/shared?code=p_corrupted123');

		// Should show error message
		await expect(page.getByText(/failed to load results|invalid|corrupted/i)).toBeVisible();
	});

	test('should navigate from shared results to create new ranking', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Click create your own ranking
		await page.getByRole('button', { name: /create your own ranking/i }).click();

		// Should navigate to home
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should navigate to view another result from shared page', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Click view another result
		await page.getByRole('button', { name: /view another result/i }).click();

		// Should navigate to shared results input page
		await expect(page).toHaveURL('/results/shared');
		await expect(page.getByText('View Shared Results')).toBeVisible();
	});

	test('should show sharing code input validation', async ({ page }) => {
		await page.goto('/results/shared');

		// Button should be disabled initially
		await expect(page.getByRole('button', { name: /view results/i })).toBeDisabled();

		// Add text to enable button
		await page.getByPlaceholder(/enter sharing code/i).fill('p_test123');
		await expect(page.getByRole('button', { name: /view results/i })).toBeEnabled();

		// Clear input to disable again
		await page.getByPlaceholder(/enter sharing code/i).clear();
		await expect(page.getByRole('button', { name: /view results/i })).toBeDisabled();
	});

	test('should maintain shared result state across refresh', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Verify content is loaded
		await expect(page.getByText('Shared Ranking Results')).toBeVisible();

		// Refresh page
		await page.reload();

		// Should still show shared results
		await expect(page.getByText('Shared Ranking Results')).toBeVisible();
		await expect(page.getByText('Detailed Rankings')).toBeVisible();
	});

	test('should show comparison link from results page', async ({ page }) => {
		await completeRankingAndGetResults(page);

		// Should have compare with others button
		await expect(page.getByRole('button', { name: /compare with others/i })).toBeVisible();

		// Click to navigate to comparison page
		await page.getByRole('button', { name: /compare with others/i }).click();

		// Should navigate to compare page
		await expect(page.url()).toContain('/compare');
		await expect(page.getByText('Compare Rankings')).toBeVisible();
	});

	test('should generate different codes for different results', async ({ page }) => {
		// Complete first ranking
		const firstResultsUrl = await completeRankingAndGetResults(page, 'First Pack');
		await page.getByRole('button', { name: /share results/i }).click();
		const firstShareCode = await page.locator('input[readonly]').inputValue();
		await page.getByRole('button', { name: /close/i }).click();

		// Complete second ranking
		const secondResultsUrl = await completeRankingAndGetResults(page, 'Second Pack');
		await page.getByRole('button', { name: /share results/i }).click();
		const secondShareCode = await page.locator('input[readonly]').inputValue();

		// Codes should be different
		expect(firstShareCode).not.toBe(secondShareCode);

		// Both should be valid Paco URLs
		expect(firstShareCode).toMatch(/results\/shared\?code=p_/);
		expect(secondShareCode).toMatch(/results\/shared\?code=p_/);
	});

	test('should show footer attribution on shared results', async ({ page }) => {
		const resultsUrl = await completeRankingAndGetResults(page);

		// Get and visit share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.goto(shareUrl);

		// Should show pickr attribution
		await expect(page.getByText(/created with pickr/i)).toBeVisible();
	});
});
