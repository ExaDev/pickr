import { describe, expect, it } from 'vitest';
import type {
	Card,
	CardInput,
	Comparison,
	Pack,
	PackInput,
	RankingResult,
	RankingSession,
	ResultSummary,
} from './index';

describe('Type Definitions', () => {
	describe('Card', () => {
		it('should accept valid card structure', () => {
			const card: Card = {
				id: 'card-123',
				content: 'Favorite Pizza Topping',
				imageUrl: 'https://example.com/pizza.jpg',
				createdAt: new Date(),
			};

			expect(card.id).toBe('card-123');
			expect(card.content).toBe('Favorite Pizza Topping');
			expect(card.imageUrl).toBe('https://example.com/pizza.jpg');
			expect(card.createdAt).toBeInstanceOf(Date);
		});

		it('should accept card without optional fields', () => {
			const card: Card = {
				id: 'card-456',
				content: 'Simple card content',
				createdAt: new Date(),
			};

			expect(card.imageUrl).toBeUndefined();
			expect(card.imageFile).toBeUndefined();
		});
	});

	describe('Pack', () => {
		it('should accept valid pack structure', () => {
			const pack: Pack = {
				id: 'pack-123',
				name: 'Movie Rankings',
				description: 'Rank your favorite movies',
				cards: [
					{
						id: 'card-1',
						content: 'The Matrix',
						createdAt: new Date(),
					},
					{
						id: 'card-2',
						content: 'Inception',
						createdAt: new Date(),
					},
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			expect(pack.name).toBe('Movie Rankings');
			expect(pack.cards).toHaveLength(2);
			expect(pack.cards[0].content).toBe('The Matrix');
		});
	});

	describe('RankingSession', () => {
		it('should accept valid ranking session structure', () => {
			const session: RankingSession = {
				id: 'session-123',
				packId: 'pack-456',
				comparisons: [
					{
						id: 'comp-1',
						cardIds: ['card-1', 'card-2'],
						winnerId: 'card-1',
						timestamp: Date.now(),
					},
				],
				isComplete: false,
				startedAt: Date.now(),
			};

			expect(session.packId).toBe('pack-456');
			expect(session.comparisons).toHaveLength(1);
			expect(session.isComplete).toBe(false);
			expect(session.comparisons[0].winnerId).toBe('card-1');
		});
	});

	describe('RankingResult', () => {
		it('should accept valid ranking result structure', () => {
			const result: RankingResult = {
				id: 'result-123',
				sessionId: 'session-456',
				packId: 'pack-789',
				rankings: [
					{ cardId: 'card-1', rank: 1, score: 0.85 },
					{ cardId: 'card-2', rank: 2, score: 0.73 },
				],
				completedAt: Date.now(),
				totalComparisons: 5,
				timeSpent: 120,
			};

			expect(result.rankings).toHaveLength(2);
			expect(result.rankings[0].rank).toBe(1);
			expect(result.rankings[0].score).toBe(0.85);
			expect(result.totalComparisons).toBe(5);
		});
	});
});
