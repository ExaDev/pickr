import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateProgress } from '../lib/ranking/utils';
import type {
	Card,
	Comparison,
	ComparisonInput,
	RankingProgress,
	RankingSession,
	RankingSessionInput,
	RankingSettings,
} from '../types';

interface RankingState {
	currentSession: RankingSession | null;
	sessions: RankingSession[];

	// Session management
	startSession: (input: RankingSessionInput) => RankingSession;
	updateSession: (id: string, updates: Partial<RankingSession>) => void;
	endSession: () => void;
	getSessionById: (id: string) => RankingSession | undefined;

	// Comparison management
	addComparison: (comparison: ComparisonInput) => void;
	submitComparison: (winner: Card, comparison?: Comparison) => void;
	setCurrentComparison: (comparison: Comparison | undefined) => void;

	// Progress tracking
	getProgress: () => RankingProgress | null;

	// Utility functions
	clearAllSessions: () => void;
}

const generateId = () => crypto.randomUUID();

export const useRankingStore = create<RankingState>()(
	persist(
		(set, get) => ({
			currentSession: null,
			sessions: [],

			startSession: (input: RankingSessionInput) => {
				const newSession: RankingSession = {
					...input,
					id: generateId(),
					comparisons: [],
					isComplete: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				set(state => ({
					currentSession: newSession,
					sessions: [...state.sessions, newSession],
				}));

				return newSession;
			},

			updateSession: (id: string, updates: Partial<RankingSession>) => {
				set(state => {
					const updatedSessions = state.sessions.map(session =>
						session.id === id ? { ...session, ...updates, updatedAt: new Date() } : session
					);

					return {
						sessions: updatedSessions,
						currentSession:
							state.currentSession?.id === id
								? { ...state.currentSession, ...updates, updatedAt: new Date() }
								: state.currentSession,
					};
				});
			},

			endSession: () => {
				const { currentSession } = get();
				if (currentSession) {
					set(state => ({
						sessions: state.sessions.map(session =>
							session.id === currentSession.id
								? { ...session, isComplete: true, updatedAt: new Date() }
								: session
						),
						currentSession: { ...currentSession, isComplete: true, updatedAt: new Date() },
					}));
				}
			},

			getSessionById: (id: string) => {
				return get().sessions.find(session => session.id === id);
			},

			addComparison: (comparisonInput: ComparisonInput) => {
				const newComparison: Comparison = {
					...comparisonInput,
					id: generateId(),
					timestamp: new Date(),
				};

				const { currentSession } = get();
				if (currentSession) {
					const updatedSession = {
						...currentSession,
						comparisons: [...currentSession.comparisons, newComparison],
						updatedAt: new Date(),
					};

					set(state => ({
						currentSession: updatedSession,
						sessions: state.sessions.map(session =>
							session.id === currentSession.id ? updatedSession : session
						),
					}));
				}
			},

			submitComparison: (winner: Card, comparison?: Comparison) => {
				const { currentSession } = get();
				if (!currentSession) return;

				// Use provided comparison or the session's current comparison
				const comparisonToComplete = comparison || currentSession.currentComparison;
				if (!comparisonToComplete) return;

				const completedComparison: Comparison = {
					...comparisonToComplete,
					winner,
					timestamp: new Date(),
				};

				// Add to comparisons and clear current
				const updatedSession = {
					...currentSession,
					comparisons: [...currentSession.comparisons, completedComparison],
					currentComparison: undefined,
					updatedAt: new Date(),
				};

				set(state => ({
					currentSession: updatedSession,
					sessions: state.sessions.map(session =>
						session.id === currentSession.id ? updatedSession : session
					),
				}));
			},

			setCurrentComparison: (comparison: Comparison | undefined) => {
				const { currentSession } = get();
				if (currentSession) {
					const updatedSession = {
						...currentSession,
						currentComparison: comparison,
						updatedAt: new Date(),
					};

					set(state => ({
						currentSession: updatedSession,
						sessions: state.sessions.map(session =>
							session.id === currentSession.id ? updatedSession : session
						),
					}));
				}
			},

			getProgress: () => {
				const { currentSession } = get();
				if (!currentSession) return null;

				// We need the pack cards to calculate proper progress
				// This will be called from components that have access to the pack
				// For now, return a basic calculation
				const totalComparisons = currentSession.comparisons.length;

				return {
					totalComparisons: totalComparisons + 1, // At least one more
					completedComparisons: totalComparisons,
					percentComplete:
						totalComparisons > 0
							? Math.min((totalComparisons / (totalComparisons + 1)) * 100, 90)
							: 0,
				};
			},

			clearAllSessions: () => {
				set({
					currentSession: null,
					sessions: [],
				});
			},
		}),
		{
			name: 'pickr-ranking-storage',
			version: 1,
		}
	)
);
