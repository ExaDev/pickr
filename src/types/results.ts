import type { Card } from './cards';

export interface RankedCard extends Card {
	rank: number;
	score: number;
	wins: number;
	losses: number;
	ties?: number;
}

export interface RankingResult {
	id: string;
	sessionId: string;
	packId: string;
	rankings: RankedCard[];
	createdAt: Date;
	pacoCode?: string;
	metadata: {
		totalComparisons: number;
		algorithm: string;
		completionTime: number; // milliseconds
	};
}

export interface PacoData {
	packId: string;
	rankings: RankedCard[];
	metadata: {
		timestamp: Date;
		version: string;
		algorithm: string;
	};
}

export interface ComparisonAnalysis {
	agreement: number; // 0-1 score
	disagreements: Array<{
		card1: Card;
		card2: Card;
		conflictCount: number;
	}>;
	consensus: RankedCard[];
}

export type ResultInput = Omit<RankingResult, 'id' | 'createdAt' | 'pacoCode'>;
