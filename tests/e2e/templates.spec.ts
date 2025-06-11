import { expect, test } from '@playwright/test';

test.describe('Template System', () => {
	test('should display templates page', async ({ page }) => {
		await page.goto('/templates');

		// Should show page header
		await expect(page.getByRole('heading', { name: 'Pack Templates' })).toBeVisible();
		await expect(page.getByText(/choose from hundreds of pre-made/i)).toBeVisible();

		// Should show search functionality
		await expect(page.getByPlaceholder(/search templates/i)).toBeVisible();

		// Should show category browsing
		await expect(page.getByText('Browse by Category')).toBeVisible();
	});

	test('should display template categories', async ({ page }) => {
		await page.goto('/templates');

		// Should show category grid
		await expect(page.getByText('Tech & Digital')).toBeVisible();
		await expect(page.getByText('Entertainment')).toBeVisible();
		await expect(page.getByText('Food & Beverage')).toBeVisible();
		await expect(page.getByText('Sports & Recreation')).toBeVisible();

		// Categories should have icons and descriptions
		await expect(page.locator('text=💻').first()).toBeVisible();
		await expect(page.locator('text=🎬').first()).toBeVisible();
		await expect(page.locator('text=🍕').first()).toBeVisible();
	});

	test('should filter templates by category', async ({ page }) => {
		await page.goto('/templates');

		// Click on Tech category
		await page.getByText('Tech & Digital').click();

		// Should show tech-specific templates
		await expect(page.getByText('Tech & Digital Templates')).toBeVisible();
		await expect(page.getByText(/programming languages|smartphone brands|ai tools/i)).toBeVisible();
	});

	test('should search templates', async ({ page }) => {
		await page.goto('/templates');

		// Search for programming
		await page.getByPlaceholder(/search templates/i).fill('programming');

		// Should show search results
		await expect(page.getByText(/search results.*programming/i)).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Programming Languages' })).toBeVisible();
	});

	test('should show template details', async ({ page }) => {
		await page.goto('/templates');

		// Find a template card
		const templateCard = page
			.locator('.h-full')
			.filter({ hasText: 'Programming Languages' })
			.first();
		await expect(templateCard).toBeVisible();

		// Should show template information
		await expect(
			templateCard.getByRole('heading', { name: 'Programming Languages' })
		).toBeVisible();
		await expect(templateCard.getByText(/javascript|python|typescript/i)).toBeVisible();
		await expect(templateCard.getByRole('button', { name: 'Start Ranking' })).toBeVisible();
	});

	test('should create pack from template', async ({ page }) => {
		await page.goto('/templates');

		// Find and click Programming Languages template
		const templateCard = page
			.locator('.h-full')
			.filter({ hasText: 'Programming Languages' })
			.first();
		await templateCard.getByRole('button', { name: 'Start Ranking' }).click();

		// Should navigate to ranking page
		await expect(page.url()).toContain('/rank/');
		await expect(page.getByText('Programming Languages')).toBeVisible();

		// Should show template items in comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
	});

	test('should show template usage count', async ({ page }) => {
		await page.goto('/templates');

		// Template cards should show usage stats
		await expect(page.getByText(/\d+ uses/)).toBeVisible();
	});

	test('should show template tags', async ({ page }) => {
		await page.goto('/templates');

		// Should show template tags
		await expect(page.locator('text=^#')).toBeVisible(); // Tags start with #
	});

	test('should handle empty search results', async ({ page }) => {
		await page.goto('/templates');

		// Search for non-existent template
		await page.getByPlaceholder(/search templates/i).fill('nonexistenttemplate12345');

		// Should show no results message
		await expect(page.getByText('No templates found')).toBeVisible();
		await expect(page.getByText(/try adjusting your search/i)).toBeVisible();
	});

	test('should navigate between template views', async ({ page }) => {
		await page.goto('/templates');

		// Click Popular view
		await page.getByRole('button', { name: /🔥 popular/i }).click();
		await expect(page.getByText('Popular Templates')).toBeVisible();

		// Click Recent view
		await page.getByRole('button', { name: /🆕 recent/i }).click();
		await expect(page.getByText('Recent Templates')).toBeVisible();

		// Click All Templates view
		await page.getByRole('button', { name: /📚 all templates/i }).click();
		await expect(page.getByText(/All Templates|Category Templates/)).toBeVisible();
	});

	test('should navigate back to home from templates', async ({ page }) => {
		await page.goto('/templates');

		// Click back to home button
		await page.getByRole('button', { name: /← back to home/i }).click();

		// Should return to home page
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should show create custom pack option', async ({ page }) => {
		await page.goto('/templates');

		// Should show create custom pack buttons
		await expect(page.getByRole('button', { name: /create custom pack/i }).first()).toBeVisible();

		// Click create custom pack
		await page
			.getByRole('button', { name: /create custom pack/i })
			.first()
			.click();

		// Should navigate to create page
		await expect(page.url()).toContain('/create');
		await expect(page.getByText('Create New Pack')).toBeVisible();
	});

	test('should show template preview items', async ({ page }) => {
		await page.goto('/templates');

		// Find a template with preview items
		const templateCard = page.locator('.h-full').filter({ hasText: 'World Cuisines' }).first();
		if (await templateCard.isVisible()) {
			// Should show preview of items
			await expect(templateCard.getByText(/italian|japanese|mexican/i)).toBeVisible();
			await expect(templateCard.getByText(/\d+ items to rank/)).toBeVisible();
		}
	});

	test('should handle template loading states', async ({ page }) => {
		await page.goto('/templates');

		// Should not show loading indicators after page load
		await expect(page.locator('.animate-pulse')).not.toBeVisible({ timeout: 5000 });

		// Templates should be loaded
		await expect(page.getByText(/\d+ templates?$/)).toBeVisible();
	});

	test('should maintain template state across navigation', async ({ page }) => {
		await page.goto('/templates');

		// Search for something
		await page.getByPlaceholder(/search templates/i).fill('music');
		await expect(page.getByText(/search results.*music/i)).toBeVisible();

		// Navigate away and back
		await page.getByRole('button', { name: /← back to home/i }).click();
		await page.getByRole('link', { name: /templates/i }).click();

		// Should reset to default view
		await expect(page.getByText('Popular Templates')).toBeVisible();
	});
});
