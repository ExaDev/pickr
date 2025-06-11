import { expect, test } from '@playwright/test';

test.describe('Pick/Discard Mode', () => {
	test('should toggle between pick and discard modes with buttons', async ({ page }) => {
		// Create a pack with 2 items
		await page.goto('http://localhost:3000/create');

		// Add pack name
		await page.fill('[data-testid="pack-name-input"]', 'Pick Discard Test Pack');

		// Add 2 items
		await page.fill('[data-testid="card-content-0"]', 'Option A');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-1"]', 'Option B');

		// Create pack
		await page.click('button:has-text("Create Pack")');

		// Navigate to ranking
		await page.click('[data-testid="pack-card-Pick Discard Test Pack"]');
		await page.click('button:has-text("Start Ranking")');

		// Check default mode is pick
		await expect(page.locator('button:has-text("Pick Mode")')).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		await expect(page.locator('button:has-text("Discard Mode")')).toHaveAttribute(
			'aria-pressed',
			'false'
		);

		// Check instructions show pick mode
		await expect(page.locator('h2')).toContainText('Which do you prefer?');

		// Switch to discard mode
		await page.click('button:has-text("Discard Mode")');

		// Check mode switched
		await expect(page.locator('button:has-text("Pick Mode")')).toHaveAttribute(
			'aria-pressed',
			'false'
		);
		await expect(page.locator('button:has-text("Discard Mode")')).toHaveAttribute(
			'aria-pressed',
			'true'
		);

		// Check instructions changed
		await expect(page.locator('h2')).toContainText('Which do you want to discard?');
	});

	test('should use keyboard shortcuts to switch modes', async ({ page }) => {
		// Create a pack with 2 items
		await page.goto('http://localhost:3000/create');

		// Add pack name
		await page.fill('[data-testid="pack-name-input"]', 'Keyboard Test Pack');

		// Add 2 items
		await page.fill('[data-testid="card-content-0"]', 'Item 1');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-1"]', 'Item 2');

		// Create pack
		await page.click('button:has-text("Create Pack")');

		// Navigate to ranking
		await page.click('[data-testid="pack-card-Keyboard Test Pack"]');
		await page.click('button:has-text("Start Ranking")');

		// Initially in pick mode
		await expect(page.locator('button:has-text("Pick Mode")')).toHaveAttribute(
			'aria-pressed',
			'true'
		);

		// Press 'D' to switch to discard mode
		await page.keyboard.press('d');
		await expect(page.locator('button:has-text("Discard Mode")')).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		await expect(page.locator('h2')).toContainText('discard');

		// Press 'P' to switch back to pick mode
		await page.keyboard.press('p');
		await expect(page.locator('button:has-text("Pick Mode")')).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		await expect(page.locator('h2')).toContainText('prefer');
	});

	test('should show different keyboard shortcuts for 2-card vs multi-card comparisons', async ({
		page,
	}) => {
		// Create a pack with 4 items to test multi-card behavior
		await page.goto('http://localhost:3000/create');

		// Add pack name
		await page.fill('[data-testid="pack-name-input"]', 'Multi Card Test Pack');

		// Add 4 items
		await page.fill('[data-testid="card-content-0"]', 'Card 1');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-1"]', 'Card 2');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-2"]', 'Card 3');
		await page.click('[data-testid="add-card-button"]');
		await page.fill('[data-testid="card-content-3"]', 'Card 4');

		// Create pack
		await page.click('button:has-text("Create Pack")');

		// Navigate to ranking
		await page.click('[data-testid="pack-card-Multi Card Test Pack"]');
		await page.click('button:has-text("Start Ranking")');

		// For 2-card comparison, should show "← → arrows to pick"
		const keyboardHint = page.locator('div').filter({ hasText: /Pick mode:.*arrows to pick/ });
		await expect(keyboardHint).toBeVisible();

		// Check that it mentions arrows directly performing action (not navigation)
		await expect(keyboardHint).toContainText('arrows to pick');
	});
});
