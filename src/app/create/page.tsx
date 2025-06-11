'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CardForm } from '../../components/cards/CardForm';
import { PickrCard } from '../../components/cards/PickrCard';
import { Button } from '../../components/ui/Button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useKeyboardShortcuts } from '../../lib/hooks/useKeyboardShortcuts';
import { useCardsStore } from '../../store';
import type { CardInput } from '../../types';

export default function CreatePackPage() {
	const router = useRouter();
	const { addPack, addCardToPack } = useCardsStore();

	const [packName, setPackName] = useState('');
	const [packDescription, setPackDescription] = useState('');
	const [cards, setCards] = useState<CardInput[]>([]);
	const [isCreating, setIsCreating] = useState(false);

	const handleAddCard = (cardInput: CardInput) => {
		setCards(prev => [...prev, cardInput]);
	};

	const handleRemoveCard = (index: number) => {
		setCards(prev => prev.filter((_, i) => i !== index));
	};

	const handleCreatePack = async () => {
		if (!packName.trim() || cards.length < 2) {
			return;
		}

		setIsCreating(true);
		try {
			// Create the pack
			const newPack = addPack({
				name: packName.trim(),
				description: packDescription.trim() || undefined,
			});

			// Add all cards to the pack
			for (const cardInput of cards) {
				addCardToPack(newPack.id, cardInput);
			}

			// Navigate to the ranking page
			router.push(`/rank?packId=${newPack.id}`);
		} catch (error) {
			console.error('Error creating pack:', error);
		} finally {
			setIsCreating(false);
		}
	};

	const canCreate = packName.trim() && cards.length >= 2;

	// Keyboard shortcuts for create page
	useKeyboardShortcuts([
		{
			key: 'Enter',
			modifiers: ['ctrl'],
			handler: () => {
				if (canCreate) {
					handleCreatePack();
				}
			},
			description: 'Create pack (Ctrl+Enter)',
			disabled: !canCreate || isCreating,
		},
		{
			key: 'Escape',
			handler: () => {
				router.back();
			},
			description: 'Go back (Escape)',
		},
	]);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<header className="mb-8">
					<div className="flex items-center gap-4 mb-4">
						<Button
							variant="ghost"
							onClick={() => router.back()}
							aria-label="Go back to previous page"
						>
							← Back
						</Button>
						<div>
							<h1 className="text-3xl font-bold">Create New Pack</h1>
							<p className="text-muted-foreground">Add items you want to rank and compare</p>
						</div>
					</div>
					<div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
						<strong>Keyboard shortcuts:</strong> Ctrl+Enter to create pack • Escape to go back
					</div>
				</header>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Pack details and card form */}
					<div className="space-y-6">
						{/* Pack information */}
						<Card>
							<CardHeader>
								<CardTitle>Pack Details</CardTitle>
								<CardDescription>Give your pack a name and description</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="pack-name" className="text-sm font-medium">
										Pack Name *
									</label>
									<Input
										id="pack-name"
										value={packName}
										onChange={e => setPackName(e.target.value)}
										placeholder="e.g., Best Movies of 2023"
										maxLength={100}
										required
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="pack-description" className="text-sm font-medium">
										Description (optional)
									</label>
									<Input
										id="pack-description"
										value={packDescription}
										onChange={e => setPackDescription(e.target.value)}
										placeholder="A brief description of what you're ranking"
										maxLength={200}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Add cards */}
						<Card>
							<CardHeader>
								<CardTitle>Add Items</CardTitle>
								<CardDescription>
									Add at least 2 items to rank (minimum for comparison)
								</CardDescription>
							</CardHeader>
							<CardContent>
								<CardForm
									onSubmit={handleAddCard}
									disabled={isCreating}
									placeholder="Enter item to rank..."
								/>
							</CardContent>
						</Card>

						{/* Create button */}
						<div className="flex items-center gap-4">
							<Button
								onClick={handleCreatePack}
								disabled={!canCreate || isCreating}
								className="flex-1"
								size="lg"
							>
								{isCreating ? (
									<>
										<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
										Creating Pack...
									</>
								) : (
									'Start Ranking'
								)}
							</Button>
							{!canCreate && (
								<p className="text-sm text-muted-foreground">
									{!packName.trim()
										? 'Add a pack name'
										: cards.length < 2
											? `Add ${2 - cards.length} more item${2 - cards.length === 1 ? '' : 's'}`
											: ''}
								</p>
							)}
						</div>
					</div>

					{/* Preview */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Preview ({cards.length} items)</CardTitle>
								<CardDescription>Items you've added so far</CardDescription>
							</CardHeader>
							<CardContent>
								{cards.length === 0 ? (
									<div className="text-center py-12 text-muted-foreground">
										<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
											<svg
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<title>Add new item icon</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												/>
											</svg>
										</div>
										<p className="text-sm">No items added yet</p>
										<p className="text-xs">Add your first item using the form</p>
									</div>
								) : (
									<div className="space-y-3 max-h-96 overflow-y-auto">
										{cards.map((card, index) => (
											<div
												key={`preview-${index}-${card.content.slice(0, 10)}`}
												className="relative group"
											>
												<PickrCard
													card={{
														id: `preview-${index}`,
														content: card.content,
														imageUrl: card.imageUrl,
														createdAt: new Date(),
													}}
													variant="compact"
												/>
												<Button
													variant="destructive"
													size="icon"
													className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={() => handleRemoveCard(index)}
												>
													<svg
														className="w-3 h-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<title>Remove item</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</Button>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
