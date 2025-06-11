#!/usr/bin/env node

/**
 * Template Setup Script
 * Replaces template placeholders with user-provided values
 */

const fs = require('node:fs');
const readline = require('node:readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = query => {
	return new Promise(resolve => {
		rl.question(query, resolve);
	});
};

const defaultValues = {
	PROJECT_NAME: 'my-nextjs-app',
	PROJECT_DESCRIPTION: 'A modern Next.js application',
	REPOSITORY_URL: 'https://github.com/username/repository',
	AUTHOR_NAME: 'Author Name',
	AUTHOR_EMAIL: 'author@example.com',
	LICENSE: 'MIT',
	APP_NAME: 'My Next.js App',
	APP_DESCRIPTION: 'A modern, fast, and secure web application built with Next.js',
	FEATURE_1_TITLE: 'Fast Performance',
	FEATURE_1_DESCRIPTION: 'Optimized for speed with modern build tools and best practices',
	FEATURE_2_TITLE: 'Type Safety',
	FEATURE_2_DESCRIPTION: 'Built with TypeScript for better development experience',
	FEATURE_3_TITLE: 'Modern UI',
	FEATURE_3_DESCRIPTION: 'Beautiful, responsive design with Tailwind CSS',
	FEATURE_4_TITLE: 'Ready to Deploy',
	FEATURE_4_DESCRIPTION: 'Configured for automatic deployment to GitHub Pages',
	CTA_TITLE: 'Get Started',
	CTA_DESCRIPTION: 'Ready to build something amazing? Start exploring the features.',
	CTA_BUTTON_TEXT: 'Start Building',
};

const filesToUpdate = [
	'package.json',
	'README.md',
	'src/app/page.tsx',
	'src/app/layout.tsx',
	'CLAUDE.md',
];

async function getConfiguration() {
	console.log('🚀 Setting up your Next.js template...\n');
	console.log('Press Enter to use default values shown in brackets.\n');

	const config = {};

	// Project configuration
	console.log('📦 Project Configuration:');
	config.PROJECT_NAME =
		(await question(`Project name [${defaultValues.PROJECT_NAME}]: `)) ||
		defaultValues.PROJECT_NAME;
	config.PROJECT_DESCRIPTION =
		(await question(`Project description [${defaultValues.PROJECT_DESCRIPTION}]: `)) ||
		defaultValues.PROJECT_DESCRIPTION;
	config.REPOSITORY_URL =
		(await question(`Repository URL [${defaultValues.REPOSITORY_URL}]: `)) ||
		defaultValues.REPOSITORY_URL;
	config.AUTHOR_NAME =
		(await question(`Author name [${defaultValues.AUTHOR_NAME}]: `)) || defaultValues.AUTHOR_NAME;
	config.AUTHOR_EMAIL =
		(await question(`Author email [${defaultValues.AUTHOR_EMAIL}]: `)) ||
		defaultValues.AUTHOR_EMAIL;
	config.LICENSE =
		(await question(`License [${defaultValues.LICENSE}]: `)) || defaultValues.LICENSE;

	console.log('\n🎨 Application Configuration:');
	config.APP_NAME =
		(await question(`App name [${defaultValues.APP_NAME}]: `)) || defaultValues.APP_NAME;
	config.APP_DESCRIPTION =
		(await question(`App description [${defaultValues.APP_DESCRIPTION}]: `)) ||
		defaultValues.APP_DESCRIPTION;

	console.log('\n⭐ Features Configuration:');
	config.FEATURE_1_TITLE =
		(await question(`Feature 1 title [${defaultValues.FEATURE_1_TITLE}]: `)) ||
		defaultValues.FEATURE_1_TITLE;
	config.FEATURE_1_DESCRIPTION =
		(await question(`Feature 1 description [${defaultValues.FEATURE_1_DESCRIPTION}]: `)) ||
		defaultValues.FEATURE_1_DESCRIPTION;
	config.FEATURE_2_TITLE =
		(await question(`Feature 2 title [${defaultValues.FEATURE_2_TITLE}]: `)) ||
		defaultValues.FEATURE_2_TITLE;
	config.FEATURE_2_DESCRIPTION =
		(await question(`Feature 2 description [${defaultValues.FEATURE_2_DESCRIPTION}]: `)) ||
		defaultValues.FEATURE_2_DESCRIPTION;
	config.FEATURE_3_TITLE =
		(await question(`Feature 3 title [${defaultValues.FEATURE_3_TITLE}]: `)) ||
		defaultValues.FEATURE_3_TITLE;
	config.FEATURE_3_DESCRIPTION =
		(await question(`Feature 3 description [${defaultValues.FEATURE_3_DESCRIPTION}]: `)) ||
		defaultValues.FEATURE_3_DESCRIPTION;
	config.FEATURE_4_TITLE =
		(await question(`Feature 4 title [${defaultValues.FEATURE_4_TITLE}]: `)) ||
		defaultValues.FEATURE_4_TITLE;
	config.FEATURE_4_DESCRIPTION =
		(await question(`Feature 4 description [${defaultValues.FEATURE_4_DESCRIPTION}]: `)) ||
		defaultValues.FEATURE_4_DESCRIPTION;

	console.log('\n🎯 Call-to-Action Configuration:');
	config.CTA_TITLE =
		(await question(`CTA title [${defaultValues.CTA_TITLE}]: `)) || defaultValues.CTA_TITLE;
	config.CTA_DESCRIPTION =
		(await question(`CTA description [${defaultValues.CTA_DESCRIPTION}]: `)) ||
		defaultValues.CTA_DESCRIPTION;
	config.CTA_BUTTON_TEXT =
		(await question(`CTA button text [${defaultValues.CTA_BUTTON_TEXT}]: `)) ||
		defaultValues.CTA_BUTTON_TEXT;

	return config;
}

function replaceInFile(filePath, replacements) {
	if (!fs.existsSync(filePath)) {
		console.log(`⚠️  File not found: ${filePath}`);
		return;
	}

	let content = fs.readFileSync(filePath, 'utf8');

	for (const [placeholder, value] of Object.entries(replacements)) {
		// Handle both formats: {{ PLACEHOLDER }} and {{PLACEHOLDER}}
		const regexWithSpaces = new RegExp(`{{ ${placeholder} }}`, 'g');
		const regexWithoutSpaces = new RegExp(`{{${placeholder}}}`, 'g');
		content = content.replace(regexWithSpaces, value);
		content = content.replace(regexWithoutSpaces, value);
	}

	fs.writeFileSync(filePath, content, 'utf8');
	console.log(`✅ Updated: ${filePath}`);
}

function updateLayoutFile(config) {
	const layoutPath = 'src/app/layout.tsx';
	if (!fs.existsSync(layoutPath)) {
		console.log(`⚠️  File not found: ${layoutPath}`);
		return;
	}

	let content = fs.readFileSync(layoutPath, 'utf8');

	// Update metadata
	content = content.replace(/title: ['""][^'"]*['""],/, `title: '${config.APP_NAME}',`);
	content = content.replace(
		/description: ['""][^'"]*['""],/,
		`description: '${config.APP_DESCRIPTION}',`
	);

	fs.writeFileSync(layoutPath, content, 'utf8');
	console.log(`✅ Updated: ${layoutPath}`);
}

async function main() {
	try {
		const config = await getConfiguration();

		console.log('\n🔄 Updating files...');

		// Update specified files
		filesToUpdate.forEach(file => {
			if (file === 'src/app/layout.tsx') {
				updateLayoutFile(config);
			} else {
				replaceInFile(file, config);
			}
		});

		// Create .env.local template
		const envContent = `# Environment Variables
# Copy this file to .env.local and update with your values

NEXT_PUBLIC_APP_NAME="${config.APP_NAME}"
`;

		fs.writeFileSync('.env.example', envContent, 'utf8');
		console.log('✅ Created: .env.example');

		console.log('\n🎉 Template setup complete!');
		console.log('\nNext steps:');
		console.log('1. Run: npm install');
		console.log('2. Run: npm run dev');
		console.log('3. Open: http://localhost:3000');
		console.log('\n📚 Read the README.md for more information.');
	} catch (error) {
		console.error('❌ Setup failed:', error.message);
		process.exit(1);
	} finally {
		rl.close();
	}
}

if (require.main === module) {
	main();
}

module.exports = { replaceInFile, updateLayoutFile };
