'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCardsStore, useRankingStore } from '../../../store';
import { ComparisonView } from '../../../components/ranking/ComparisonView';
import { RankingSidebar } from '../../../components/ranking/RankingSidebar';
import { Button } from '../../../components/ui/Button';
import { generateNextComparison, calculateProgress, isRankingComplete, calculateFinalRankings, getDefaultRankingSettings } from '../../../lib/ranking/utils';
import type { Card, Comparison } from '../../../types';

interface RankingPageProps {
	params: {
		packId: string;
	};
}

export default function RankingPage({ params }: RankingPageProps) {
	const router = useRouter();
	const { getPackById } = useCardsStore();
	const { currentSession, startSession, submitComparison, endSession } = useRankingStore();
	
	const [pack, setPack] = useState(useCardsStore.getState().getPackById(params.packId));
	const [currentComparison, setCurrentComparison] = useState<Comparison | null>(null);
	const [rankings, setRankings] = useState<any[]>([]);
	const [isComplete, setIsComplete] = useState(false);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	// Initialize session when component mounts
	useEffect(() => {
		if (!pack) {
			router.push('/');
			return;
		}

		if (!currentSession || currentSession.packId !== params.packId) {
			const session = startSession({
				packId: params.packId,
				settings: getDefaultRankingSettings(),
			});
			
			// Generate first comparison
			generateNextComparison();
		}
	}, [pack, params.packId]);

	// Generate next comparison
	const generateNextComparison = () => {
		if (!pack || !currentSession) return;

		const nextCards = generateNextComparison(
			pack.cards,
			currentSession.comparisons,
			currentSession.settings
		);

		if (nextCards) {
			const comparison: Comparison = {
				id: crypto.randomUUID(),
				cards: nextCards,
				timestamp: new Date(),
			};
			setCurrentComparison(comparison);
		} else {
			// No more comparisons needed - ranking is complete
			completeRanking();
		}
	};

	// Handle comparison selection
	const handleComparisonSelect = (winner: Card) => {
		if (!currentComparison || !currentSession) return;

		const completedComparison = {
			...currentComparison,
			winner,
			timestamp: new Date(),
		};

		// Add to session
		submitComparison(winner);

		// Update current rankings
		updateCurrentRankings();

		// Check if complete
		if (isRankingComplete(pack!.cards, [...currentSession.comparisons, completedComparison], currentSession.settings)) {
			completeRanking();
		} else {
			generateNextComparison();
		}
	};

	// Update current rankings based on completed comparisons
	const updateCurrentRankings = () => {
		if (!pack || !currentSession) return;

		const currentRankings = calculateFinalRankings(
			pack.cards,
			currentSession.comparisons,
			currentSession.settings
		);
		setRankings(currentRankings);
	};

	// Complete the ranking session
	const completeRanking = () => {
		if (!pack || !currentSession) return;

		const finalRankings = calculateFinalRankings(
			pack.cards,
			currentSession.comparisons,
			currentSession.settings
		);

		setRankings(finalRankings);
		setIsComplete(true);
		setCurrentComparison(null);
		endSession();
	};

	// Handle completion and navigation to results
	const handleViewResults = () => {
		if (!currentSession) return;
		router.push(`/results/${currentSession.id}`);
	};

	if (!pack) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Pack not found</h1>
					<Button onClick={() => router.push('/')}>
						Go Home
					</Button>
				</div>
			</div>
		);
	}

	if (pack.cards.length < 2) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Not enough items to rank</h1>
					<p className="text-muted-foreground mb-6">
						You need at least 2 items to create a ranking
					</p>
					<Button onClick={() => router.push(`/create`)}>
						Add More Items
					</Button>
				</div>
			</div>
		);
	}

	const progress = currentSession ? calculateProgress(
		pack.cards,
		currentSession.comparisons,
		currentSession.settings
	) : null;

	return (
		<div className="min-h-screen bg-background flex">
			{/* Main content */}
			<div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'mr-0' : 'mr-80'}`}>
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<header className="mb-8">
						<div className="flex items-center gap-4 mb-4">
							<Button
								variant="ghost"
								onClick={() => router.push('/')}
							>
								← Back to Packs
							</Button>
							<div>
								<h1 className="text-3xl font-bold">{pack.name}</h1>
								{pack.description && (
									<p className="text-muted-foreground">{pack.description}</p>
								)}
							</div>
						</div>
					</header>

					{/* Ranking content */}
					{isComplete ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold mb-4">Ranking Complete!</h2>
							<p className="text-muted-foreground mb-8">
								You've completed all comparisons. Check out your final ranking.
							</p>
							<div className="flex items-center justify-center gap-4">
								<Button onClick={handleViewResults} size="lg">
									View Full Results
								</Button>
								<Button variant="outline" onClick={() => router.push('/')}>
									Create Another Pack
								</Button>
							</div>
						</div>
					) : currentComparison ? (
						<ComparisonView
							comparison={currentComparison}
							onSelect={handleComparisonSelect}
							showProgress={true}
							progress={progress ? {
								current: progress.completedComparisons + 1,
								total: progress.totalComparisons
							} : undefined}
						/>
					) : (
						<div className="text-center py-12">
							<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
							<p className="text-muted-foreground">Preparing your next comparison...</p>
						</div>
					)}
				</div>
			</div>

			{/* Sidebar */}
			<RankingSidebar
				rankings={rankings}
				isComplete={isComplete}
				isCollapsed={sidebarCollapsed}
				onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
			/>
		</div>
	);
}