'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	EXAMPLE_CATEGORIES,
	EXAMPLE_PACKS,
	type ExamplePack,
	getExamplePacksByCategory,
} from '../../lib/example-packs';
import { useCardsStore } from '../../store';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

export function ExamplePacks() {
	const router = useRouter();
	const { addPack, addCardToPack } = useCardsStore();
	const [selectedCategory, setSelectedCategory] = useState('Tech & Digital');

	const handleUseExamplePack = (examplePack: ExamplePack) => {
		// Create the pack
		const newPack = addPack({
			name: examplePack.name,
			description: examplePack.description,
		});

		// Add all cards to the pack
		examplePack.cards.forEach(cardContent => {
			addCardToPack(newPack.id, {
				content: cardContent,
			});
		});

		// Navigate to the ranking page
		router.push(`/rank/${newPack.id}`);
	};

	const categoryPacks = getExamplePacksByCategory(selectedCategory);

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-2">Try Example Packs</h2>
				<p className="text-muted-foreground">
					Get started quickly with these pre-made ranking packs
				</p>
			</div>

			{/* Category tabs */}
			<div className="flex flex-wrap gap-2 justify-center">
				{EXAMPLE_CATEGORIES.map(category => (
					<Button
						key={category}
						variant={selectedCategory === category ? 'default' : 'outline'}
						size="sm"
						onClick={() => setSelectedCategory(category)}
						className="text-xs"
					>
						{category}
					</Button>
				))}
			</div>

			{/* Example packs grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{categoryPacks.map(examplePack => (
					<Card
						key={examplePack.id}
						className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] group border-primary/20"
					>
						<CardHeader className="pb-3">
							<CardTitle className="text-base group-hover:text-primary transition-colors">
								{examplePack.name}
							</CardTitle>
							<CardDescription className="text-sm">{examplePack.description}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Card preview */}
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground">Items ({examplePack.cards.length}):</p>
								<div className="text-sm space-y-1">
									{examplePack.cards.slice(0, 3).map((card, index) => (
										<div key={index} className="truncate text-muted-foreground">
											• {card}
										</div>
									))}
									{examplePack.cards.length > 3 && (
										<div className="text-xs text-muted-foreground">
											+{examplePack.cards.length - 3} more...
										</div>
									)}
								</div>
							</div>

							{/* Action button */}
							<div className="pt-2 border-t">
								<Button
									size="sm"
									className="w-full"
									onClick={() => handleUseExamplePack(examplePack)}
								>
									Start Ranking
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="text-center pt-4">
				<p className="text-sm text-muted-foreground mb-4">Want to create your own custom pack?</p>
				<Button variant="outline" onClick={() => router.push('/create')}>
					Create Custom Pack
				</Button>
			</div>
		</div>
	);
}
