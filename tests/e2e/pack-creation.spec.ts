import { expect, test } from '@playwright/test';

test.describe('Pack Creation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display landing page with create button', async ({ page }) => {
		// Check main heading
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();

		// Check create button
		await expect(page.getByRole('button', { name: /create new pack/i })).toBeVisible();

		// Check feature grid for new users
		await expect(page.getByText('Create Packs')).toBeVisible();
		await expect(page.getByText('Compare & Rank')).toBeVisible();
		await expect(page.getByText('Share Results')).toBeVisible();
	});

	test('should navigate to pack creation page', async ({ page }) => {
		// Click create new pack button
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Should navigate to create page
		await expect(page).toHaveURL('/create');
		await expect(page.getByRole('heading', { name: 'Create New Pack' })).toBeVisible();
	});

	test('should create a new pack with text cards', async ({ page }) => {
		// Navigate to create page
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Fill pack details
		await page.getByLabel('Pack Name').fill('Test Movies');
		await page.getByLabel('Description').fill('My favorite movies to rank');

		// Add first card
		await page.getByPlaceholder('Enter item to rank...').fill('The Matrix');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Add second card
		await page.getByPlaceholder('Enter item to rank...').fill('Inception');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Add third card
		await page.getByPlaceholder('Enter item to rank...').fill('Interstellar');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Check preview shows cards
		await expect(page.getByText('Preview (3 items)')).toBeVisible();
		await expect(page.getByText('The Matrix')).toBeVisible();
		await expect(page.getByText('Inception')).toBeVisible();
		await expect(page.getByText('Interstellar')).toBeVisible();

		// Start ranking should be enabled
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeEnabled();
	});

	test('should validate pack creation form', async ({ page }) => {
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Start ranking should be disabled without pack name
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeDisabled();

		// Add pack name
		await page.getByLabel('Pack Name').fill('Test Pack');

		// Still disabled without cards
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeDisabled();

		// Add one card - still disabled (need minimum 2)
		await page.getByPlaceholder('Enter item to rank...').fill('Item 1');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeDisabled();

		// Add second card - now enabled
		await page.getByPlaceholder('Enter item to rank...').fill('Item 2');
		await page.getByRole('button', { name: 'Add Card' }).click();
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeEnabled();
	});

	test('should remove cards from preview', async ({ page }) => {
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Add pack name
		await page.getByLabel('Pack Name').fill('Test Pack');

		// Add cards
		await page.getByPlaceholder('Enter item to rank...').fill('Card 1');
		await page.getByRole('button', { name: 'Add Card' }).click();

		await page.getByPlaceholder('Enter item to rank...').fill('Card 2');
		await page.getByRole('button', { name: 'Add Card' }).click();

		await page.getByPlaceholder('Enter item to rank...').fill('Card 3');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Check all cards are visible
		await expect(page.getByText('Preview (3 items)')).toBeVisible();

		// Remove first card by hovering and clicking X
		await page.locator('.group').first().hover();
		await page.locator('.group').first().getByRole('button').click();

		// Should now have 2 items
		await expect(page.getByText('Preview (2 items)')).toBeVisible();
	});

	test('should handle empty pack name validation', async ({ page }) => {
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Add cards without pack name
		await page.getByPlaceholder('Enter item to rank...').fill('Item 1');
		await page.getByRole('button', { name: 'Add Card' }).click();

		await page.getByPlaceholder('Enter item to rank...').fill('Item 2');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Button should be disabled
		await expect(page.getByRole('button', { name: 'Start Ranking' })).toBeDisabled();

		// Should show validation message
		await expect(page.getByText('Add a pack name')).toBeVisible();
	});

	test('should clear form after adding card', async ({ page }) => {
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Add a card
		const input = page.getByPlaceholder('Enter item to rank...');
		await input.fill('Test Card');
		await page.getByRole('button', { name: 'Add Card' }).click();

		// Input should be cleared
		await expect(input).toHaveValue('');
	});

	test('should show character count for pack name', async ({ page }) => {
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Type in card input to see character count
		const cardInput = page.getByPlaceholder('Enter item to rank...');
		await cardInput.fill('Test content');

		// Should show character count (implementation dependent)
		await expect(page.getByText(/characters/)).toBeVisible();
	});

	test('should navigate back from create page', async ({ page }) => {
		await page
			.getByRole('button', { name: /create new pack/i })
			.first()
			.click();

		// Click back button
		await page.getByRole('button', { name: /back/i }).click();

		// Should return to home page
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'pickr' })).toBeVisible();
	});
});
