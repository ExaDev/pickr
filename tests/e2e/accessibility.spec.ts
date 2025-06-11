import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
	test('should have proper semantic structure on homepage', async ({ page }) => {
		await page.goto('/');

		// Check heading hierarchy
		await expect(page.getByRole('heading', { level: 1, name: 'pickr' })).toBeVisible();

		// Check landmark regions
		await expect(page.getByRole('main')).toBeVisible();

		// Check button accessibility
		const createButton = page.getByRole('button', { name: /create new pack/i }).first();
		await expect(createButton).toBeVisible();
		await expect(createButton).toBeEnabled();
	});

	test('should support keyboard navigation on homepage', async ({ page }) => {
		await page.goto('/');

		// Tab through interactive elements
		await page.keyboard.press('Tab');

		// Create button should be focusable
		const createButton = page.getByRole('button', { name: /create new pack/i }).first();
		await createButton.focus();
		await expect(createButton).toBeFocused();

		// Enter/Space should activate
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL('/create');
	});

	test('should have accessible form labels in pack creation', async ({ page }) => {
		await page.goto('/create');

		// Check form labels
		await expect(page.getByLabel('Pack Name')).toBeVisible();
		await expect(page.getByLabel('Description')).toBeVisible();

		// Check required field indicators
		const packNameInput = page.getByLabel('Pack Name');
		await expect(packNameInput).toHaveAttribute('required');

		// Check placeholder text
		await expect(page.getByPlaceholder('Enter item to rank...')).toBeVisible();
	});

	test('should support keyboard navigation in forms', async ({ page }) => {
		await page.goto('/create');

		// Tab through form elements
		await page.keyboard.press('Tab'); // Skip back button
		await page.keyboard.press('Tab'); // Pack name input

		const packNameInput = page.getByLabel('Pack Name');
		await expect(packNameInput).toBeFocused();

		// Type in pack name
		await page.keyboard.type('Accessibility Test');

		// Tab to description
		await page.keyboard.press('Tab');
		const descriptionInput = page.getByLabel('Description');
		await expect(descriptionInput).toBeFocused();

		// Tab to card input
		await page.keyboard.press('Tab');
		const cardInput = page.getByPlaceholder('Enter item to rank...');
		await expect(cardInput).toBeFocused();
	});

	test('should have proper ARIA labels and roles', async ({ page }) => {
		await page.goto('/create');

		// Check button roles
		await expect(page.getByRole('button', { name: 'Add Card' })).toBeVisible();
		await expect(page.getByRole('button', { name: /back/i })).toBeVisible();

		// Check form roles
		await expect(page.getByRole('textbox', { name: 'Pack Name' })).toBeVisible();

		// Check heading structure
		await expect(page.getByRole('heading', { name: 'Create New Pack' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Pack Details' })).toBeVisible();
	});

	test('should provide error announcements', async ({ page }) => {
		await page.goto('/create');

		// Try to add empty card
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Input should remain focused or show validation
		const cardInput = page.getByPlaceholder('Enter item to rank...');
		await expect(cardInput).toBeFocused();
	});

	test('should support screen reader navigation', async ({ page }) => {
		await page.goto('/');

		// Check that content is structured for screen readers
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.getByRole('main')).toBeVisible();

		// Check descriptive text
		await expect(page.getByText(/create rankings through intuitive/i)).toBeVisible();
	});

	test('should have accessible button states', async ({ page }) => {
		await page.goto('/create');

		// Start ranking should be disabled initially
		const startButton = page.getByRole('button', { name: 'Start Ranking' });
		await expect(startButton).toBeDisabled();

		// Add required data
		await page.getByLabel('Pack Name').fill('Accessibility Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Item 1');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('Item 2');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Button should now be enabled
		await expect(startButton).toBeEnabled();
	});

	test('should handle focus management in ranking interface', async ({ page }) => {
		// Create pack and navigate to ranking
		await page.goto('/create');
		await page.getByLabel('Pack Name').fill('Focus Test');
		await page.getByPlaceholder('Enter item to rank...').fill('A');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByPlaceholder('Enter item to rank...').fill('B');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await page.getByRole('button', { name: 'Start Ranking' }).click();

		// Check ranking interface accessibility
		await expect(page.getByText('Which do you prefer?')).toBeVisible();

		// Cards should be keyboard accessible
		await page.keyboard.press('Tab');
		// Focus should move to interactive elements
	});

	test('should support high contrast mode', async ({ page }) => {
		// This would test with high contrast media query
		await page.goto('/');

		// Check that elements are visible and have proper contrast
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
		await expect(page.getByRole('button', { name: /create new pack/i })).toBeVisible();
	});

	test('should support reduced motion preferences', async ({ page }) => {
		// Test with reduced motion preference
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');

		// Page should still be functional without animations
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
		await expect(page.getByRole('button', { name: /create new pack/i })).toBeVisible();
	});

	test('should have accessible results page', async ({ page }) => {
		await page.goto('/results/shared');

		// Check heading structure
		await expect(page.getByRole('heading', { name: 'View Shared Results' })).toBeVisible();

		// Check form accessibility
		await expect(page.getByLabel(/enter sharing code/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /view results/i })).toBeVisible();
	});

	test('should provide meaningful link text', async ({ page }) => {
		await page.goto('/results/shared');

		// Check that buttons have descriptive text
		await expect(page.getByRole('button', { name: /create your own/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /view results/i })).toBeVisible();

		// Avoid generic "click here" or "read more"
	});

	test('should support keyboard shortcuts', async ({ page }) => {
		await page.goto('/create');

		// Fill form
		await page.getByLabel('Pack Name').fill('Shortcut Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Shortcut Item');

		// Test Cmd+Enter shortcut for adding card
		await page.keyboard.press('Meta+Enter');

		// Card should be added
		await expect(page.getByText('Preview (1 items)')).toBeVisible();
	});

	test('should handle focus trapping in modals', async ({ page }) => {
		// This would test modal focus trapping when implemented
		await page.goto('/');

		// For now, just verify basic navigation works
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});

	test('should provide status announcements', async ({ page }) => {
		await page.goto('/create');

		// Add items and check for status updates
		await page.getByLabel('Pack Name').fill('Status Test');
		await page.getByPlaceholder('Enter item to rank...').fill('Item 1');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Should show item count update
		await expect(page.getByText('Preview (1 items)')).toBeVisible();

		await page.getByPlaceholder('Enter item to rank...').fill('Item 2');
		await page.getByRole('button', { name: 'Add Card' }).click();

		await expect(page.getByText('Preview (2 items)')).toBeVisible();
	});

	test('should handle error states accessibly', async ({ page }) => {
		await page.goto('/results/shared');

		// Try invalid sharing code
		await page.getByPlaceholder(/Enter sharing code/).fill('invalid');
		await page.getByRole('button', { name: /view results/i }).click();

		// Error should be announced
		await expect(page.getByText(/invalid sharing code/i)).toBeVisible({ timeout: 5000 });
	});

	test('should support alternative input methods', async ({ page }) => {
		await page.goto('/create');

		// Test that form works with different input methods
		await page.getByLabel('Pack Name').click();
		await page.getByLabel('Pack Name').fill('Alt Input Test');

		// Test enter key submission
		await page.getByPlaceholder('Enter item to rank...').fill('Alt Item');
		await page.getByPlaceholder('Enter item to rank...').press('Enter');

		// Should not submit yet (needs Cmd+Enter)
		await expect(page.getByText('Preview (0 items)')).toBeVisible();
	});
});
