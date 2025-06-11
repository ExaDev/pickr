export interface Card {
	id: string;
	content: string;
	imageUrl?: string;
	imageFile?: File;
	createdAt: Date;
}

export interface Pack {
	id: string;
	name: string;
	description?: string;
	cards: Card[];
	createdAt: Date;
	updatedAt: Date;
}

export type CardInput = Omit<Card, 'id' | 'createdAt'>;
export type PackInput = Omit<Pack, 'id' | 'createdAt' | 'updatedAt' | 'cards'>;
