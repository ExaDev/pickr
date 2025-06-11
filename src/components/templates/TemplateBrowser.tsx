'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { useCardsStore } from '../../store';
import { 
	TEMPLATE_CATEGORIES, 
	DEFAULT_TEMPLATES, 
	getTemplatesByCategory, 
	searchTemplates,
	getPopularTemplates,
	getRecentTemplates,
	templateToPack,
	incrementTemplateUsage,
	type PackTemplate,
	type TemplateCategory
} from '../../lib/templates';

interface TemplateBrowserProps {
	onSelectTemplate?: (template: PackTemplate) => void;
	showSearch?: boolean;
	showCategories?: boolean;
	maxItems?: number;
	className?: string;
}

export function TemplateBrowser({ 
	onSelectTemplate, 
	showSearch = true,
	showCategories = true,
	maxItems,
	className = ''
}: TemplateBrowserProps) {
	const router = useRouter();
	const { addPack, addCardToPack } = useCardsStore();

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [view, setView] = useState<'popular' | 'recent' | 'category' | 'search'>('popular');

	const filteredTemplates = useMemo(() => {
		let templates: PackTemplate[] = [];

		if (view === 'search' && searchQuery.trim()) {
			templates = searchTemplates(searchQuery);
		} else if (view === 'category' && selectedCategory !== 'all') {
			templates = getTemplatesByCategory(selectedCategory);
		} else if (view === 'popular') {
			templates = getPopularTemplates();
		} else if (view === 'recent') {
			templates = getRecentTemplates();
		} else {
			templates = DEFAULT_TEMPLATES;
		}

		return maxItems ? templates.slice(0, maxItems) : templates;
	}, [searchQuery, selectedCategory, view, maxItems]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setView('search');
	};

	const handleCategorySelect = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setView('category');
	};

	const handleUseTemplate = (template: PackTemplate) => {
		try {
			// Create pack from template
			const packData = templateToPack(template);
			const newPack = addPack(packData);

			// Add cards to pack
			template.cards.forEach(cardContent => {
				addCardToPack(newPack.id, {
					content: cardContent,
				});
			});

			// Increment usage count
			incrementTemplateUsage(template.id);

			// Handle selection callback or navigate
			if (onSelectTemplate) {
				onSelectTemplate(template);
			} else {
				router.push(`/rank/${newPack.id}`);
			}
		} catch (error) {
			console.error('Failed to create pack from template:', error);
		}
	};

	const getViewTitle = () => {
		switch (view) {
			case 'popular': return 'Popular Templates';
			case 'recent': return 'Recent Templates';
			case 'category': 
				const category = TEMPLATE_CATEGORIES.find(c => c.id === selectedCategory);
				return category ? `${category.name} Templates` : 'Category Templates';
			case 'search': return `Search Results: "${searchQuery}"`;
			default: return 'All Templates';
		}
	};

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Search */}
			{showSearch && (
				<div className="space-y-4">
					<Input
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Search templates by name, description, or tags..."
						className="max-w-md"
					/>
					
					{/* Quick view buttons */}
					<div className="flex gap-2 flex-wrap">
						<Button
							variant={view === 'popular' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setView('popular')}
						>
							🔥 Popular
						</Button>
						<Button
							variant={view === 'recent' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setView('recent')}
						>
							🆕 Recent
						</Button>
						<Button
							variant={selectedCategory === 'all' ? 'default' : 'outline'}
							size="sm"
							onClick={() => {
								setSelectedCategory('all');
								setView('category');
							}}
						>
							📚 All Templates
						</Button>
					</div>
				</div>
			)}

			{/* Categories */}
			{showCategories && (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold">Browse by Category</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
						{TEMPLATE_CATEGORIES.map((category) => (
							<motion.button
								key={category.id}
								className={`p-3 rounded-lg border text-left transition-all ${
									selectedCategory === category.id
										? 'border-primary bg-primary/10 text-primary'
										: 'border-border hover:border-primary/50 hover:bg-muted/50'
								}`}
								onClick={() => handleCategorySelect(category.id)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="text-2xl mb-1">{category.icon}</div>
								<div className="font-medium text-sm">{category.name}</div>
								<div className="text-xs text-muted-foreground line-clamp-2">
									{category.description}
								</div>
							</motion.button>
						))}
					</div>
				</div>
			)}

			{/* Templates */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">{getViewTitle()}</h3>
					<span className="text-sm text-muted-foreground">
						{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
					</span>
				</div>

				<AnimatePresence mode="wait">
					{filteredTemplates.length > 0 ? (
						<motion.div
							key={view + selectedCategory + searchQuery}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							{filteredTemplates.map((template, index) => (
								<motion.div
									key={template.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<TemplateCard
										template={template}
										onUse={() => handleUseTemplate(template)}
									/>
								</motion.div>
							))}
						</motion.div>
					) : (
						<motion.div
							className="text-center py-12 text-muted-foreground"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<p className="text-lg font-medium mb-2">No templates found</p>
							<p>Try adjusting your search or browse different categories</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

interface TemplateCardProps {
	template: PackTemplate;
	onUse: () => void;
}

function TemplateCard({ template, onUse }: TemplateCardProps) {
	const category = TEMPLATE_CATEGORIES.find(c => c.id === template.category);

	return (
		<Card className="h-full transition-all hover:shadow-md hover:scale-[1.02]">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg line-clamp-2">{template.name}</CardTitle>
						<CardDescription className="line-clamp-2">
							{template.description}
						</CardDescription>
					</div>
					{category && (
						<div className="flex-shrink-0 text-2xl" title={category.name}>
							{category.icon}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Preview cards */}
				<div className="space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						{template.cards.length} items to rank:
					</p>
					<div className="flex flex-wrap gap-1">
						{template.cards.slice(0, 6).map((card, index) => (
							<span
								key={index}
								className="inline-block px-2 py-1 bg-muted text-xs rounded-md"
							>
								{card}
							</span>
						))}
						{template.cards.length > 6 && (
							<span className="inline-block px-2 py-1 bg-muted text-xs rounded-md">
								+{template.cards.length - 6} more
							</span>
						)}
					</div>
				</div>

				{/* Tags */}
				{template.tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{template.tags.slice(0, 3).map((tag, index) => (
							<span
								key={index}
								className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
							>
								#{tag}
							</span>
						))}
						{template.tags.length > 3 && (
							<span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
								+{template.tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Usage stats */}
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>{template.usageCount} uses</span>
					{category && <span>{category.name}</span>}
				</div>

				{/* Action button */}
				<Button onClick={onUse} className="w-full" size="sm">
					Start Ranking
				</Button>
			</CardContent>
		</Card>
	);
}