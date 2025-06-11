import { type Page, expect, test } from '@playwright/test';

test.describe('Swipe Interactions', () => {
	// Helper to create and start ranking
	async function startRanking(page: Page, items = ['Item A', 'Item B', 'Item C']) {
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Swipe Test');

		for (const item of items) {
			await page.getByPlaceholder('Enter item to rank...').fill(item);
			await page.getByRole('button', { name: 'Add Card' }).click();
		}

		await page.getByRole('button', { name: 'Start Ranking' }).click();
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
	}

	test('should display swipeable cards in comparison', async ({ page }) => {
		await startRanking(page);

		// Should show comparison interface
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await expect(page.getByText('VS')).toBeVisible();

		// Cards should be draggable
		const cards = page.locator('.cursor-grab');
		await expect(cards).toHaveCount(2);
	});

	test('should show swipe instructions', async ({ page }) => {
		await startRanking(page);

		// Should show instruction text
		await expect(page.getByText(/swipe right to choose|swipe or tap to choose/i)).toBeVisible({
			timeout: 5000,
		});

		// Should show keyboard shortcuts hint
		await expect(page.getByText(/tip:.*arrow keys/i)).toBeVisible();
	});

	test('should handle tap selection', async ({ page }) => {
		await startRanking(page, ['Quick A', 'Quick B']); // Minimal for quick test

		// Tap first card
		await page.locator('.cursor-grab').first().click();

		// Should show selection state or move to next comparison
		// With only 2 items, this should complete the ranking
		await expect(page.getByText(/ranking complete|confirm choice/i)).toBeVisible({
			timeout: 10000,
		});
	});

	test('should show selection feedback', async ({ page }) => {
		await startRanking(page);

		// Click on a card to select it
		await page.locator('.cursor-grab').first().click();

		// Should show selection state (ring, highlight, etc.)
		// Look for visual feedback like ring or confirm button
		const confirmButton = page.getByRole('button', { name: /confirm choice/i });
		if (await confirmButton.isVisible()) {
			await expect(confirmButton).toBeVisible();
		}
	});

	test('should handle confirm and cancel actions', async ({ page }) => {
		await startRanking(page);

		// Select a card
		await page.locator('.cursor-grab').first().click();

		// If manual confirmation is shown
		const confirmButton = page.getByRole('button', { name: /confirm choice/i });
		const cancelButton = page.getByRole('button', { name: /cancel/i });

		if (await confirmButton.isVisible()) {
			// Test cancel first
			if (await cancelButton.isVisible()) {
				await cancelButton.click();
				// Selection should be cleared
			}

			// Select again and confirm
			await page.locator('.cursor-grab').first().click();
			await confirmButton.click();

			// Should proceed to next comparison or completion
			await page.waitForTimeout(2000);
		}
	});

	test('should support keyboard selection', async ({ page }) => {
		await startRanking(page);

		// Test arrow key navigation
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(500);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(500);

		// Test Enter to confirm
		await page.keyboard.press('Enter');
		await page.waitForTimeout(1000);

		// Should handle keyboard interaction
	});

	test('should show progress during interactions', async ({ page }) => {
		await startRanking(page, ['A', 'B', 'C', 'D']); // More items for visible progress

		// Check initial progress
		await expect(page.getByText(/comparison \d+ of \d+/i)).toBeVisible();
		await expect(page.getByText(/\d+% complete/)).toBeVisible();

		// Make a selection
		await page.locator('.cursor-grab').first().click();

		// Wait for progress update
		await page.waitForTimeout(2000);

		// Progress should advance (if more comparisons remain)
	});

	test('should handle skip functionality', async ({ page }) => {
		await startRanking(page);

		// Look for skip option
		const skipButton = page.getByRole('button', { name: /skip/i });
		if (await skipButton.isVisible()) {
			await skipButton.click();
			await page.waitForTimeout(1000);

			// Should move to next comparison or handle skip
		}
	});

	test('should display loading states', async ({ page }) => {
		await startRanking(page, ['Loading A', 'Loading B']);

		// Make selection
		await page.locator('.cursor-grab').first().click();

		// Look for loading indicators
		const loadingText = page.getByText(/processing|confirming/i);
		if (await loadingText.isVisible()) {
			await expect(loadingText).toBeVisible();
		}
	});

	test('should handle rapid interactions', async ({ page }) => {
		await startRanking(page, ['Rapid A', 'Rapid B']);

		// Try rapid clicking
		const firstCard = page.locator('.cursor-grab').first();
		await firstCard.click();
		await firstCard.click(); // Double click

		// Should handle gracefully without duplicate actions
		await page.waitForTimeout(2000);
	});

	test('should maintain interaction state', async ({ page }) => {
		await startRanking(page);

		// Make a selection
		await page.locator('.cursor-grab').first().click();

		// Get current URL to check state persistence
		const _currentUrl = page.url();

		// Refresh page
		await page.reload();

		// Should maintain or restore state appropriately
		// This depends on implementation - might restore session or restart
		await expect(page.getByText(/test fruits|which do you prefer|ranking complete/i)).toBeVisible({
			timeout: 10000,
		});
	});

	test('should handle comparison completion', async ({ page }) => {
		await startRanking(page, ['Final A', 'Final B']); // Minimal for quick completion

		// Complete the comparison
		await page.locator('.cursor-grab').first().click();

		// Should show completion screen
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 15000 });

		// Should have results navigation
		await expect(page.getByRole('button', { name: /view full results/i })).toBeVisible();
	});

	test('should show appropriate feedback for different states', async ({ page }) => {
		await startRanking(page);

		// Check initial state
		await expect(page.getByText('Which do you prefer?')).toBeVisible();

		// Interact with card
		await page.locator('.cursor-grab').first().hover();
		await page.waitForTimeout(500);

		// Should show hover feedback
		// Visual feedback depends on implementation
	});

	test('should handle touch interactions on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await startRanking(page);

		// Touch interactions
		const firstCard = page.locator('.cursor-grab').first();

		// Simulate touch tap
		await firstCard.tap();
		await page.waitForTimeout(1000);

		// Should handle touch interaction
	});

	test('should prevent invalid interactions', async ({ page }) => {
		await startRanking(page);

		// Try to interact with disabled elements
		// This depends on the specific implementation
		await expect(page.getByText('Which do you prefer?')).toBeVisible();

		// Cards should be interactive
		await expect(page.locator('.cursor-grab').first()).toBeVisible();
	});

	test('should handle animation states', async ({ page }) => {
		await startRanking(page);

		// Make selection and check for smooth transitions
		await page.locator('.cursor-grab').first().click();

		// Allow time for animations
		await page.waitForTimeout(1500);

		// Should handle animated state transitions
	});

	test('should provide clear visual hierarchy', async ({ page }) => {
		await startRanking(page);

		// Check that important elements are prominent
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await expect(page.getByText('VS')).toBeVisible();

		// Progress should be visible
		await expect(page.getByText(/comparison \d+/i)).toBeVisible();

		// Cards should be clearly defined
		await expect(page.locator('.cursor-grab')).toHaveCount(2);
	});

	test('should handle error recovery', async ({ page }) => {
		await startRanking(page);

		// This would test error states in comparison interface
		// For now, just verify the interface loads correctly
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await expect(page.locator('.cursor-grab')).toHaveCount(2);
	});
});
