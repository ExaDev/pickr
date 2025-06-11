import {
	checkHealth,
	getPackAnalytics,
	getSharedRanking,
	sharePack,
	shareRankingResult,
} from './api';

describe('API Service', () => {
	describe('shareRankingResult', () => {
		it('should share ranking results and receive share URL', async () => {
			const ranking = {
				id: 'ranking-123',
				packId: 'pack-456',
				rankings: [{ cardId: 'card-1', rank: 1, score: 0.85 }],
				comparisons: [{ cardIds: ['card-1', 'card-2'], winnerId: 'card-1', timestamp: Date.now() }],
				metadata: { completedAt: Date.now(), totalComparisons: 3, timeSpent: 180 },
			};

			const response = await shareRankingResult(ranking);

			expect(response).toHaveProperty('shareId');
			expect(response).toHaveProperty('url');
			expect(response.shareId).toMatch(/^ranking-\d+-[a-z0-9]+$/);
			expect(response.url).toContain('/results/shared');
		});
	});

	describe('getSharedRanking', () => {
		it('should retrieve shared ranking by ID', async () => {
			const shareId = 'test-share-id';
			const result = await getSharedRanking(shareId);

			expect(result).toHaveProperty('id', shareId);
			expect(result).toHaveProperty('packId');
			expect(result.rankings).toHaveLength(3);
			expect(result.comparisons).toHaveLength(3);
			expect(result.metadata).toHaveProperty('completedAt');
			expect(result.metadata).toHaveProperty('totalComparisons');
			expect(result.metadata).toHaveProperty('timeSpent');
		});
	});

	describe('sharePack', () => {
		it('should share pack and receive share URL', async () => {
			const pack = {
				id: 'pack-123',
				title: 'Test Pack',
				description: 'A test card pack',
				cards: [{ id: 'card-1', title: 'Card 1' }],
				metadata: { createdAt: Date.now(), version: 1 },
			};

			const response = await sharePack(pack);

			expect(response).toHaveProperty('shareId');
			expect(response).toHaveProperty('url');
			expect(response.shareId).toMatch(/^pack-\d+-[a-z0-9]+$/);
			expect(response.url).toContain('/rank/shared');
		});
	});

	describe('getPackAnalytics', () => {
		it('should get analytics for a pack', async () => {
			const packId = 'pack-123';
			const analytics = await getPackAnalytics(packId);

			expect(analytics).toHaveProperty('packId', packId);
			expect(analytics).toHaveProperty('totalRankings', 47);
			expect(analytics).toHaveProperty('averageTime', 245);
			expect(analytics.popularComparisons).toHaveLength(2);
			expect(analytics.popularComparisons[0]).toHaveProperty('cardIds');
			expect(analytics.popularComparisons[0]).toHaveProperty('winnerFrequency');
		});
	});

	describe('checkHealth', () => {
		it('should check API health', async () => {
			const health = await checkHealth();

			expect(health).toHaveProperty('status', 'ok');
			expect(health).toHaveProperty('environment', 'mock');
			expect(health).toHaveProperty('timestamp');
		});
	});

	describe('error handling', () => {
		it('should handle API errors gracefully', async () => {
			// This will trigger the error handler in our MSW setup
			await expect(
				fetch('/api/rankings/error-test', { method: 'POST' }).then(res => {
					if (!res.ok) throw new Error(`API error: ${res.status}`);
					return res.json();
				})
			).rejects.toThrow('API error: 500');
		});
	});
});
