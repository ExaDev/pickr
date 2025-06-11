import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
	RankingResult,
	ResultInput,
	PacoData,
	ComparisonAnalysis,
	RankedCard,
} from '../types';

interface ResultsState {
	results: RankingResult[];
	currentResult: RankingResult | null;
	
	// Result management
	addResult: (result: ResultInput) => RankingResult;
	updateResult: (id: string, updates: Partial<RankingResult>) => void;
	deleteResult: (id: string) => void;
	setCurrentResult: (result: RankingResult | null) => void;
	getResultById: (id: string) => RankingResult | undefined;
	getResultsByPackId: (packId: string) => RankingResult[];
	
	// Paco encoding/decoding
	generatePacoCode: (resultId: string) => string | null;
	decodePacoCode: (pacoCode: string) => PacoData | null;
	
	// Analysis functions
	compareResults: (resultIds: string[]) => ComparisonAnalysis | null;
	
	// Utility functions
	clearAllResults: () => void;
}

const generateId = () => crypto.randomUUID();

// Simple Paco encoding (base64 + compression simulation)
const encodePaco = (data: PacoData): string => {
	try {
		const jsonString = JSON.stringify(data);
		return btoa(jsonString).replace(/[+/=]/g, (char) => {
			switch (char) {
				case '+': return '-';
				case '/': return '_';
				case '=': return '';
				default: return char;
			}
		});
	} catch {
		return '';
	}
};

const decodePaco = (pacoCode: string): PacoData | null => {
	try {
		// Reverse the character replacements
		const base64 = pacoCode.replace(/[-_]/g, (char) => {
			switch (char) {
				case '-': return '+';
				case '_': return '/';
				default: return char;
			}
		});
		
		// Add padding if needed
		const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
		const jsonString = atob(padded);
		return JSON.parse(jsonString);
	} catch {
		return null;
	}
};

export const useResultsStore = create<ResultsState>()(
	persist(
		(set, get) => ({
			results: [],
			currentResult: null,

			addResult: (resultInput: ResultInput) => {
				const newResult: RankingResult = {
					...resultInput,
					id: generateId(),
					createdAt: new Date(),
				};

				set((state) => ({
					results: [...state.results, newResult],
				}));

				return newResult;
			},

			updateResult: (id: string, updates: Partial<RankingResult>) => {
				set((state) => ({
					results: state.results.map((result) =>
						result.id === id ? { ...result, ...updates } : result
					),
					currentResult:
						state.currentResult?.id === id
							? { ...state.currentResult, ...updates }
							: state.currentResult,
				}));
			},

			deleteResult: (id: string) => {
				set((state) => ({
					results: state.results.filter((result) => result.id !== id),
					currentResult: state.currentResult?.id === id ? null : state.currentResult,
				}));
			},

			setCurrentResult: (result: RankingResult | null) => {
				set({ currentResult: result });
			},

			getResultById: (id: string) => {
				return get().results.find((result) => result.id === id);
			},

			getResultsByPackId: (packId: string) => {
				return get().results.filter((result) => result.packId === packId);
			},

			generatePacoCode: (resultId: string) => {
				const result = get().getResultById(resultId);
				if (!result) return null;

				const pacoData: PacoData = {
					packId: result.packId,
					rankings: result.rankings,
					metadata: {
						timestamp: result.createdAt,
						version: '1.0',
						algorithm: result.metadata.algorithm,
					},
				};

				const pacoCode = encodePaco(pacoData);
				
				// Update result with paco code
				get().updateResult(resultId, { pacoCode });
				
				return pacoCode;
			},

			decodePacoCode: (pacoCode: string) => {
				return decodePaco(pacoCode);
			},

			compareResults: (resultIds: string[]) => {
				const results = resultIds
					.map((id) => get().getResultById(id))
					.filter((result): result is RankingResult => result !== undefined);

				if (results.length < 2) return null;

				// Simple comparison analysis
				const allCards = new Map<string, RankedCard[]>();
				
				// Collect all rankings for each card
				results.forEach((result) => {
					result.rankings.forEach((rankedCard) => {
						if (!allCards.has(rankedCard.id)) {
							allCards.set(rankedCard.id, []);
						}
						allCards.get(rankedCard.id)!.push(rankedCard);
					});
				});

				// Calculate consensus (simple average ranking)
				const consensus: RankedCard[] = [];
				const disagreements: ComparisonAnalysis['disagreements'] = [];

				allCards.forEach((rankings, cardId) => {
					if (rankings.length === results.length) {
						const avgRank = rankings.reduce((sum, r) => sum + r.rank, 0) / rankings.length;
						const avgScore = rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length;
						
						// Use the first card as template
						const baseCard = rankings[0];
						consensus.push({
							...baseCard,
							rank: Math.round(avgRank),
							score: avgScore,
							wins: rankings.reduce((sum, r) => sum + r.wins, 0),
							losses: rankings.reduce((sum, r) => sum + r.losses, 0),
						});

						// Check for disagreements (rank variance > 2)
						const rankVariance = Math.max(...rankings.map(r => r.rank)) - Math.min(...rankings.map(r => r.rank));
						if (rankVariance > 2) {
							// Find conflicting pairs (simplified)
							rankings.forEach((rank1, i) => {
								rankings.slice(i + 1).forEach((rank2) => {
									if (Math.abs(rank1.rank - rank2.rank) > 2) {
										disagreements.push({
											card1: rank1,
											card2: rank2,
											conflictCount: Math.abs(rank1.rank - rank2.rank),
										});
									}
								});
							});
						}
					}
				});

				// Sort consensus by rank
				consensus.sort((a, b) => a.rank - b.rank);

				// Calculate overall agreement (simplified)
				const totalPossibleAgreements = allCards.size * (allCards.size - 1) / 2;
				const actualDisagreements = disagreements.length;
				const agreement = Math.max(0, 1 - (actualDisagreements / totalPossibleAgreements));

				return {
					agreement,
					disagreements,
					consensus,
				};
			},

			clearAllResults: () => {
				set({
					results: [],
					currentResult: null,
				});
			},
		}),
		{
			name: 'pickr-results-storage',
			version: 1,
		}
	)
);