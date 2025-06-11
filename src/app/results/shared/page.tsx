'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { decodeFromPaco, validatePacoCode } from '../../../lib/paco/encoding';
import { PickrCard } from '../../../components/cards/PickrCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { formatDate } from '../../../lib/utils';
import type { PacoData } from '../../../types';

export default function SharedResultsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const [pacoCode, setPacoCode] = useState('');
	const [result, setResult] = useState<PacoData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Check for code in URL params
	useEffect(() => {
		const code = searchParams.get('code');
		if (code) {
			setPacoCode(code);
			loadResults(code);
		}
	}, [searchParams]);

	const loadResults = async (code: string) => {
		if (!code.trim()) {
			setError('Please enter a sharing code');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const decoded = decodeFromPaco(code.trim());
			if (!decoded) {
				setError('Invalid sharing code. Please check the code and try again.');
				return;
			}

			setResult(decoded);
		} catch (err) {
			setError('Failed to load results. The sharing code may be corrupted or invalid.');
			console.error('Failed to decode Paco data:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loadResults(pacoCode);
	};

	const handleCreateOwnRanking = () => {
		router.push('/');
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading shared results...</p>
				</div>
			</div>
		);
	}

	if (!result) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8 max-w-2xl">
					<header className="text-center mb-12">
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h1 className="text-4xl font-bold mb-4">View Shared Results</h1>
							<p className="text-xl text-muted-foreground">
								Enter a sharing code to view someone's ranking results
							</p>
						</motion.div>
					</header>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Card>
							<CardHeader>
								<CardTitle>Enter Sharing Code</CardTitle>
								<CardDescription>
									Paste the sharing code you received to view the ranking results
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-4">
									<Input
										value={pacoCode}
										onChange={(e) => setPacoCode(e.target.value)}
										placeholder="Enter sharing code (e.g., p_ABC123...)"
										className="font-mono"
									/>
									
									{error && (
										<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
											<p className="text-sm text-destructive">{error}</p>
										</div>
									)}

									<div className="flex gap-2">
										<Button type="submit" disabled={!pacoCode.trim()} className="flex-1">
											View Results
										</Button>
										<Button type="button" variant="outline" onClick={handleCreateOwnRanking}>
											Create Your Own
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</motion.div>

					{/* How it works */}
					<motion.div
						className="mt-12 text-center text-sm text-muted-foreground"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<p className="mb-2">
							Sharing codes are generated when someone completes a ranking and chooses to share their results.
						</p>
						<p>
							The code contains all the ranking data in a compact, shareable format.
						</p>
					</motion.div>
				</div>
			</div>
		);
	}

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
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
							</svg>
						</div>
						<h1 className="text-4xl font-bold mb-4">Shared Ranking Results</h1>
						<p className="text-xl text-muted-foreground">
							Results from {result.rankings.length} items ranked on {formatDate(result.metadata.timestamp)}
						</p>
					</motion.div>
				</header>

				{/* Metadata */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Ranking Method</CardDescription>
							<CardTitle className="text-xl capitalize">{result.metadata.algorithm}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Date Created</CardDescription>
							<CardTitle className="text-xl">{formatDate(result.metadata.timestamp)}</CardTitle>
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
					<h2 className="text-2xl font-semibold mb-6">Rankings</h2>
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
					<Button onClick={handleCreateOwnRanking} size="lg">
						Create Your Own Ranking
					</Button>
					<Button variant="outline" onClick={() => router.push('/results/shared')} size="lg">
						View Another Result
					</Button>
				</motion.div>

				{/* Footer info */}
				<motion.div
					className="mt-12 text-center text-sm text-muted-foreground"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.8 }}
				>
					<p>Created with pickr - the swipe-based ranking tool</p>
				</motion.div>
			</div>
		</div>
	);
}