import type { Card, Comparison, RankedCard, RankingSettings } from '../../types';

export interface RankingAlgorithm {
	generateNextComparison(cards: Card[], completed: Comparison[], settings: RankingSettings): Card[] | null;
	calculateRankings(cards: Card[], comparisons: Comparison[]): RankedCard[];
	isComplete(cards: Card[], comparisons: Comparison[], settings: RankingSettings): boolean;
	getEstimatedComparisons(cardCount: number, settings: RankingSettings): number;
}

/**
 * Pairwise comparison algorithm using round-robin tournament style
 */
export class PairwiseRanking implements RankingAlgorithm {
	generateNextComparison(
		cards: Card[],
		completed: Comparison[],
		settings: RankingSettings
	): Card[] | null {
		if (cards.length < 2) return null;

		// Create a set of completed comparisons for quick lookup
		const completedPairs = new Set<string>();
		completed.forEach((comparison) => {
			if (comparison.cards.length === 2) {
				const [card1, card2] = comparison.cards;
				const pairKey = [card1.id, card2.id].sort().join('-');
				completedPairs.add(pairKey);
			}
		});

		// Find the next pair that hasn't been compared
		for (let i = 0; i < cards.length; i++) {
			for (let j = i + 1; j < cards.length; j++) {
				const card1 = cards[i];
				const card2 = cards[j];
				const pairKey = [card1.id, card2.id].sort().join('-');

				if (!completedPairs.has(pairKey)) {
					return [card1, card2];
				}
			}
		}

		return null; // All pairs have been compared
	}

	calculateRankings(cards: Card[], comparisons: Comparison[]): RankedCard[] {
		// Initialize score tracking
		const scores = new Map<string, { wins: number; losses: number; ties: number }>();
		
		cards.forEach((card) => {
			scores.set(card.id, { wins: 0, losses: 0, ties: 0 });
		});

		// Process all comparisons
		comparisons.forEach((comparison) => {
			if (comparison.winner && comparison.cards.length === 2) {
				const [card1, card2] = comparison.cards;
				const winnerId = comparison.winner.id;
				const loserId = winnerId === card1.id ? card2.id : card1.id;

				const winnerStats = scores.get(winnerId);
				const loserStats = scores.get(loserId);

				if (winnerStats && loserStats) {
					winnerStats.wins++;
					loserStats.losses++;
				}
			}
		});

		// Calculate final scores and rankings
		const rankedCards: RankedCard[] = cards.map((card) => {
			const stats = scores.get(card.id) || { wins: 0, losses: 0, ties: 0 };
			const totalGames = stats.wins + stats.losses + stats.ties;
			const winRate = totalGames > 0 ? stats.wins / totalGames : 0;
			
			return {
				...card,
				rank: 0, // Will be set below
				score: winRate,
				wins: stats.wins,
				losses: stats.losses,
				ties: stats.ties,
			};
		});

		// Sort by score (descending) then by wins (descending)
		rankedCards.sort((a, b) => {
			if (a.score !== b.score) {
				return b.score - a.score;
			}
			return b.wins - a.wins;
		});

		// Assign ranks
		rankedCards.forEach((card, index) => {
			card.rank = index + 1;
		});

		return rankedCards;
	}

	isComplete(cards: Card[], comparisons: Comparison[], settings: RankingSettings): boolean {
		const totalPairs = (cards.length * (cards.length - 1)) / 2;
		const completedComparisons = comparisons.filter(
			(comp) => comp.winner && comp.cards.length === 2
		).length;

		return completedComparisons >= totalPairs;
	}

	getEstimatedComparisons(cardCount: number, settings: RankingSettings): number {
		return (cardCount * (cardCount - 1)) / 2;
	}
}

/**
 * Tournament elimination algorithm for faster ranking
 */
export class TournamentRanking implements RankingAlgorithm {
	generateNextComparison(
		cards: Card[],
		completed: Comparison[],
		settings: RankingSettings
	): Card[] | null {
		// Simple single-elimination tournament
		// This is a simplified implementation
		const remainingCards = this.getRemainingCards(cards, completed);
		
		if (remainingCards.length < 2) return null;
		
		// Take the first two remaining cards
		return [remainingCards[0], remainingCards[1]];
	}

	private getRemainingCards(cards: Card[], completed: Comparison[]): Card[] {
		const eliminatedIds = new Set<string>();
		
		completed.forEach((comparison) => {
			if (comparison.winner && comparison.cards.length === 2) {
				const loserId = comparison.cards.find(c => c.id !== comparison.winner!.id)?.id;
				if (loserId) {
					eliminatedIds.add(loserId);
				}
			}
		});

		return cards.filter(card => !eliminatedIds.has(card.id));
	}

	calculateRankings(cards: Card[], comparisons: Comparison[]): RankedCard[] {
		// For tournament, ranking is based on elimination order
		const eliminationOrder = new Map<string, number>();
		const winCounts = new Map<string, number>();
		
		cards.forEach((card) => {
			winCounts.set(card.id, 0);
		});

		let round = 1;
		comparisons.forEach((comparison) => {
			if (comparison.winner && comparison.cards.length === 2) {
				const winnerId = comparison.winner.id;
				const loserId = comparison.cards.find(c => c.id !== winnerId)?.id;
				
				if (loserId && !eliminationOrder.has(loserId)) {
					eliminationOrder.set(loserId, round);
				}
				
				const currentWins = winCounts.get(winnerId) || 0;
				winCounts.set(winnerId, currentWins + 1);
				round++;
			}
		});

		const rankedCards: RankedCard[] = cards.map((card) => {
			const eliminatedAt = eliminationOrder.get(card.id);
			const wins = winCounts.get(card.id) || 0;
			
			return {
				...card,
				rank: eliminatedAt || 1, // Winner gets rank 1
				score: wins,
				wins,
				losses: eliminatedAt ? 1 : 0,
				ties: 0,
			};
		});

		// Sort by elimination order (later elimination = better rank)
		rankedCards.sort((a, b) => {
			if (a.rank !== b.rank) {
				return a.rank - b.rank;
			}
			return b.wins - a.wins;
		});

		// Reassign ranks to be consecutive
		rankedCards.forEach((card, index) => {
			card.rank = index + 1;
		});

		return rankedCards;
	}

	isComplete(cards: Card[], comparisons: Comparison[], settings: RankingSettings): boolean {
		const remainingCards = this.getRemainingCards(cards, comparisons);
		return remainingCards.length <= 1;
	}

	getEstimatedComparisons(cardCount: number, settings: RankingSettings): number {
		return Math.max(0, cardCount - 1); // Single elimination needs n-1 comparisons
	}
}

/**
 * Factory function to get the appropriate algorithm
 */
export function getRankingAlgorithm(algorithmType: RankingSettings['algorithm']): RankingAlgorithm {
	switch (algorithmType) {
		case 'tournament':
			return new TournamentRanking();
		case 'swiss':
			// For now, fall back to pairwise. Swiss system would be more complex
			return new PairwiseRanking();
		case 'pairwise':
		default:
			return new PairwiseRanking();
	}
}