/**
 * Pack template system for creating and sharing reusable pack configurations
 */

import type { Pack } from '../types';

export interface PackTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	cards: string[];
	imageUrl?: string;
	author?: string;
	tags: string[];
	usageCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface TemplateCategory {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
	{
		id: 'tech',
		name: 'Tech & Digital',
		description: 'Technology, software, gadgets, and digital services',
		color: '#3b82f6',
		icon: '💻',
	},
	{
		id: 'entertainment',
		name: 'Entertainment',
		description: 'Movies, TV shows, music, games, and media',
		color: '#ef4444',
		icon: '🎬',
	},
	{
		id: 'lifestyle',
		name: 'Lifestyle',
		description: 'Fashion, travel, hobbies, and personal interests',
		color: '#10b981',
		icon: '🌟',
	},
	{
		id: 'food',
		name: 'Food & Beverage',
		description: 'Restaurants, cuisines, drinks, and culinary experiences',
		color: '#f59e0b',
		icon: '🍕',
	},
	{
		id: 'shopping',
		name: 'Shopping & Brands',
		description: 'Retail brands, products, and shopping experiences',
		color: '#8b5cf6',
		icon: '🛍️',
	},
	{
		id: 'education',
		name: 'Education & Learning',
		description: 'Courses, books, skills, and educational content',
		color: '#06b6d4',
		icon: '📚',
	},
	{
		id: 'health',
		name: 'Health & Fitness',
		description: 'Exercise, nutrition, wellness, and health topics',
		color: '#84cc16',
		icon: '💪',
	},
	{
		id: 'business',
		name: 'Business & Finance',
		description: 'Companies, investments, career, and business topics',
		color: '#64748b',
		icon: '📈',
	},
	{
		id: 'creative',
		name: 'Creative & Arts',
		description: 'Art, design, music, writing, and creative pursuits',
		color: '#ec4899',
		icon: '🎨',
	},
	{
		id: 'sports',
		name: 'Sports & Recreation',
		description: 'Sports teams, athletes, outdoor activities, and recreation',
		color: '#f97316',
		icon: '⚽',
	},
	{
		id: 'personal',
		name: 'Personal & Life',
		description: 'Life decisions, goals, relationships, and personal topics',
		color: '#6366f1',
		icon: '🤔',
	},
	{
		id: 'custom',
		name: 'Custom',
		description: 'User-created templates and unique categories',
		color: '#71717a',
		icon: '✨',
	},
];

export const DEFAULT_TEMPLATES: PackTemplate[] = [
	// Tech & Digital
	{
		id: 'smartphone-brands-2024',
		name: 'Best Smartphone Brands 2024',
		description: 'Rank the top smartphone manufacturers and their flagship devices',
		category: 'tech',
		cards: [
			'Apple iPhone',
			'Samsung Galaxy',
			'Google Pixel',
			'OnePlus',
			'Xiaomi',
			'Nothing Phone',
			'Sony Xperia',
			'ASUS ROG Phone',
		],
		tags: ['smartphones', 'technology', 'mobile', 'brands'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'programming-languages',
		name: 'Programming Languages',
		description: 'Which programming languages do you prefer for development?',
		category: 'tech',
		cards: [
			'JavaScript',
			'Python',
			'TypeScript',
			'Java',
			'C++',
			'Rust',
			'Go',
			'Swift',
			'Kotlin',
			'PHP',
		],
		tags: ['programming', 'coding', 'development', 'languages'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'ai-tools-2024',
		name: 'AI Tools & Platforms',
		description: 'Rank your favorite AI tools and platforms',
		category: 'tech',
		cards: [
			'ChatGPT',
			'Claude',
			'GitHub Copilot',
			'Midjourney',
			'Stable Diffusion',
			'Notion AI',
			'Grammarly',
			'Canva AI',
		],
		tags: ['ai', 'artificial-intelligence', 'tools', 'productivity'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},

	// Entertainment
	{
		id: 'marvel-movies',
		name: 'Marvel Cinematic Universe',
		description: 'Rank your favorite MCU movies from best to worst',
		category: 'entertainment',
		cards: [
			'Avengers: Endgame',
			'Iron Man',
			'The Avengers',
			'Thor: Ragnarok',
			'Guardians of the Galaxy',
			'Black Panther',
			'Spider-Man: Homecoming',
			'Doctor Strange',
		],
		tags: ['movies', 'marvel', 'superheroes', 'cinema'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'streaming-platforms',
		name: 'Streaming Services',
		description: 'Which streaming platform offers the best content?',
		category: 'entertainment',
		cards: [
			'Netflix',
			'Disney+',
			'HBO Max',
			'Amazon Prime Video',
			'Apple TV+',
			'Hulu',
			'YouTube Premium',
			'Paramount+',
		],
		tags: ['streaming', 'entertainment', 'tv', 'movies'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'music-genres',
		name: 'Music Genres',
		description: 'Rank your favorite music genres and styles',
		category: 'entertainment',
		cards: [
			'Pop',
			'Rock',
			'Hip-Hop',
			'Electronic',
			'Jazz',
			'Classical',
			'R&B',
			'Country',
			'Indie',
			'Metal',
		],
		tags: ['music', 'genres', 'audio', 'entertainment'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},

	// Food & Beverage
	{
		id: 'world-cuisines',
		name: 'World Cuisines',
		description: 'Rank your favorite international food styles',
		category: 'food',
		cards: [
			'Italian',
			'Japanese',
			'Mexican',
			'Indian',
			'Thai',
			'French',
			'Chinese',
			'Mediterranean',
			'Korean',
			'Vietnamese',
		],
		tags: ['food', 'cuisine', 'international', 'cooking'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'coffee-types',
		name: 'Coffee Drinks',
		description: 'Rank your favorite coffee preparations and drinks',
		category: 'food',
		cards: [
			'Espresso',
			'Cappuccino',
			'Latte',
			'Americano',
			'Mocha',
			'Macchiato',
			'Cold Brew',
			'French Press',
			'Pour Over',
			'Flat White',
		],
		tags: ['coffee', 'beverages', 'drinks', 'caffeine'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},

	// Sports & Recreation
	{
		id: 'olympic-sports',
		name: 'Olympic Sports',
		description: 'Which Olympic sports are most exciting to watch?',
		category: 'sports',
		cards: [
			'Swimming',
			'Athletics',
			'Gymnastics',
			'Basketball',
			'Soccer',
			'Tennis',
			'Cycling',
			'Volleyball',
			'Boxing',
			'Wrestling',
		],
		tags: ['olympics', 'sports', 'competition', 'athletics'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},

	// Lifestyle
	{
		id: 'travel-destinations',
		name: 'Dream Travel Destinations',
		description: 'Rank your bucket list travel destinations',
		category: 'lifestyle',
		cards: [
			'Japan',
			'New Zealand',
			'Iceland',
			'Italy',
			'Thailand',
			'Norway',
			'Australia',
			'Costa Rica',
			'Greece',
			'Morocco',
		],
		tags: ['travel', 'destinations', 'vacation', 'adventure'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'social-media-platforms',
		name: 'Social Media Platforms',
		description: 'Which social platforms do you use most?',
		category: 'lifestyle',
		cards: [
			'Instagram',
			'Twitter/X',
			'TikTok',
			'LinkedIn',
			'YouTube',
			'Facebook',
			'Discord',
			'Reddit',
			'Snapchat',
			'Pinterest',
		],
		tags: ['social-media', 'platforms', 'communication', 'networking'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},

	// Personal & Life
	{
		id: 'life-priorities',
		name: 'Life Priorities',
		description: 'Rank what matters most to you in life',
		category: 'personal',
		cards: [
			'Family',
			'Health',
			'Career',
			'Financial Security',
			'Personal Growth',
			'Relationships',
			'Hobbies',
			'Travel',
			'Education',
			'Community',
		],
		tags: ['life', 'priorities', 'values', 'personal-growth'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: 'productivity-methods',
		name: 'Productivity Methods',
		description: 'Which productivity techniques work best for you?',
		category: 'personal',
		cards: [
			'Pomodoro Technique',
			'Getting Things Done',
			'Time Blocking',
			'Eisenhower Matrix',
			'Kanban Boards',
			'Deep Work',
			'Habit Stacking',
			'Energy Management',
		],
		tags: ['productivity', 'organization', 'efficiency', 'methods'],
		usageCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(categoryId: string): PackTemplate[] {
	return DEFAULT_TEMPLATES.filter(template => template.category === categoryId);
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): PackTemplate | undefined {
	return DEFAULT_TEMPLATES.find(template => template.id === templateId);
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string): PackTemplate[] {
	const searchTerm = query.toLowerCase().trim();
	if (!searchTerm) return DEFAULT_TEMPLATES;

	return DEFAULT_TEMPLATES.filter(
		template =>
			template.name.toLowerCase().includes(searchTerm) ||
			template.description.toLowerCase().includes(searchTerm) ||
			template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
			template.cards.some(card => card.toLowerCase().includes(searchTerm))
	);
}

/**
 * Get popular templates (by usage count)
 */
export function getPopularTemplates(limit = 8): PackTemplate[] {
	return [...DEFAULT_TEMPLATES].sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
}

/**
 * Get recent templates
 */
export function getRecentTemplates(limit = 8): PackTemplate[] {
	return [...DEFAULT_TEMPLATES]
		.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
		.slice(0, limit);
}

/**
 * Convert template to pack
 */
export function templateToPack(
	template: PackTemplate
): Omit<Pack, 'id' | 'createdAt' | 'updatedAt' | 'cards'> & { cards: string[] } {
	return {
		name: template.name,
		description: template.description,
		cards: template.cards,
	};
}

/**
 * Increment template usage count
 */
export function incrementTemplateUsage(templateId: string): void {
	const template = getTemplateById(templateId);
	if (template) {
		template.usageCount++;
		template.updatedAt = new Date();
	}
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): TemplateCategory | undefined {
	return TEMPLATE_CATEGORIES.find(category => category.id === categoryId);
}
