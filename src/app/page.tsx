'use client';

import { useRouter } from 'next/navigation';
import { ExamplePacks } from '../components/cards/ExamplePacks';
import { PackGrid } from '../components/cards/PackGrid';
import { TemplateBrowser } from '../components/templates/TemplateBrowser';
import { Button } from '../components/ui/Button';
import { useKeyboardShortcuts } from '../lib/hooks/useKeyboardShortcuts';
import { useCardsStore } from '../store';

export default function Home() {
	const router = useRouter();
	const { packs, deletePack } = useCardsStore();

	const handleCreatePack = () => {
		router.push('/create');
	};

	const handleSelectPack = (pack: { id: string }) => {
		router.push(`/rank/${pack.id}`);
	};

	const handleDeletePack = (packId: string) => {
		if (confirm('Are you sure you want to delete this pack?')) {
			deletePack(packId);
		}
	};

	// Global keyboard shortcuts for homepage
	useKeyboardShortcuts([
		{
			key: 'c',
			handler: handleCreatePack,
			description: 'Create new pack (C)'
		},
		{
			key: 'n',
			handler: handleCreatePack,
			description: 'Create new pack (N)'
		}
	]);

	return (
		<main className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<header className="text-center mb-12">
					<h1 className="text-4xl font-bold text-foreground mb-4">pickr</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
						Create rankings through intuitive swipe-based comparisons. Compare anything from movies
						to life decisions with simple, binary choices.
					</p>
					<div className="text-sm text-muted-foreground mb-8 bg-muted/30 p-3 rounded-lg max-w-lg mx-auto">
						<strong>Quick actions:</strong> Press C or N to create a new pack
					</div>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button onClick={handleCreatePack} size="lg" aria-describedby="keyboard-hint">
							Create New Pack
						</Button>
						<Button variant="outline" size="lg" onClick={() => router.push('/templates')}>
							Browse Templates
						</Button>
						<Button variant="outline" size="lg" onClick={() => router.push('/compare')}>
							Compare Rankings
						</Button>
						<Button variant="ghost" size="lg" onClick={() => router.push('/results/shared')}>
							View Shared Results
						</Button>
					</div>
				</header>

				{/* Features grid for new users */}
				{packs.length === 0 && (
					<div className="grid md:grid-cols-3 gap-6 mb-12">
						<div className="text-center p-6">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Create packs icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold mb-2">Create Packs</h3>
							<p className="text-muted-foreground text-sm">
								Add items you want to rank - movies, restaurants, ideas, anything!
							</p>
						</div>
						<div className="text-center p-6">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Compare and rank icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold mb-2">Compare & Rank</h3>
							<p className="text-muted-foreground text-sm">
								Swipe through simple comparisons. Pick your preference from each pair.
							</p>
						</div>
						<div className="text-center p-6">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Share results icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold mb-2">Share Results</h3>
							<p className="text-muted-foreground text-sm">
								Get your final ranking and share it with others via a simple link.
							</p>
						</div>
					</div>
				)}

				{/* Template browser for new users */}
				{packs.length === 0 && (
					<section className="mb-12">
						<h2 className="text-2xl font-semibold text-center mb-8">Get Started with Templates</h2>
						<TemplateBrowser showSearch={false} showCategories={true} maxItems={12} />
						<div className="text-center mt-8">
							<Button variant="outline" onClick={() => router.push('/templates')}>
								View All Templates
							</Button>
						</div>
					</section>
				)}

				{/* Packs section */}
				<section>
					{packs.length > 0 && (
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-semibold">Your Packs</h2>
							<Button onClick={handleCreatePack} variant="outline">
								Create New Pack
							</Button>
						</div>
					)}

					<PackGrid
						packs={packs}
						onSelectPack={handleSelectPack}
						onDeletePack={handleDeletePack}
						onCreatePack={packs.length === 0 ? undefined : handleCreatePack}
					/>
				</section>
			</div>
		</main>
	);
}
