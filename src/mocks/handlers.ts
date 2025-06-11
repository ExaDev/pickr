import { http, HttpResponse } from 'msw';

// Type definitions for request bodies
type RankingShareRequestBody = {
	id: string;
	packId: string;
	rankings: Array<{ cardId: string; rank: number; score: number }>;
	comparisons: Array<{ cardIds: string[]; winnerId: string; timestamp: number }>;
	metadata: { completedAt: number; totalComparisons: number; timeSpent: number };
};

type PackShareRequestBody = {
	id: string;
	title: string;
	description: string;
	cards: Array<{ id: string; title: string; imageUrl?: string }>;
	metadata: { createdAt: number; createdBy?: string; version: number };
};

// Mock API handlers for card ranking application
export const handlers = [
	// Mock ranking result sharing
	http.post('/api/rankings/share', async ({ request }) => {
		const body = await request.json();
		const ranking = body as RankingShareRequestBody;

		// Simulate processing delay
		await new Promise(resolve => setTimeout(resolve, 500));

		const shareId = `ranking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		return HttpResponse.json({
			shareId,
			url: `${window.location.origin}/results/shared?id=${shareId}`,
		});
	}),

	// Mock shared ranking retrieval
	http.get('/api/rankings/shared/:shareId', async ({ params }) => {
		const { shareId } = params;

		await new Promise(resolve => setTimeout(resolve, 300));

		return HttpResponse.json({
			id: shareId,
			packId: 'mock-pack-id',
			rankings: [
				{ cardId: 'card-1', rank: 1, score: 0.85 },
				{ cardId: 'card-2', rank: 2, score: 0.73 },
				{ cardId: 'card-3', rank: 3, score: 0.61 },
			],
			comparisons: [
				{ cardIds: ['card-1', 'card-2'], winnerId: 'card-1', timestamp: Date.now() - 300000 },
				{ cardIds: ['card-2', 'card-3'], winnerId: 'card-2', timestamp: Date.now() - 200000 },
				{ cardIds: ['card-1', 'card-3'], winnerId: 'card-1', timestamp: Date.now() - 100000 },
			],
			metadata: {
				completedAt: Date.now() - 60000,
				totalComparisons: 3,
				timeSpent: 180, // 3 minutes
			},
		});
	}),

	// Mock pack sharing
	http.post('/api/packs/share', async ({ request }) => {
		const body = await request.json();
		const pack = body as PackShareRequestBody;

		await new Promise(resolve => setTimeout(resolve, 400));

		const shareId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		return HttpResponse.json({
			shareId,
			url: `${window.location.origin}/rank/shared/${shareId}`,
		});
	}),

	// Mock pack analytics
	http.get('/api/analytics/packs/:packId', async ({ params }) => {
		const { packId } = params;

		await new Promise(resolve => setTimeout(resolve, 600));

		return HttpResponse.json({
			packId,
			totalRankings: 47,
			averageTime: 245, // seconds
			popularComparisons: [
				{
					cardIds: ['card-1', 'card-2'],
					winnerFrequency: { 'card-1': 28, 'card-2': 19 },
				},
				{
					cardIds: ['card-2', 'card-3'],
					winnerFrequency: { 'card-2': 31, 'card-3': 16 },
				},
			],
		});
	}),

	// Mock error scenarios for testing
	http.post('/api/rankings/error-test', () => {
		return HttpResponse.json({ error: 'Mock ranking API error for testing' }, { status: 500 });
	}),

	// Health check endpoint
	http.get('/api/health', () => {
		return HttpResponse.json({
			status: 'ok',
			timestamp: new Date().toISOString(),
			environment: 'mock',
		});
	}),
];
