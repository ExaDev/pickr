import { expect, test } from '@playwright/test';

test('comprehensive style check', async ({ page }) => {
	// Go to homepage
	await page.goto('http://localhost:3001');

	// Wait for page to fully load
	await page.waitForLoadState('networkidle');

	// Take screenshot of homepage
	await page.screenshot({ path: 'homepage-full.png', fullPage: true });

	// Check computed styles on homepage
	const homeStyles = await page.evaluate(() => {
		const body = document.body;
		const main = document.querySelector('main');
		const h1 = document.querySelector('h1');
		const button = document.querySelector('button');

		return {
			bodyStyles: getComputedStyle(body),
			bodyBg: getComputedStyle(body).backgroundColor,
			bodyFont: getComputedStyle(body).fontFamily,
			mainExists: !!main,
			mainStyles: main ? getComputedStyle(main) : null,
			h1Exists: !!h1,
			h1Styles: h1
				? {
						fontSize: getComputedStyle(h1).fontSize,
						fontWeight: getComputedStyle(h1).fontWeight,
						color: getComputedStyle(h1).color,
					}
				: null,
			buttonExists: !!button,
			buttonStyles: button
				? {
						background: getComputedStyle(button).backgroundColor,
						color: getComputedStyle(button).color,
						padding: getComputedStyle(button).padding,
						borderRadius: getComputedStyle(button).borderRadius,
					}
				: null,
			stylesheetCount: document.styleSheets.length,
			stylesheetUrls: Array.from(document.styleSheets)
				.map(sheet => sheet.href)
				.filter(Boolean),
		};
	});

	console.log('Homepage styles:', JSON.stringify(homeStyles, null, 2));

	// Go to create page
	await page.goto('http://localhost:3001/create');
	await page.waitForLoadState('networkidle');

	// Take screenshot of create page
	await page.screenshot({ path: 'create-full.png', fullPage: true });

	// Check create page styles
	const createStyles = await page.evaluate(() => {
		const form = document.querySelector('form');
		const input = document.querySelector('input[type="text"]');
		const card = document.querySelector('[class*="card"]');

		return {
			formExists: !!form,
			inputExists: !!input,
			inputStyles: input
				? {
						border: getComputedStyle(input).border,
						borderRadius: getComputedStyle(input).borderRadius,
						padding: getComputedStyle(input).padding,
						background: getComputedStyle(input).backgroundColor,
					}
				: null,
			cardExists: !!card,
			cardStyles: card
				? {
						background: getComputedStyle(card).backgroundColor,
						border: getComputedStyle(card).border,
						borderRadius: getComputedStyle(card).borderRadius,
						boxShadow: getComputedStyle(card).boxShadow,
					}
				: null,
			allClasses: Array.from(document.querySelectorAll('*'))
				.slice(0, 10)
				.map(el => el.className)
				.filter(Boolean),
		};
	});

	console.log('Create page styles:', JSON.stringify(createStyles, null, 2));

	// Create a pack and check ranking page
	await page.getByLabel('Pack Name').fill('Style Check Pack');
	await page.getByPlaceholder('Enter item to rank...').fill('Item A');
	await page.getByRole('button', { name: 'Add Card' }).click();
	await page.getByPlaceholder('Enter item to rank...').fill('Item B');
	await page.getByRole('button', { name: 'Add Card' }).click();

	await page.screenshot({ path: 'create-with-items.png', fullPage: true });

	// Navigate to ranking
	await Promise.all([
		page.waitForURL('**/rank/**'),
		page.getByRole('button', { name: 'Start Ranking' }).click(),
	]);

	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(3000); // Wait for any async loading

	// Take screenshot of ranking page
	await page.screenshot({ path: 'ranking-full.png', fullPage: true });

	// Check ranking page styles and structure
	const rankingStyles = await page.evaluate(() => {
		const sidebar = document.querySelector('[class*="sidebar"]') || document.querySelector('aside');
		const comparisonArea =
			document.querySelector('[class*="comparison"]') || document.querySelector('main');
		const cards = document.querySelectorAll('[class*="card"]');

		return {
			sidebarExists: !!sidebar,
			sidebarVisible: sidebar ? getComputedStyle(sidebar).display !== 'none' : false,
			comparisonExists: !!comparisonArea,
			cardCount: cards.length,
			pageContent: document.body.innerText.substring(0, 500),
			hasWhichDoYouPrefer: document.body.innerText.includes('Which do you prefer'),
			hasPreparing: document.body.innerText.includes('Preparing'),
			allElementsWithCursor: Array.from(document.querySelectorAll('*')).filter(
				el => getComputedStyle(el).cursor === 'grab' || el.className.includes('cursor-grab')
			).length,
		};
	});

	console.log('Ranking page content and styles:', JSON.stringify(rankingStyles, null, 2));
});
