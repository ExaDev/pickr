'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRankingStore, useResultsStore } from '../../../store';
import { calculateFinalRankings } from '../../../lib/ranking/utils';
import { encodeToPaco, getShareableUrl } from '../../../lib/paco/encoding';
import { PickrCard } from '../../../components/cards/PickrCard';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { formatDate, formatDuration } from '../../../lib/utils';
import type { RankingSession, RankingResult, PacoData } from '../../../types';

interface ResultsPageProps {
	params: {
		sessionId: string;
	};
}

export default function ResultsPage({ params }: ResultsPageProps) {
	const router = useRouter();
	const { getSessionById } = useRankingStore();
	const { addResult, generatePacoCode } = useResultsStore();
	
	const [session, setSession] = useState<RankingSession | null>(null);
	const [result, setResult] = useState<RankingResult | null>(null);
	const [shareUrl, setShareUrl] = useState<string>('');
	const [copying, setCopying] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);

	useEffect(() => {
		const sessionData = getSessionById(params.sessionId);
		if (!sessionData) {
			router.push('/');
			return;
		}

		setSession(sessionData);

		// Create result if not exists
		if (sessionData.isComplete) {
			// Calculate final rankings (this should be done when session completes)
			// For now, we'll recreate it here
			const finalRankings = calculateFinalRankings(
				[], // We need pack data here - should be stored in session
				sessionData.comparisons,
				sessionData.settings
			);

			const resultData: RankingResult = {
				id: `result_${sessionData.id}`,
				sessionId: sessionData.id,
				packId: sessionData.packId,
				rankings: finalRankings,
				createdAt: sessionData.updatedAt,
				metadata: {
					totalComparisons: sessionData.comparisons.length,
					algorithm: sessionData.settings.algorithm,
					completionTime: sessionData.updatedAt.getTime() - sessionData.createdAt.getTime(),
				}
			};

			// Store result
			const storedResult = addResult(resultData);
			setResult(storedResult);

			// Generate Paco code
			const pacoData: PacoData = {
				packId: resultData.packId,
				rankings: resultData.rankings,
				metadata: {
					timestamp: resultData.createdAt,
					version: '1.0',
					algorithm: resultData.metadata.algorithm,
				}
			};

			try {
				const pacoCode = encodeToPaco(pacoData);
				const url = getShareableUrl(pacoCode);
				setShareUrl(url);
			} catch (error) {
				console.error('Failed to generate share URL:', error);
			}
		}
	}, [params.sessionId]);

	const handleCopyUrl = async () => {
		if (!shareUrl) return;

		setCopying(true);
		try {
			await navigator.clipboard.writeText(shareUrl);
		} catch (error) {
			// Fallback for browsers that don't support clipboard API
			const textArea = document.createElement('textarea');
			textArea.value = shareUrl;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
		} finally {
			setCopying(false);
			setTimeout(() => setCopying(false), 2000);
		}
	};

	const handleShare = () => {
		setShowShareModal(true);
	};

	const handleNewRanking = () => {
		router.push('/');
	};

	if (!session || !result) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading results...</p>
				</div>
			</div>
		);
	}

	const duration = formatDuration(Math.round(result.metadata.completionTime / 60000));

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Header */}
				<header className="text-center mb-12">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h1 className="text-4xl font-bold mb-4">Ranking Complete!</h1>
						<p className="text-xl text-muted-foreground">
							Here are your final results from {result.rankings.length} items
						</p>
					</motion.div>
				</header>

				{/* Stats */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Total Comparisons</CardDescription>
							<CardTitle className="text-3xl">{result.metadata.totalComparisons}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Time Taken</CardDescription>
							<CardTitle className="text-3xl">{duration}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Algorithm Used</CardDescription>
							<CardTitle className="text-xl capitalize">{result.metadata.algorithm}</CardTitle>
						</CardHeader>
					</Card>
				</motion.div>

				{/* Rankings */}
				<motion.div
					className="mb-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<h2 className="text-2xl font-semibold mb-6">Final Rankings</h2>
					<div className="space-y-4">
						{result.rankings.map((rankedCard, index) => (
							<motion.div
								key={rankedCard.id}
								className="flex items-center gap-6 p-6 bg-card rounded-lg border"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
							>
								{/* Rank */}
								<div className="flex-shrink-0">
									<div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
										rankedCard.rank === 1 ? 'bg-yellow-500 text-white' :
										rankedCard.rank === 2 ? 'bg-gray-400 text-white' :
										rankedCard.rank === 3 ? 'bg-orange-600 text-white' :
										'bg-muted text-muted-foreground'
									}`}>
										{rankedCard.rank}
									</div>
								</div>

								{/* Card content */}
								<div className="flex-1">
									<PickrCard
										card={rankedCard}
										variant="compact"
										className="border-0 shadow-none bg-transparent"
									/>
								</div>

								{/* Stats */}
								<div className="flex-shrink-0 text-right space-y-1">
									<div className="text-sm font-medium">
										{Math.round(rankedCard.score * 100)}% win rate
									</div>
									<div className="text-xs text-muted-foreground">
										{rankedCard.wins}W - {rankedCard.losses}L
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Actions */}
				<motion.div
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<Button onClick={handleShare} size="lg" className="min-w-[160px]">
						Share Results
					</Button>
					<Button variant="outline" onClick={handleNewRanking} size="lg">
						Create New Ranking
					</Button>
				</motion.div>

				{/* Share Modal */}
				{showShareModal && (
					<motion.div
						className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowShareModal(false)}
					>
						<motion.div
							className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
						>
							<h3 className="text-xl font-semibold mb-4">Share Your Results</h3>
							<p className="text-muted-foreground mb-6">
								Copy this link to share your ranking with others:
							</p>
							<div className="flex gap-2 mb-6">
								<input
									type="text"
									value={shareUrl}
									readOnly
									className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
								/>
								<Button onClick={handleCopyUrl} disabled={copying} variant="outline">
									{copying ? 'Copied!' : 'Copy'}
								</Button>
							</div>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setShowShareModal(false)}>
									Close
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</div>
		</div>
	);
}