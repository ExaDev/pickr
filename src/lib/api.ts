// API service functions for card ranking application
// Handles pack sharing, ranking data, and analytics

interface RankingResult {
	id: string;
	packId: string;
	userId?: string;
	rankings: Array<{
		cardId: string;
		rank: number;
		score: number;
	}>;
	comparisons: Array<{
		cardIds: string[];
		winnerId: string;
		timestamp: number;
	}>;
	metadata: {
		completedAt: number;
		totalComparisons: number;
		timeSpent: number; // seconds
	};
}

interface SharedPack {
	id: string;
	title: string;
	description: string;
	cards: Array<{
		id: string;
		title: string;
		imageUrl?: string;
	}>;
	metadata: {
		createdAt: number;
		createdBy?: string;
		version: number;
	};
}

interface AnalyticsData {
	packId: string;
	totalRankings: number;
	averageTime: number;
	popularComparisons: Array<{
		cardIds: string[];
		winnerFrequency: Record<string, number>;
	}>;
}

/**
 * Share a ranking result
 */
export async function shareRankingResult(
	result: RankingResult
): Promise<{ shareId: string; url: string }> {
	const response = await fetch('/api/rankings/share', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(result),
	});

	if (!response.ok) {
		throw new Error(`Ranking share error: ${response.status}`);
	}

	return response.json();
}

/**
 * Retrieve a shared ranking result
 */
export async function getSharedRanking(shareId: string): Promise<RankingResult> {
	const response = await fetch(`/api/rankings/shared/${shareId}`);

	if (!response.ok) {
		throw new Error(`Failed to retrieve shared ranking: ${response.status}`);
	}

	return response.json();
}

/**
 * Share a pack for others to rank
 */
export async function sharePack(pack: SharedPack): Promise<{ shareId: string; url: string }> {
	const response = await fetch('/api/packs/share', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(pack),
	});

	if (!response.ok) {
		throw new Error(`Pack share error: ${response.status}`);
	}

	return response.json();
}

/**
 * Get analytics for a pack
 */
export async function getPackAnalytics(packId: string): Promise<AnalyticsData> {
	const response = await fetch(`/api/analytics/packs/${packId}`);

	if (!response.ok) {
		throw new Error(`Analytics fetch error: ${response.status}`);
	}

	return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{
	status: string;
	timestamp: string;
	environment: string;
}> {
	const response = await fetch('/api/health');

	if (!response.ok) {
		throw new Error(`Health check failed: ${response.status}`);
	}

	return response.json();
}
