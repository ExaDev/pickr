'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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
import { decodeFromPaco, validatePacoCode } from '../../lib/paco/encoding';
import { formatDate } from '../../lib/utils';
import type { PacoData, RankedCard } from '../../types';

interface ComparisonData extends PacoData {
	label: string;
	color: string;
}

const COMPARISON_COLORS = [
	'#3b82f6', // blue
	'#ef4444', // red
	'#10b981', // emerald
	'#f59e0b', // amber
	'#8b5cf6', // violet
	'#ec4899', // pink
];

export default function ComparePage() {
	const [inputs, setInputs] = useState<string[]>(['', '']);
	const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	const addInput = () => {
		if (inputs.length < 6) {
			setInputs([...inputs, '']);
		}
	};

	const removeInput = (index: number) => {
		if (inputs.length > 2) {
			const newInputs = inputs.filter((_, i) => i !== index);
			setInputs(newInputs);

			// Clear corresponding error
			const newErrors = errors.filter((_, i) => i !== index);
			setErrors(newErrors);
		}
	};

	const updateInput = (index: number, value: string) => {
		const newInputs = [...inputs];
		newInputs[index] = value;
		setInputs(newInputs);

		// Clear error for this input
		if (errors[index]) {
			const newErrors = [...errors];
			newErrors[index] = '';
			setErrors(newErrors);
		}
	};

	const loadComparisons = async () => {
		setLoading(true);
		const newComparisons: ComparisonData[] = [];
		const newErrors: string[] = [];

		for (let i = 0; i < inputs.length; i++) {
			const code = inputs[i].trim();

			if (!code) {
				newErrors[i] = '';
				continue;
			}

			if (!validatePacoCode(code)) {
				newErrors[i] = 'Invalid sharing code format';
				continue;
			}

			try {
				const decoded = decodeFromPaco(code);
				if (!decoded) {
					newErrors[i] = 'Failed to decode sharing code';
					continue;
				}

				newComparisons.push({
					...decoded,
					label: `Ranking ${i + 1}`,
					color: COMPARISON_COLORS[i % COMPARISON_COLORS.length],
				});
				newErrors[i] = '';
			} catch (_error) {
				newErrors[i] = 'Error loading ranking data';
			}
		}

		setErrors(newErrors);
		setComparisons(newComparisons);
		setLoading(false);
	};

	const clearAll = () => {
		setInputs(['', '']);
		setComparisons([]);
		setErrors([]);
	};

	// Calculate consensus ranking
	const calculateConsensus = (): RankedCard[] => {
		if (comparisons.length === 0) return [];

		// Get all unique items across all rankings
		const allItems = new Map<
			string,
			{ content: string; imageUrl?: string; totalScore: number; count: number; rankings: number[] }
		>();

		comparisons.forEach((comparison, compIndex) => {
			comparison.rankings.forEach(rankedCard => {
				const key = rankedCard.content; // Use content as key for matching

				if (!allItems.has(key)) {
					allItems.set(key, {
						content: rankedCard.content,
						imageUrl: rankedCard.imageUrl,
						totalScore: 0,
						count: 0,
						rankings: new Array(comparisons.length).fill(0),
					});
				}

				const item = allItems.get(key);
				if (!item) return;
				// Inverse ranking (higher rank = lower score)
				const normalizedScore =
					(comparison.rankings.length - rankedCard.rank + 1) / comparison.rankings.length;
				item.totalScore += normalizedScore;
				item.count++;
				item.rankings[compIndex] = rankedCard.rank;
			});
		});

		// Convert to ranked cards and sort by average score
		const consensusItems: RankedCard[] = Array.from(allItems.entries()).map(
			([_key, item], index) => ({
				id: `consensus-${index}`,
				content: item.content,
				imageUrl: item.imageUrl,
				rank: 0, // Will be set after sorting
				score: item.totalScore / comparisons.length, // Average normalized score
				wins: 0, // Not applicable for consensus
				losses: 0, // Not applicable for consensus
				ties: 0,
				createdAt: new Date(),
			})
		);

		// Sort by score (descending) and assign ranks
		consensusItems.sort((a, b) => b.score - a.score);
		consensusItems.forEach((item, index) => {
			item.rank = index + 1;
		});

		return consensusItems;
	};

	const consensus = calculateConsensus();

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header */}
				<header className="text-center mb-12">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl font-bold mb-4">Compare Rankings</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Compare multiple ranking results side by side to find consensus or identify
							differences
						</p>
					</motion.div>
				</header>

				{/* Input Section */}
				<motion.div
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>Enter Sharing Codes</CardTitle>
							<CardDescription>
								Add 2-6 sharing codes to compare different ranking results
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{inputs.map((input, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={input}
										onChange={e => updateInput(index, e.target.value)}
										placeholder={`Sharing code ${index + 1} (e.g., p_ABC123...)`}
										className={`font-mono flex-1 ${errors[index] ? 'border-destructive' : ''}`}
									/>
									{inputs.length > 2 && (
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={() => removeInput(index)}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<title>Remove input</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</Button>
									)}
								</div>
							))}

							{/* Error messages */}
							{errors.some(Boolean) && (
								<div className="space-y-1">
									{errors.map(
										(error, index) =>
											error && (
												<p key={index} className="text-sm text-destructive">
													Ranking {index + 1}: {error}
												</p>
											)
									)}
								</div>
							)}

							{/* Actions */}
							<div className="flex gap-2 pt-2">
								<Button onClick={loadComparisons} disabled={loading || !inputs.some(Boolean)}>
									{loading ? 'Loading...' : 'Compare Rankings'}
								</Button>
								{inputs.length < 6 && (
									<Button type="button" variant="outline" onClick={addInput}>
										Add Another
									</Button>
								)}
								{comparisons.length > 0 && (
									<Button type="button" variant="outline" onClick={clearAll}>
										Clear All
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Results */}
				{comparisons.length > 0 && (
					<>
						{/* Consensus Section */}
						{consensus.length > 0 && (
							<motion.div
								className="mb-12"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<h2 className="text-2xl font-semibold mb-6">Consensus Ranking</h2>
								<Card>
									<CardHeader>
										<CardDescription>
											Average ranking across all {comparisons.length} results
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{consensus.slice(0, 10).map((item, _index) => (
												<div
													key={item.id}
													className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
												>
													<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
														{item.rank}
													</div>
													<div className="flex-1">
														<PickrCard
															card={item}
															variant="compact"
															className="border-0 shadow-none bg-transparent"
														/>
													</div>
													<div className="text-sm font-medium text-right">
														{Math.round(item.score * 100)}% avg
													</div>
												</div>
											))}
											{consensus.length > 10 && (
												<p className="text-sm text-muted-foreground text-center pt-2">
													... and {consensus.length - 10} more items
												</p>
											)}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						)}

						{/* Individual Rankings */}
						<motion.div
							className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
						>
							{comparisons.map((comparison, index) => (
								<Card key={index}>
									<CardHeader>
										<div className="flex items-center gap-3">
											<div
												className="w-4 h-4 rounded-full"
												style={{ backgroundColor: comparison.color }}
											/>
											<div className="flex-1">
												<CardTitle className="text-lg">{comparison.label}</CardTitle>
												<CardDescription>
													{formatDate(comparison.metadata.timestamp)} •{' '}
													{comparison.metadata.algorithm}
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 max-h-96 overflow-y-auto">
											{comparison.rankings.slice(0, 10).map(rankedCard => (
												<div
													key={rankedCard.id}
													className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
												>
													<div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-semibold">
														{rankedCard.rank}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">{rankedCard.content}</p>
													</div>
													<div className="text-xs text-muted-foreground">
														{Math.round(rankedCard.score * 100)}%
													</div>
												</div>
											))}
											{comparison.rankings.length > 10 && (
												<p className="text-xs text-muted-foreground text-center pt-1">
													... and {comparison.rankings.length - 10} more
												</p>
											)}
										</div>
									</CardContent>
								</Card>
							))}
						</motion.div>
					</>
				)}

				{/* Empty state */}
				{comparisons.length === 0 && !loading && (
					<motion.div
						className="text-center py-12 text-muted-foreground"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<title>No comparisons chart icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</div>
						<p className="text-lg font-medium mb-2">No Comparisons Yet</p>
						<p>Enter sharing codes above to start comparing rankings</p>
					</motion.div>
				)}
			</div>
		</div>
	);
}
