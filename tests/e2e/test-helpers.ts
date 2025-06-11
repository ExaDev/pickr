import { type Page, expect } from '@playwright/test';

/**
 * Test helper functions for pickr E2E tests
 */

export class PickrTestHelpers {
	constructor(private page: Page) {}

	/**
	 * Create a test pack with specified items
	 */
	async createPack(packName: string, items: string[], description?: string) {
		await this.page.goto('/create');

		// Fill pack details
		await this.page.getByLabel('Pack Name').fill(packName);
		if (description) {
			await this.page.getByLabel('Description').fill(description);
		}

		// Add items
		for (const item of items) {
			await this.page.getByPlaceholder('Enter item to rank...').fill(item);
			await this.page.getByRole('button', { name: 'Add Card' }).click();
		}

		// Verify items were added
		await expect(this.page.getByText(`Preview (${items.length} items)`)).toBeVisible();

		return {
			packName,
			itemCount: items.length,
			canStart: items.length >= 2,
		};
	}

	/**
	 * Start a ranking session from pack creation
	 */
	async startRanking() {
		const startButton = this.page.getByRole('button', { name: 'Start Ranking' });
		await expect(startButton).toBeEnabled();
		await startButton.click();

		// Wait for ranking interface to load
		await expect(this.page.getByText('Which do you prefer?')).toBeVisible();
		await expect(this.page.url()).toContain('/rank/');

		return {
			url: this.page.url(),
			packId: this.page.url().split('/rank/')[1],
		};
	}

	/**
	 * Complete a single comparison by clicking the first card
	 */
	async completeComparison() {
		await expect(this.page.getByText('Which do you prefer?')).toBeVisible();

		// Click first card
		const firstCard = this.page.locator('.cursor-grab').first();
		await expect(firstCard).toBeVisible();
		await firstCard.click();

		// Wait for transition
		await this.page.waitForTimeout(1000);

		return {
			completed: true,
		};
	}

	/**
	 * Complete an entire ranking session (all comparisons)
	 */
	async completeFullRanking(maxComparisons = 10) {
		let comparisonsCompleted = 0;

		while (comparisonsCompleted < maxComparisons) {
			// Check if ranking is complete
			const completionMessage = this.page.getByText('Ranking Complete!');
			if (await completionMessage.isVisible()) {
				break;
			}

			// Check if comparison interface is still available
			const comparisonText = this.page.getByText('Which do you prefer?');
			if (await comparisonText.isVisible()) {
				await this.completeComparison();
				comparisonsCompleted++;
			} else {
				break;
			}
		}

		// Verify completion
		await expect(this.page.getByText('Ranking Complete!')).toBeVisible({ timeout: 15000 });

		return {
			comparisonsCompleted,
			isComplete: true,
		};
	}

	/**
	 * Navigate to results page from completion screen
	 */
	async goToResults() {
		await expect(this.page.getByText('Ranking Complete!')).toBeVisible();
		await this.page.getByRole('button', { name: /view full results/i }).click();

		await expect(this.page.url()).toContain('/results/');
		await expect(this.page.getByText('Ranking Complete!')).toBeVisible();

		return {
			url: this.page.url(),
			sessionId: this.page.url().split('/results/')[1],
		};
	}

	/**
	 * Open share modal and get share URL
	 */
	async getShareUrl() {
		await this.page.getByRole('button', { name: /share results/i }).click();
		await expect(this.page.getByText('Share Your Results')).toBeVisible();

		const urlInput = this.page.locator('input[readonly]');
		await expect(urlInput).toBeVisible();

		const shareUrl = await urlInput.inputValue();

		// Close modal
		await this.page.getByRole('button', { name: /close/i }).click();

		return shareUrl;
	}

	/**
	 * Navigate to shared results page and load a code
	 */
	async loadSharedResult(pacoCode: string) {
		await this.page.goto('/results/shared');

		await this.page.getByPlaceholder(/Enter sharing code/).fill(pacoCode);
		await this.page.getByRole('button', { name: /view results/i }).click();

		// Wait for results to load
		await this.page.waitForTimeout(2000);

		return {
			loaded: true,
			hasError: await this.page.getByText(/invalid sharing code/i).isVisible(),
		};
	}

	/**
	 * Check if element is in viewport
	 */
	async isInViewport(selector: string): Promise<boolean> {
		return await this.page.evaluate(selector => {
			const element = document.querySelector(selector);
			if (!element) return false;

			const rect = element.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		}, selector);
	}

	/**
	 * Wait for animations to complete
	 */
	async waitForAnimations(timeout = 2000) {
		await this.page.waitForTimeout(timeout);

		// Wait for any CSS transitions/animations to complete
		await this.page.evaluate(() => {
			return Promise.all(document.getAnimations().map(animation => animation.finished));
		});
	}

	/**
	 * Get current pack data from local storage
	 */
	async getPacksFromStorage() {
		return await this.page.evaluate(() => {
			const data = localStorage.getItem('pickr-cards-storage');
			return data ? JSON.parse(data) : null;
		});
	}

	/**
	 * Clear all local storage data
	 */
	async clearStorage() {
		await this.page.evaluate(() => {
			localStorage.clear();
		});
	}

	/**
	 * Set viewport for mobile testing
	 */
	async setMobileViewport() {
		await this.page.setViewportSize({ width: 375, height: 667 });
	}

	/**
	 * Set viewport for tablet testing
	 */
	async setTabletViewport() {
		await this.page.setViewportSize({ width: 768, height: 1024 });
	}

	/**
	 * Set viewport for desktop testing
	 */
	async setDesktopViewport() {
		await this.page.setViewportSize({ width: 1200, height: 800 });
	}

	/**
	 * Take screenshot with timestamp
	 */
	async takeTimestampedScreenshot(name: string) {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		await this.page.screenshot({
			path: `screenshots/${name}-${timestamp}.png`,
			fullPage: true,
		});
	}

	/**
	 * Check for JavaScript errors on page
	 */
	async checkForErrors() {
		const errors: string[] = [];

		this.page.on('pageerror', error => {
			errors.push(error.message);
		});

		this.page.on('console', msg => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		return errors;
	}

	/**
	 * Simulate slow network conditions
	 */
	async simulateSlowNetwork() {
		await this.page.route('**/*', async route => {
			await new Promise(resolve => setTimeout(resolve, 100));
			await route.continue();
		});
	}

	/**
	 * Check page performance metrics
	 */
	async getPerformanceMetrics() {
		return await this.page.evaluate(() => {
			const navigation = performance.getEntriesByType(
				'navigation'
			)[0] as PerformanceNavigationTiming;
			return {
				loadTime: navigation.loadEventEnd - navigation.loadEventStart,
				domContentLoaded:
					navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
				firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
				firstContentfulPaint:
					performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
			};
		});
	}
}

/**
 * Test data generators
 */
export const TestData = {
	/**
	 * Generate test pack names
	 */
	generatePackName: (prefix = 'Test Pack') => {
		const timestamp = Date.now();
		return `${prefix} ${timestamp}`;
	},

	/**
	 * Generate test items for different scenarios
	 */
	getTestItems: {
		minimal: ['Item A', 'Item B'],
		small: ['Apple', 'Banana', 'Cherry'],
		medium: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
		large: [
			'Option 1',
			'Option 2',
			'Option 3',
			'Option 4',
			'Option 5',
			'Option 6',
			'Option 7',
			'Option 8',
			'Option 9',
			'Option 10',
		],
		movies: [
			'The Matrix',
			'Inception',
			'Interstellar',
			'The Dark Knight',
			'Pulp Fiction',
			'The Godfather',
			'Star Wars',
			'Avatar',
		],
		fruits: [
			'Apple',
			'Banana',
			'Orange',
			'Grape',
			'Strawberry',
			'Mango',
			'Pineapple',
			'Watermelon',
			'Blueberry',
			'Kiwi',
		],
	},

	/**
	 * Generate random test items
	 */
	generateRandomItems: (count: number, prefix = 'Item') => {
		return Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`);
	},
};

/**
 * Common assertions for pickr testing
 */
export const PickrAssertions = {
	/**
	 * Assert pack creation page elements
	 */
	async assertPackCreationPage(page: Page) {
		await expect(page.getByRole('heading', { name: 'Create New Pack' })).toBeVisible();
		await expect(page.getByLabel('Pack Name')).toBeVisible();
		await expect(page.getByPlaceholder('Enter item to rank...')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Add Card' })).toBeVisible();
	},

	/**
	 * Assert ranking interface elements
	 */
	async assertRankingInterface(page: Page) {
		await expect(page.getByText('Which do you prefer?')).toBeVisible();
		await expect(page.getByText('VS')).toBeVisible();
		await expect(page.locator('.cursor-grab')).toHaveCount(2);
		await expect(page.getByText(/comparison \d+ of \d+/i)).toBeVisible();
	},

	/**
	 * Assert results page elements
	 */
	async assertResultsPage(page: Page) {
		await expect(page.getByText('Ranking Complete!')).toBeVisible();
		await expect(page.getByText('Final Rankings')).toBeVisible();
		await expect(page.getByText('Total Comparisons')).toBeVisible();
		await expect(page.getByRole('button', { name: /share results/i })).toBeVisible();
	},

	/**
	 * Assert shared results page elements
	 */
	async assertSharedResultsPage(page: Page) {
		await expect(page.getByText('View Shared Results')).toBeVisible();
		await expect(page.getByPlaceholder(/Enter sharing code/)).toBeVisible();
		await expect(page.getByRole('button', { name: /view results/i })).toBeVisible();
	},
};
