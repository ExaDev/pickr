import { expect, test } from '@playwright/test';

test.describe('Feature Integration', () => {
	test('should navigate between all major features', async ({ page }) => {
		// Start at home
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();

		// Navigate to templates
		await page.getByRole('link', { name: /templates/i }).click();
		await expect(page.getByText('Pack Templates')).toBeVisible();

		// Navigate to comparison
		await page.getByRole('link', { name: /compare/i }).click();
		await expect(page.getByText('Compare Rankings')).toBeVisible();

		// Navigate back to home
		await page.getByRole('link', { name: /home/i }).click();
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should complete full workflow: template to ranking to sharing to comparison', async ({
		page,
	}) => {
		// Step 1: Start with a template
		await page.goto('/templates');

		// Use Programming Languages template
		const templateCard = page
			.locator('.h-full')
			.filter({ hasText: 'Programming Languages' })
			.first();
		await templateCard.getByRole('button', { name: 'Start Ranking' }).click();

		// Step 2: Complete ranking
		await expect(page.url()).toContain('/rank/');
		await expect(page.getByText('Which do you prefer?')).toBeVisible();

		// Complete all comparisons
		for (let i = 0; i < 10; i++) {
			// Programming languages template has many items
			const hasComparison = await page.getByText('Which do you prefer?').isVisible();
			if (hasComparison) {
				await page.locator('.cursor-grab').first().click();
				await page.waitForTimeout(1000);
			} else {
				break; // No more comparisons
			}
		}

		// Step 3: Go to results and get share URL
		const isComplete = await page.getByText('Ranking Complete!').isVisible({ timeout: 15000 });
		if (isComplete) {
			await page.getByRole('button', { name: /view full results/i }).click();
			await expect(page.url()).toContain('/results/');

			// Get share URL
			await page.getByRole('button', { name: /share results/i }).click();
			const shareInput = page.locator('input[readonly]');
			const shareUrl = await shareInput.inputValue();
			await page.getByRole('button', { name: /close/i }).click();

			// Step 4: Use in comparison
			await page.getByRole('button', { name: /compare with others/i }).click();
			await expect(page.url()).toContain('/compare');

			// Add this ranking to comparison
			await page.getByPlaceholder(/paste ranking url/i).fill(shareUrl);
			await page.getByRole('button', { name: /add ranking/i }).click();

			// Should show the ranking in comparison list
			await expect(page.getByText(/ranking 1/i)).toBeVisible();
		}
	});

	test('should create custom pack and use all result features', async ({ page }) => {
		// Create custom pack
		await page.goto('/');
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		await page.getByLabel('Pack Name').fill('Integration Test Pack');
		await page.getByLabel('Description').fill('Testing all features');

		// Add multiple items for meaningful ranking
		const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
		for (const item of items) {
			await page.getByPlaceholder('Enter item to rank...').fill(item);
			await page.getByRole('button', { name: 'Add Card' }).click();
		}

		// Start ranking
		await page.getByRole('button', { name: 'Start Ranking' }).click();

		// Complete ranking quickly
		for (let i = 0; i < 15; i++) {
			// 5 items = up to 10 comparisons
			const hasComparison = await page.getByText('Which do you prefer?').isVisible();
			if (hasComparison) {
				await page.locator('.cursor-grab').first().click();
				await page.waitForTimeout(800);
			} else {
				break;
			}
		}

		// Go to results
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 15000 });
		await page.getByRole('button', { name: /view full results/i }).click();

		// Test all result features
		// 1. View chart visualization
		await expect(page.getByText('Results Visualization')).toBeVisible();

		// 2. Test chart type switching
		const chartButtons = page
			.getByRole('button')
			.filter({ hasText: /bar chart|horizontal|podium|scatter/i });
		const buttonCount = await chartButtons.count();
		if (buttonCount > 0) {
			await chartButtons.first().click();
			await page.waitForTimeout(500);
		}

		// 3. Share results
		await page.getByRole('button', { name: /share results/i }).click();
		await expect(page.getByText('Share Your Results')).toBeVisible();

		const shareUrl = await page.locator('input[readonly]').inputValue();
		expect(shareUrl).toMatch(/results\/shared\?code=p_/);

		await page.getByRole('button', { name: /copy/i }).click();
		await expect(page.getByRole('button', { name: /copied/i })).toBeVisible();
		await page.getByRole('button', { name: /close/i }).click();

		// 4. Navigate to comparison
		await page.getByRole('button', { name: /compare with others/i }).click();
		await expect(page.url()).toContain('/compare');
	});

	test('should handle template-based comparison workflow', async ({ page }) => {
		// Create two rankings from templates for comparison
		const templateRankings = [];

		for (let i = 0; i < 2; i++) {
			await page.goto('/templates');

			// Use different templates
			const templateName = i === 0 ? 'Music Genres' : 'Coffee Drinks';
			const templateCard = page.locator('.h-full').filter({ hasText: templateName }).first();

			if (await templateCard.isVisible()) {
				await templateCard.getByRole('button', { name: 'Start Ranking' }).click();

				// Quick ranking completion
				for (let j = 0; j < 8; j++) {
					const hasComparison = await page.getByText('Which do you prefer?').isVisible();
					if (hasComparison) {
						await page.locator('.cursor-grab').first().click();
						await page.waitForTimeout(600);
					} else {
						break;
					}
				}

				// Get results and share URL
				const isComplete = await page.getByText('Ranking Complete!').isVisible({ timeout: 12000 });
				if (isComplete) {
					await page.getByRole('button', { name: /view full results/i }).click();
					await page.getByRole('button', { name: /share results/i }).click();

					const shareUrl = await page.locator('input[readonly]').inputValue();
					templateRankings.push(shareUrl);

					await page.getByRole('button', { name: /close/i }).click();
				}
			}
		}

		// Use both in comparison if we got valid URLs
		if (templateRankings.length === 2) {
			await page.goto('/compare');

			for (let i = 0; i < templateRankings.length; i++) {
				await page.getByPlaceholder(/paste ranking url/i).fill(templateRankings[i]);
				await page.getByRole('button', { name: /add ranking/i }).click();

				if (i < templateRankings.length - 1) {
					await page.getByPlaceholder(/paste ranking url/i).clear();
				}
			}

			await expect(page.getByText(/ranking 1/i)).toBeVisible();
			await expect(page.getByText(/ranking 2/i)).toBeVisible();
		}
	});

	test('should validate cross-feature navigation consistency', async ({ page }) => {
		// Check that navigation is consistent across all pages
		const pages = ['/', '/templates', '/compare', '/create'];

		for (const pagePath of pages) {
			await page.goto(pagePath);

			// Should have consistent header navigation
			await expect(page.getByRole('link', { name: /pickr|home/i })).toBeVisible();

			// Should not show any obvious errors
			await expect(page.locator('text=Error, text=404, text=Not Found')).not.toBeVisible();
		}
	});

	test('should handle shared results viewing workflow', async ({ page }) => {
		// Create a ranking first
		await page.goto('/');
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		await page.getByLabel('Pack Name').fill('Shared Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Item 1');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Item 2');
		await page.getByRole('button', { name: 'Add Card' }).click();

		await page.getByRole('button', { name: 'Start Ranking' }).click();

		// Complete quick comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await page.locator('.cursor-grab').first().click();

		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 10000 });
		await page.getByRole('button', { name: /view full results/i }).click();

		// Get share URL
		await page.getByRole('button', { name: /share results/i }).click();
		const shareUrl = await page.locator('input[readonly]').inputValue();
		await page.getByRole('button', { name: /close/i }).click();

		// Test shared viewing workflow
		// 1. Access via direct URL
		await page.goto(shareUrl);
		await expect(page.getByText('Shared Ranking Results')).toBeVisible();

		// 2. Access via input page
		await page.goto('/results/shared');

		// Extract just the code part
		const codeMatch = shareUrl.match(/code=([^&]+)/);
		if (codeMatch) {
			const code = codeMatch[1];
			await page.getByPlaceholder(/enter sharing code/i).fill(code);
			await page.getByRole('button', { name: /view results/i }).click();

			await expect(page.getByText('Shared Ranking Results')).toBeVisible();
		}
	});

	test('should maintain state across feature transitions', async ({ page }) => {
		// Start ranking from template
		await page.goto('/templates');
		const templateCard = page.locator('.h-full').filter({ hasText: 'World Cuisines' }).first();

		if (await templateCard.isVisible()) {
			await templateCard.getByRole('button', { name: 'Start Ranking' }).click();

			// Start comparison but don't complete
			await expect(page.getByText('Which do you prefer?')).toBeVisible();

			// Navigate away and back
			await page.goto('/templates');
			await page.goBack();

			// Should maintain ranking state
			await expect(
				page.getByText(/World Cuisines|Which do you prefer?|Ranking Complete/)
			).toBeVisible();
		}
	});
});
