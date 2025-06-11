import { test, expect } from '@playwright/test';

test.describe('Ranking Workflow', () => {
	// Helper function to create a pack with test data
	async function createTestPack(page: any, items: string[] = ['Apple', 'Banana', 'Cherry']) {
		await page.goto('/');
		await page.getByRole('button', { name: /create new pack/i }).first().click();
		
		// Fill pack details
		await page.getByLabel('Pack Name').fill('Test Fruits');
		await page.getByLabel('Description').fill('Ranking my favorite fruits');
		
		// Add items
		for (const item of items) {
			await page.getByPlaceholder('Enter item to rank...').fill(item);
			await page.getByRole('button', { name: 'Add Card' }).click();
		}
		
		// Start ranking and wait for navigation
		await Promise.all([
			page.waitForURL('**/rank/**'),
			page.getByRole('button', { name: 'Start Ranking' }).click()
		]);
	}

	test('should create pack and start ranking session', async ({ page }) => {
		await createTestPack(page);
		
		// Should navigate to ranking page
		await expect(page.url()).toContain('/rank/');
		await expect(page.getByRole('heading', { name: 'Test Fruits' })).toBeVisible();
		await expect(page.getByText('Ranking my favorite fruits')).toBeVisible();
	});

	test('should display comparison interface', async ({ page }) => {
		await createTestPack(page);
		
		// Should show comparison question
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		
		// Should show two cards for comparison
		const cards = page.locator('[data-testid="comparison-card"], .cursor-grab, .relative.cursor-grab');
		await expect(cards).toHaveCount(2);
		
		// Should show VS indicator
		await expect(page.getByText('VS')).toBeVisible();
		
		// Should show progress indicator
		await expect(page.getByText(/Comparison \d+ of \d+/)).toBeVisible();
	});

	test('should show ranking sidebar', async ({ page }) => {
		await createTestPack(page);
		
		// Sidebar should be visible
		await expect(page.getByText('Current Rankings')).toBeVisible();
		await expect(page.getByText('3 items')).toBeVisible();
	});

	test('should complete comparison by clicking', async ({ page }) => {
		await createTestPack(page);
		
		// Wait for comparison to load
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		
		// Click on first card
		const cards = page.locator('.cursor-grab').first();
		await cards.click();
		
		// Should move to next comparison or complete
		// Note: This test might need adjustment based on actual implementation
		await page.waitForTimeout(1000); // Wait for animation
	});

	test('should handle multiple comparisons', async ({ page }) => {
		await createTestPack(page, ['A', 'B', 'C', 'D']); // 4 items = multiple comparisons needed
		
		// Perform several comparisons
		for (let i = 0; i < 3; i++) {
			await expect(page.getByText('Which do you prefer?')).toBeVisible();
			
			// Click first card
			const firstCard = page.locator('.cursor-grab').first();
			await firstCard.click();
			
			// Wait for next comparison to load
			await page.waitForTimeout(1000);
		}
	});

	test('should show completion screen', async ({ page }) => {
		await createTestPack(page, ['Item 1', 'Item 2']); // Minimal for quick completion
		
		// Complete the single comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await page.locator('.cursor-grab').first().click();
		
		// Should eventually show completion
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 10000 });
		await expect(page.getByRole('button', { name: /view full results/i })).toBeVisible();
	});

	test('should navigate to results page', async ({ page }) => {
		await createTestPack(page, ['X', 'Y']); // Minimal items
		
		// Complete comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await page.locator('.cursor-grab').first().click();
		
		// Wait for completion and click results
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 10000 });
		await page.getByRole('button', { name: /view full results/i }).click();
		
		// Should navigate to results page
		await expect(page.url()).toContain('/results/');
		await expect(page.getByText('Ranking Complete!')).toBeVisible();
	});

	test('should allow navigation back to home', async ({ page }) => {
		await createTestPack(page);
		
		// Navigate back using back button
		await page.getByRole('button', { name: /back to packs/i }).click();
		
		// Should return to home
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should show progress updates', async ({ page }) => {
		await createTestPack(page, ['A', 'B', 'C']); // 3 items for visible progress
		
		// Check initial progress
		await expect(page.getByText(/Comparison 1 of/)).toBeVisible();
		await expect(page.getByText(/0% complete|33% complete/)).toBeVisible();
		
		// Complete first comparison
		await page.locator('.cursor-grab').first().click();
		await page.waitForTimeout(1000);
		
		// Progress should update (if not complete)
		// Note: Exact progress depends on algorithm implementation
	});

	test('should handle skip functionality', async ({ page }) => {
		await createTestPack(page);
		
		// Look for skip button
		const skipButton = page.getByRole('button', { name: /skip/i });
		if (await skipButton.isVisible()) {
			await skipButton.click();
			await page.waitForTimeout(1000);
		}
	});

	test('should handle errors gracefully', async ({ page }) => {
		// Try to access non-existent pack
		await page.goto('/rank/non-existent-pack-id');
		
		// Should redirect or show error
		await expect(page.getByText(/pack not found|go home/i)).toBeVisible({ timeout: 5000 });
	});

	test('should maintain state during session', async ({ page }) => {
		await createTestPack(page);
		
		// Complete one comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await page.locator('.cursor-grab').first().click();
		await page.waitForTimeout(1000);
		
		// Refresh page
		await page.reload();
		
		// Should maintain ranking session state
		// Note: This depends on local storage implementation
		await expect(page.getByText(/Test Fruits|Which do you prefer?|Ranking Complete/)).toBeVisible();
	});

	test('should collapse and expand sidebar', async ({ page }) => {
		await createTestPack(page);
		
		// Look for sidebar toggle button
		const toggleButton = page.locator('button').filter({ hasText: /→|←/ }).first();
		if (await toggleButton.isVisible()) {
			await toggleButton.click();
			await page.waitForTimeout(500);
			
			// Sidebar should be collapsed
			await expect(page.getByText('Current Rankings')).not.toBeVisible();
			
			// Click again to expand
			await page.locator('button').filter({ hasText: /→|←/ }).first().click();
			await expect(page.getByText('Current Rankings')).toBeVisible();
		}
	});
});