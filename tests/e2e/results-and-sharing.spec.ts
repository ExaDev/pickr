import { test, expect } from '@playwright/test';

test.describe('Results and Sharing', () => {
	// Helper to complete a quick ranking
	async function completeQuickRanking(page: any) {
		await page.goto('/');
		await page.getByRole('button', { name: /create new pack/i }).first().click();
		
		// Create minimal pack
		await page.getByLabel('Pack Name').fill('Quick Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Option A');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Option B');
		await page.getByRole('button', { name: 'Add Card' }).click();
		
		// Start ranking
		await page.getByRole('button', { name: 'Start Ranking' }).click();
		
		// Complete the comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await page.locator('.cursor-grab').first().click();
		
		// Wait for completion
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 10000 });
		
		// Go to results
		await page.getByRole('button', { name: /view full results/i }).click();
		await expect(page.url()).toContain('/results/');
	}

	test('should display complete results page', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Check results page elements
		await expect(page.getByText('Ranking Complete!')).toBeVisible();
		await expect(page.getByText(/Here are your final results/)).toBeVisible();
		await expect(page.getByText('Final Rankings')).toBeVisible();
		
		// Should show stats
		await expect(page.getByText('Total Comparisons')).toBeVisible();
		await expect(page.getByText('Time Taken')).toBeVisible();
		await expect(page.getByText('Algorithm Used')).toBeVisible();
	});

	test('should show ranked items with positions', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Should show ranking positions
		await expect(page.locator('.w-12.h-12').filter({ hasText: '1' })).toBeVisible();
		await expect(page.locator('.w-12.h-12').filter({ hasText: '2' })).toBeVisible();
		
		// Should show win rates
		await expect(page.getByText(/win rate/)).toBeVisible();
		await expect(page.getByText(/W - \d+L/)).toBeVisible();
	});

	test('should have share functionality', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Should have share button
		await expect(page.getByRole('button', { name: /share results/i })).toBeVisible();
	});

	test('should open share modal', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Click share button
		await page.getByRole('button', { name: /share results/i }).click();
		
		// Should open modal
		await expect(page.getByText('Share Your Results')).toBeVisible();
		await expect(page.getByText(/copy this link/i)).toBeVisible();
		
		// Should have URL input and copy button
		await expect(page.locator('input[readonly]')).toBeVisible();
		await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
	});

	test('should copy share URL', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Open share modal
		await page.getByRole('button', { name: /share results/i }).click();
		
		// Click copy button
		await page.getByRole('button', { name: /copy/i }).click();
		
		// Button should show feedback
		await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 3000 });
	});

	test('should close share modal', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Open and close modal
		await page.getByRole('button', { name: /share results/i }).click();
		await expect(page.getByText('Share Your Results')).toBeVisible();
		
		await page.getByRole('button', { name: /close/i }).click();
		await expect(page.getByText('Share Your Results')).not.toBeVisible();
	});

	test('should navigate to create new ranking', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Click create new ranking
		await page.getByRole('button', { name: /create new ranking/i }).click();
		
		// Should go to home page
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should access shared results page', async ({ page }) => {
		await page.goto('/results/shared');
		
		// Should show shared results interface
		await expect(page.getByText('View Shared Results')).toBeVisible();
		await expect(page.getByText(/Enter a sharing code/)).toBeVisible();
		
		// Should have input for sharing code
		await expect(page.getByPlaceholder(/Enter sharing code/)).toBeVisible();
		await expect(page.getByRole('button', { name: /view results/i })).toBeVisible();
	});

	test('should validate sharing code input', async ({ page }) => {
		await page.goto('/results/shared');
		
		// Button should be disabled without input
		await expect(page.getByRole('button', { name: /view results/i })).toBeDisabled();
		
		// Add invalid code
		await page.getByPlaceholder(/Enter sharing code/).fill('invalid-code');
		await expect(page.getByRole('button', { name: /view results/i })).toBeEnabled();
		
		// Submit invalid code
		await page.getByRole('button', { name: /view results/i }).click();
		
		// Should show error
		await expect(page.getByText(/invalid sharing code/i)).toBeVisible({ timeout: 5000 });
	});

	test('should show create own ranking option on shared page', async ({ page }) => {
		await page.goto('/results/shared');
		
		// Should have create own option
		await expect(page.getByRole('button', { name: /create your own/i })).toBeVisible();
		
		// Should navigate to home
		await page.getByRole('button', { name: /create your own/i }).click();
		await expect(page).toHaveURL('/');
	});

	test('should show how it works information', async ({ page }) => {
		await page.goto('/results/shared');
		
		// Should show explanation
		await expect(page.getByText(/sharing codes are generated/i)).toBeVisible();
		await expect(page.getByText(/compact, shareable format/i)).toBeVisible();
	});

	test('should handle direct results URL access', async ({ page }) => {
		// Try to access non-existent result
		await page.goto('/results/non-existent-result-id');
		
		// Should handle gracefully (redirect or show error)
		await expect(page.getByText(/loading results|not found|go home/i)).toBeVisible({ timeout: 10000 });
	});

	test('should show appropriate metadata in results', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Should show completion stats
		await expect(page.getByText('1')).toBeVisible(); // Total comparisons
		await expect(page.getByText(/min|sec/)).toBeVisible(); // Time taken
		await expect(page.getByText(/pairwise/i)).toBeVisible(); // Algorithm
	});

	test('should display ranking podium correctly', async ({ page }) => {
		await completeQuickRanking(page);
		
		// First place should have special styling
		const firstPlace = page.locator('.bg-yellow-500').first();
		await expect(firstPlace).toBeVisible();
		await expect(firstPlace).toContainText('1');
		
		// Second place should also be visible
		const secondPlace = page.locator('.bg-gray-400').first();
		await expect(secondPlace).toBeVisible();
		await expect(secondPlace).toContainText('2');
	});

	test('should maintain results across page refresh', async ({ page }) => {
		await completeQuickRanking(page);
		
		// Note the URL
		const currentUrl = page.url();
		
		// Refresh page
		await page.reload();
		
		// Should still show results
		await expect(page.getByText('Ranking Complete!')).toBeVisible();
		await expect(page.getByText('Final Rankings')).toBeVisible();
	});
});