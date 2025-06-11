export interface ExamplePack {
	id: string;
	name: string;
	description: string;
	category: string;
	cards: string[];
}

export const EXAMPLE_PACKS: ExamplePack[] = [
	// Tech & Digital
	{
		id: 'smartphone-manufacturers',
		name: 'Smartphone Manufacturers',
		description: 'Rank the top smartphone brands',
		category: 'Tech & Digital',
		cards: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing'],
	},
	{
		id: 'gaming-consoles',
		name: 'Gaming Console Brands',
		description: 'Which gaming platform reigns supreme?',
		category: 'Tech & Digital',
		cards: ['PlayStation', 'Xbox', 'Nintendo', 'Steam Deck', 'ASUS ROG Ally'],
	},
	{
		id: 'streaming-platforms',
		name: 'Streaming Platforms',
		description: 'Rank your favorite video streaming services',
		category: 'Tech & Digital',
		cards: ['Netflix', 'Disney+', 'HBO Max', 'Apple TV+', 'Amazon Prime', 'Hulu'],
	},
	{
		id: 'web-browsers',
		name: 'Web Browsers',
		description: 'Which browser do you prefer?',
		category: 'Tech & Digital',
		cards: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Brave', 'Opera'],
	},

	// Everyday Categories
	{
		id: 'coffee-shops',
		name: 'Coffee Shop Chains',
		description: 'Rank the best coffee chains',
		category: 'Everyday',
		cards: ['Starbucks', "Dunkin'", 'Tim Hortons', 'Costa', "Peet's", 'Dutch Bros'],
	},
	{
		id: 'fast-food',
		name: 'Fast Food Chains',
		description: 'Which fast food chain is your favorite?',
		category: 'Everyday',
		cards: ["McDonald's", 'Burger King', "Wendy's", 'Five Guys', 'In-N-Out', 'Shake Shack'],
	},
	{
		id: 'pizza-chains',
		name: 'Pizza Chains',
		description: 'Rank your favorite pizza delivery chains',
		category: 'Everyday',
		cards: ["Domino's", 'Pizza Hut', "Papa John's", 'Little Caesars', 'Blaze Pizza'],
	},
	{
		id: 'airlines',
		name: 'Airlines',
		description: 'Which airline provides the best experience?',
		category: 'Everyday',
		cards: ['Delta', 'United', 'Southwest', 'JetBlue', 'American', 'Emirates'],
	},

	// Entertainment & Lifestyle
	{
		id: 'music-streaming',
		name: 'Music Streaming Services',
		description: 'Rank the best music streaming platforms',
		category: 'Entertainment',
		cards: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Tidal'],
	},
	{
		id: 'movie-genres',
		name: 'Movie Genres',
		description: 'Which movie genre is your favorite?',
		category: 'Entertainment',
		cards: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary'],
	},
	{
		id: 'workout-types',
		name: 'Workout Types',
		description: 'Rank your preferred exercise activities',
		category: 'Entertainment',
		cards: ['Running', 'Weightlifting', 'Yoga', 'Swimming', 'Cycling', 'HIIT', 'Pilates'],
	},
	{
		id: 'vacation-styles',
		name: 'Vacation Styles',
		description: "What's your ideal vacation type?",
		category: 'Entertainment',
		cards: ['Beach', 'Mountains', 'City', 'Cruise', 'Road Trip', 'Camping', 'Resort'],
	},

	// Shopping & Brands
	{
		id: 'clothing-retailers',
		name: 'Clothing Retailers',
		description: 'Rank your favorite clothing brands',
		category: 'Shopping',
		cards: ['Nike', 'Adidas', 'Uniqlo', 'H&M', 'Zara', 'Gap', 'Lululemon'],
	},
	{
		id: 'online-retailers',
		name: 'Online Retailers',
		description: 'Which online store do you prefer?',
		category: 'Shopping',
		cards: ['Amazon', 'eBay', 'Etsy', 'Walmart', 'Target', 'Best Buy'],
	},
	{
		id: 'car-manufacturers',
		name: 'Car Manufacturers',
		description: 'Rank the top automotive brands',
		category: 'Shopping',
		cards: ['Toyota', 'Honda', 'Tesla', 'Ford', 'BMW', 'Mercedes', 'Hyundai'],
	},

	// Food & Beverage
	{
		id: 'soda-brands',
		name: 'Soda Brands',
		description: 'Which soft drink brand is best?',
		category: 'Food & Beverage',
		cards: ['Coca-Cola', 'Pepsi', 'Dr Pepper', 'Sprite', 'Mountain Dew', 'Fanta'],
	},
	{
		id: 'coffee-types',
		name: 'Coffee Types',
		description: 'Rank your favorite coffee drinks',
		category: 'Food & Beverage',
		cards: ['Espresso', 'Latte', 'Cappuccino', 'Americano', 'Cold Brew', 'French Press'],
	},
	{
		id: 'cuisine-types',
		name: 'Cuisine Types',
		description: 'Which type of cuisine do you prefer?',
		category: 'Food & Beverage',
		cards: ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mediterranean'],
	},
	{
		id: 'ice-cream-brands',
		name: 'Ice Cream Brands',
		description: 'Rank the best ice cream brands',
		category: 'Food & Beverage',
		cards: ["Ben & Jerry's", 'Häagen-Dazs', 'Breyers', 'Blue Bell', 'Talenti'],
	},
];

export const EXAMPLE_CATEGORIES = [
	'Tech & Digital',
	'Everyday',
	'Entertainment',
	'Shopping',
	'Food & Beverage',
];

export function getExamplePacksByCategory(category: string): ExamplePack[] {
	return EXAMPLE_PACKS.filter(pack => pack.category === category);
}

export function getExamplePackById(id: string): ExamplePack | undefined {
	return EXAMPLE_PACKS.find(pack => pack.id === id);
}
