import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pack, Card, PackInput, CardInput } from '../types';

interface CardsState {
	packs: Pack[];
	currentPack: Pack | null;
	
	// Pack management
	addPack: (pack: PackInput) => Pack;
	updatePack: (id: string, updates: Partial<Pack>) => void;
	deletePack: (id: string) => void;
	setCurrentPack: (pack: Pack | null) => void;
	getPackById: (id: string) => Pack | undefined;
	
	// Card management
	addCardToPack: (packId: string, card: CardInput) => Card | null;
	updateCard: (packId: string, cardId: string, updates: Partial<Card>) => void;
	removeCardFromPack: (packId: string, cardId: string) => void;
	
	// Utility functions
	clearAllData: () => void;
}

const generateId = () => crypto.randomUUID();

export const useCardsStore = create<CardsState>()(
	persist(
		(set, get) => ({
			packs: [],
			currentPack: null,

			addPack: (packInput: PackInput) => {
				const newPack: Pack = {
					...packInput,
					id: generateId(),
					cards: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				set((state) => ({
					packs: [...state.packs, newPack],
				}));

				return newPack;
			},

			updatePack: (id: string, updates: Partial<Pack>) => {
				set((state) => ({
					packs: state.packs.map((pack) =>
						pack.id === id
							? { ...pack, ...updates, updatedAt: new Date() }
							: pack
					),
					currentPack:
						state.currentPack?.id === id
							? { ...state.currentPack, ...updates, updatedAt: new Date() }
							: state.currentPack,
				}));
			},

			deletePack: (id: string) => {
				set((state) => ({
					packs: state.packs.filter((pack) => pack.id !== id),
					currentPack: state.currentPack?.id === id ? null : state.currentPack,
				}));
			},

			setCurrentPack: (pack: Pack | null) => {
				set({ currentPack: pack });
			},

			getPackById: (id: string) => {
				return get().packs.find((pack) => pack.id === id);
			},

			addCardToPack: (packId: string, cardInput: CardInput) => {
				const newCard: Card = {
					...cardInput,
					id: generateId(),
					createdAt: new Date(),
				};

				let addedCard: Card | null = null;

				set((state) => {
					const updatedPacks = state.packs.map((pack) => {
						if (pack.id === packId) {
							const updatedPack = {
								...pack,
								cards: [...pack.cards, newCard],
								updatedAt: new Date(),
							};
							addedCard = newCard;
							return updatedPack;
						}
						return pack;
					});

					return {
						packs: updatedPacks,
						currentPack:
							state.currentPack?.id === packId
								? updatedPacks.find((p) => p.id === packId) || state.currentPack
								: state.currentPack,
					};
				});

				return addedCard;
			},

			updateCard: (packId: string, cardId: string, updates: Partial<Card>) => {
				set((state) => {
					const updatedPacks = state.packs.map((pack) => {
						if (pack.id === packId) {
							return {
								...pack,
								cards: pack.cards.map((card) =>
									card.id === cardId ? { ...card, ...updates } : card
								),
								updatedAt: new Date(),
							};
						}
						return pack;
					});

					return {
						packs: updatedPacks,
						currentPack:
							state.currentPack?.id === packId
								? updatedPacks.find((p) => p.id === packId) || state.currentPack
								: state.currentPack,
					};
				});
			},

			removeCardFromPack: (packId: string, cardId: string) => {
				set((state) => {
					const updatedPacks = state.packs.map((pack) => {
						if (pack.id === packId) {
							return {
								...pack,
								cards: pack.cards.filter((card) => card.id !== cardId),
								updatedAt: new Date(),
							};
						}
						return pack;
					});

					return {
						packs: updatedPacks,
						currentPack:
							state.currentPack?.id === packId
								? updatedPacks.find((p) => p.id === packId) || state.currentPack
								: state.currentPack,
					};
				});
			},

			clearAllData: () => {
				set({
					packs: [],
					currentPack: null,
				});
			},
		}),
		{
			name: 'pickr-cards-storage',
			version: 1,
		}
	)
);