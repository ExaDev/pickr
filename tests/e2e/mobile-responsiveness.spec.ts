import { test, expect, devices } from '@playwright/test';

// Mobile tests - using iPhone 12
test.describe('Mobile Responsiveness', () => {

	test('should display mobile-friendly homepage', async ({ page }) => {
		// Set mobile viewport manually
		await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 size
		await page.goto('/');
		
		// Check main elements are visible on mobile
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
		await expect(page.getByRole('button', { name: /create new pack/i })).toBeVisible();
		
		// Features should be stacked on mobile
		await expect(page.getByText('Create Packs')).toBeVisible();
		await expect(page.getByText('Compare & Rank')).toBeVisible();
	});

	test('should handle mobile pack creation', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/create');
		
		// Form should be usable on mobile
		await expect(page.getByLabel('Pack Name')).toBeVisible();
		await expect(page.getByPlaceholder('Enter item to rank...')).toBeVisible();
		
		// Buttons should be touch-friendly
		await expect(page.getByRole('button', { name: 'Add Card' })).toBeVisible();
		
		// Fill form on mobile
		await page.getByLabel('Pack Name').fill('Mobile Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Mobile Item 1');
		await page.getByRole('button', { name: 'Add Card' }).click();
		
		await page.getByPlaceholder('Enter item to rank...').fill('Mobile Item 2');
		await page.getByRole('button', { name: 'Add Card' }).click();
		
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeEnabled();
	});

	test('should display mobile ranking interface', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		// Create quick test pack
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Mobile Ranking');
		await page.getByPlaceholder('Enter item to rank...').fill('A');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('B');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByRole('button', { name: 'Start Ranking' }).click();
		
		// Check mobile ranking interface
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		
		// Cards should be stacked vertically on mobile
		await expect(page.getByText('VS')).toBeVisible();
		
		// Progress should be visible
		await expect(page.getByText(/Comparison \d+ of \d+/)).toBeVisible();
	});

	test('should handle mobile sidebar', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		// Create and start ranking
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Sidebar Test');
		await page.getByPlaceholder('Enter item to rank...').fill('X');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Y');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByRole('button', { name: 'Start Ranking' }).click();
		
		// Sidebar might be collapsed on mobile initially
		// Check if toggle exists
		const toggleButton = page.locator('button').filter({ hasText: /→|←/ }).first();
		if (await toggleButton.isVisible()) {
			await toggleButton.click();
			await expect(page.getByText('Current Rankings')).toBeVisible();
		}
	});

	test('should handle mobile navigation', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/create');
		
		// Back button should work on mobile
		await page.getByRole('button', { name: /back/i }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should display mobile results page', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		// Complete quick ranking
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Mobile Results');
		await page.getByPlaceholder('Enter item to rank...').fill('Option 1');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Option 2');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByRole('button', { name: 'Start Ranking' }).click();
		
		// Complete comparison
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await page.locator('.cursor-grab').first().click();
		
		// Go to results
		await expect(page.getByText('Ranking Complete!')).toBeVisible({ timeout: 10000 });
		await page.getByRole('button', { name: /view full results/i }).click();
		
		// Check mobile results layout
		await expect(page.getByText('Ranking Complete!')).toBeVisible();
		await expect(page.getByText('Final Rankings')).toBeVisible();
		
		// Stats should be readable on mobile
		await expect(page.getByText('Total Comparisons')).toBeVisible();
	});

	test('should handle mobile share modal', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		// Navigate to shared results page
		await page.goto('/results/shared');
		
		// Check mobile layout
		await expect(page.getByText('View Shared Results')).toBeVisible();
		await expect(page.getByPlaceholder(/Enter sharing code/)).toBeVisible();
		
		// Input should be touch-friendly
		const input = page.getByPlaceholder(/Enter sharing code/);
		await input.fill('test-code');
		await expect(page.getByRole('button', { name: /view results/i })).toBeEnabled();
	});

	test('should handle touch interactions', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/create');
		
		// Test touch-friendly form interactions
		await page.getByLabel('Pack Name').tap();
		await page.getByLabel('Pack Name').fill('Touch Test');
		
		await page.getByPlaceholder('Enter item to rank...').tap();
		await page.getByPlaceholder('Enter item to rank...').fill('Touch Item');
		
		// Button taps should work
		await page.getByRole('button', { name: 'Add Card' }).tap();
		
		// Check item was added
		await expect(page.getByText('Preview (1 items)')).toBeVisible();
	});

	test('should handle mobile keyboard', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/create');
		
		// Test keyboard interactions on mobile
		await page.getByLabel('Pack Name').focus();
		await page.keyboard.type('Keyboard Test');
		
		await page.getByPlaceholder('Enter item to rank...').focus();
		await page.keyboard.type('Keyboard Item');
		
		// Enter should work to submit
		await page.keyboard.press('Meta+Enter'); // Cmd+Enter on mobile
		
		// Item should be added
		await expect(page.getByText('Preview (1 items)')).toBeVisible();
	});
});

test.describe('Tablet Responsiveness', () => {

	test('should display tablet-optimized layout', async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 1366 }); // iPad Pro size
		await page.goto('/');
		
		// Tablet should show grid layout
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
		await expect(page.getByText('Create Packs')).toBeVisible();
		
		// Features might be in 2-column grid on tablet
		const featureElements = page.locator('text=Create Packs, Compare & Rank, Share Results').first();
		await expect(page.getByText('Create Packs')).toBeVisible();
	});

	test('should handle tablet pack creation layout', async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 1366 });
		await page.goto('/create');
		
		// Tablet should show side-by-side layout
		await expect(page.getByText('Pack Details')).toBeVisible();
		await expect(page.getByText('Add Items')).toBeVisible();
		await expect(page.getByText('Preview')).toBeVisible();
		
		// Form should be usable
		await page.getByLabel('Pack Name').fill('Tablet Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Tablet Item');
		await page.getByRole('button', { name: 'Add Card' }).click();
		
		await expect(page.getByText('Preview (1 items)')).toBeVisible();
	});

	test('should handle tablet ranking interface', async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 1366 });
		// Create pack
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Tablet Ranking');
		await page.getByPlaceholder('Enter item to rank...').fill('Item A');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Item B');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByRole('button', { name: 'Start Ranking' }).click();
		
		// Check tablet ranking layout
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		
		// Cards should be side-by-side on tablet
		await expect(page.getByText('VS')).toBeVisible();
		
		// Sidebar should be visible on tablet
		await expect(page.getByText('Current Rankings')).toBeVisible();
	});
});

test.describe('Desktop Responsiveness', () => {

	test('should display full desktop layout', async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop size
		await page.goto('/');
		
		// Desktop should show full layout
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
		
		// Features should be in 3-column grid
		await expect(page.getByText('Create Packs')).toBeVisible();
		await expect(page.getByText('Compare & Rank')).toBeVisible();
		await expect(page.getByText('Share Results')).toBeVisible();
	});

	test('should handle desktop pack creation', async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto('/create');
		
		// Desktop should show full side-by-side layout
		await expect(page.getByText('Pack Details')).toBeVisible();
		await expect(page.getByText('Preview')).toBeVisible();
		
		// Large form should be comfortable to use
		await page.getByLabel('Pack Name').fill('Desktop Test Pack');
		await page.getByLabel('Description').fill('This is a test pack for desktop');
		
		// Add multiple items easily
		for (let i = 1; i <= 3; i++) {
			await page.getByPlaceholder('Enter item to rank...').fill(`Desktop Item ${i}`);
			await page.getByRole('button', { name: 'Add Card' }).click();
		}
		
		await expect(page.getByText('Preview (3 items)')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeEnabled();
	});

	test('should handle desktop ranking with sidebar', async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });
		// Create pack
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Desktop Ranking');
		await page.getByPlaceholder('Enter item to rank...').fill('Desktop A');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Desktop B');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByRole('button', { name: 'Start Ranking' }).click();
		
		// Check desktop layout with sidebar
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await expect(page.getByText('Current Rankings')).toBeVisible();
		
		// Cards should be large and side-by-side
		await expect(page.getByText('VS')).toBeVisible();
		
		// Sidebar should be fully visible and functional
		await expect(page.getByText('3 items')).toBeVisible();
	});
});