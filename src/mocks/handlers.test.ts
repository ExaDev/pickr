import { http, HttpResponse } from 'msw';
import { server } from './node';

describe('MSW Handlers', () => {
	describe('Ranking API endpoints', () => {
		it('should mock ranking result sharing', async () => {
			const rankingData = {
				id: 'ranking-123',
				packId: 'pack-456',
				rankings: [{ cardId: 'card-1', rank: 1, score: 0.85 }],
				comparisons: [{ cardIds: ['card-1', 'card-2'], winnerId: 'card-1', timestamp: Date.now() }],
				metadata: { completedAt: Date.now(), totalComparisons: 3, timeSpent: 180 },
			};

			const response = await fetch('/api/rankings/share', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(rankingData),
			});

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data).toHaveProperty('shareId');
			expect(data).toHaveProperty('url');
			expect(data.shareId).toMatch(/^ranking-\d+-[a-z0-9]+$/);
		});

		it('should mock shared ranking retrieval', async () => {
			const response = await fetch('/api/rankings/shared/test-id');

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data).toHaveProperty('id', 'test-id');
			expect(data).toHaveProperty('packId');
			expect(data.rankings).toHaveLength(3);
			expect(data.comparisons).toHaveLength(3);
		});

		it('should handle error scenarios', async () => {
			const response = await fetch('/api/rankings/error-test', {
				method: 'POST',
			});

			expect(response.status).toBe(500);

			const data = await response.json();
			expect(data).toHaveProperty('error', 'Mock ranking API error for testing');
		});
	});

	describe('Pack sharing endpoints', () => {
		it('should mock pack sharing', async () => {
			const packData = {
				id: 'pack-123',
				title: 'Test Pack',
				description: 'A test card pack',
				cards: [{ id: 'card-1', title: 'Card 1' }],
				metadata: { createdAt: Date.now(), version: 1 },
			};

			const response = await fetch('/api/packs/share', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(packData),
			});

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data).toHaveProperty('shareId');
			expect(data).toHaveProperty('url');
			expect(data.shareId).toMatch(/^pack-\d+-[a-z0-9]+$/);
		});
	});

	describe('Analytics endpoints', () => {
		it('should mock pack analytics retrieval', async () => {
			const response = await fetch('/api/analytics/packs/pack-123');

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data).toHaveProperty('packId', 'pack-123');
			expect(data).toHaveProperty('totalRankings', 47);
			expect(data).toHaveProperty('averageTime', 245);
			expect(data.popularComparisons).toHaveLength(2);
		});
	});

	describe('Custom handlers', () => {
		it('should allow overriding handlers in tests', async () => {
			// Override the default handler for this test
			server.use(
				http.get('/api/health', () => {
					return HttpResponse.json({
						status: 'custom',
						message: 'Custom handler for test',
					});
				})
			);

			const response = await fetch('/api/health');
			const data = await response.json();

			expect(data.status).toBe('custom');
			expect(data.message).toBe('Custom handler for test');
		});

		it('should reset to default handlers after test', async () => {
			const response = await fetch('/api/health');
			const data = await response.json();

			// Should be back to default handler
			expect(data.status).toBe('ok');
			expect(data.environment).toBe('mock');
		});
	});
});
