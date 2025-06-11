import type { Card } from './cards';

export interface Comparison {
	id: string;
	cards: Card[];
	winner?: Card;
	timestamp?: Date;
}

export interface RankingSettings {
	comparisonSize: number; // 2-N items per comparison
	algorithm: 'pairwise' | 'tournament' | 'swiss';
}

export interface RankingSession {
	id: string;
	packId: string;
	comparisons: Comparison[];
	currentComparison?: Comparison;
	isComplete: boolean;
	settings: RankingSettings;
	createdAt: Date;
	updatedAt: Date;
}

export interface RankingProgress {
	totalComparisons: number;
	completedComparisons: number;
	percentComplete: number;
	estimatedTimeRemaining?: number;
}

export type ComparisonInput = Omit<Comparison, 'id' | 'timestamp'>;
export type RankingSessionInput = Omit<
	RankingSession,
	'id' | 'createdAt' | 'updatedAt' | 'comparisons' | 'isComplete'
>;
