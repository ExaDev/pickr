import type { Card, Comparison, RankingSettings, RankingProgress } from '../../types';
import { getRankingAlgorithm } from './algorithms';

/**
 * Generate the next comparison for a ranking session
 */
export function generateNextComparison(
	cards: Card[],
	completedComparisons: Comparison[],
	settings: RankingSettings
): Card[] | null {
	const algorithm = getRankingAlgorithm(settings.algorithm);
	return algorithm.generateNextComparison(cards, completedComparisons, settings);
}

/**
 * Calculate progress of a ranking session
 */
export function calculateProgress(
	cards: Card[],
	completedComparisons: Comparison[],
	settings: RankingSettings
): RankingProgress {
	const algorithm = getRankingAlgorithm(settings.algorithm);
	const estimatedTotal = algorithm.getEstimatedComparisons(cards.length, settings);
	const completed = completedComparisons.filter(comp => comp.winner).length;

	return {
		totalComparisons: estimatedTotal,
		completedComparisons: completed,
		percentComplete: estimatedTotal > 0 ? Math.min((completed / estimatedTotal) * 100, 100) : 0,
	};
}

/**
 * Check if a ranking session is complete
 */
export function isRankingComplete(
	cards: Card[],
	completedComparisons: Comparison[],
	settings: RankingSettings
): boolean {
	const algorithm = getRankingAlgorithm(settings.algorithm);
	return algorithm.isComplete(cards, completedComparisons, settings);
}

/**
 * Calculate final rankings from completed comparisons
 */
export function calculateFinalRankings(
	cards: Card[],
	comparisons: Comparison[],
	settings: RankingSettings
) {
	const algorithm = getRankingAlgorithm(settings.algorithm);
	return algorithm.calculateRankings(cards, comparisons);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Validate ranking settings
 */
export function validateRankingSettings(settings: RankingSettings, cardCount: number): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (settings.comparisonSize < 2) {
		errors.push('Comparison size must be at least 2');
	}

	if (settings.comparisonSize > cardCount) {
		errors.push('Comparison size cannot be larger than the number of cards');
	}

	if (cardCount < 2) {
		errors.push('At least 2 cards are required for ranking');
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Get default ranking settings
 */
export function getDefaultRankingSettings(): RankingSettings {
	return {
		comparisonSize: 2,
		algorithm: 'pairwise',
	};
}

/**
 * Format comparison for display
 */
export function formatComparison(comparison: Comparison): string {
	const cardNames = comparison.cards.map(card => card.content).join(' vs ');
	const winner = comparison.winner ? ` (Winner: ${comparison.winner.content})` : '';
	return `${cardNames}${winner}`;
}

/**
 * Calculate time estimates for ranking session
 */
export function estimateSessionTime(
	cardCount: number,
	settings: RankingSettings,
	averageComparisonTimeMs: number = 5000 // 5 seconds per comparison
): {
	estimatedComparisons: number;
	estimatedTimeMs: number;
	estimatedTimeFormatted: string;
} {
	const algorithm = getRankingAlgorithm(settings.algorithm);
	const estimatedComparisons = algorithm.getEstimatedComparisons(cardCount, settings);
	const estimatedTimeMs = estimatedComparisons * averageComparisonTimeMs;

	const minutes = Math.floor(estimatedTimeMs / 60000);
	const seconds = Math.floor((estimatedTimeMs % 60000) / 1000);
	
	let formatted = '';
	if (minutes > 0) {
		formatted += `${minutes}m `;
	}
	formatted += `${seconds}s`;

	return {
		estimatedComparisons,
		estimatedTimeMs,
		estimatedTimeFormatted: formatted,
	};
}