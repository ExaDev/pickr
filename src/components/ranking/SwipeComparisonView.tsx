'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwipeableCard } from './SwipeableCard';
import { Button } from '../ui/Button';
import type { Comparison, Card } from '../../types';

interface SwipeComparisonViewProps {
	comparison: Comparison;
	onSelect: (winner: Card) => void;
	disabled?: boolean;
	showProgress?: boolean;
	progress?: {
		current: number;
		total: number;
	};
}

export function SwipeComparisonView({
	comparison,
	onSelect,
	disabled = false,
	showProgress = true,
	progress,
}: SwipeComparisonViewProps) {
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showInstructions, setShowInstructions] = useState(true);

	// Hide instructions after first interaction
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowInstructions(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	const handleCardSwipeRight = (card: Card) => {
		if (disabled || isSubmitting) return;
		handleSelection(card);
	};

	const handleCardSwipeLeft = (card: Card) => {
		if (disabled || isSubmitting) return;
		// For now, treat left swipe as "skip" or show the other card
		// Could be customized for different behaviors
		const otherCard = comparison.cards.find(c => c.id !== card.id);
		if (otherCard) {
			handleSelection(otherCard);
		}
	};

	const handleCardTap = (card: Card) => {
		if (disabled || isSubmitting) return;
		setSelectedCard(card);
	};

	const handleSelection = async (card: Card) => {
		setIsSubmitting(true);
		setShowInstructions(false);
		
		try {
			onSelect(card);
		} finally {
			setIsSubmitting(false);
			setSelectedCard(null);
		}
	};

	const handleConfirm = () => {
		if (selectedCard) {
			handleSelection(selectedCard);
		}
	};

	const handleSkip = () => {
		setSelectedCard(null);
	};

	const progressPercentage = progress
		? Math.round((progress.current / progress.total) * 100)
		: 0;

	return (
		<div className="w-full max-w-6xl mx-auto space-y-6">
			{/* Progress indicator */}
			{showProgress && progress && (
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>Comparison {progress.current} of {progress.total}</span>
						<span>{progressPercentage}% complete</span>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<motion.div
							className="bg-primary h-2 rounded-full"
							initial={{ width: 0 }}
							animate={{ width: `${progressPercentage}%` }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
						/>
					</div>
				</div>
			)}

			{/* Instructions */}
			<AnimatePresence>
				{showInstructions && (
					<motion.div
						className="text-center space-y-2"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<h2 className="text-2xl font-semibold">Which do you prefer?</h2>
						<p className="text-muted-foreground">
							Swipe right to choose, swipe left to prefer the other, or tap to select manually
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Cards comparison */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
				{comparison.cards.map((card, index) => (
					<motion.div
						key={card.id}
						initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ 
							duration: 0.5, 
							delay: index * 0.1,
							type: 'spring',
							stiffness: 100
						}}
					>
						<SwipeableCard
							card={card}
							onSwipeRight={() => handleCardSwipeRight(card)}
							onSwipeLeft={() => handleCardSwipeLeft(card)}
							onTap={() => handleCardTap(card)}
							disabled={disabled || isSubmitting}
							className={`transition-all duration-300 ${
								selectedCard?.id === card.id ? 'ring-2 ring-primary ring-offset-4' : ''
							}`}
						/>
					</motion.div>
				))}
			</div>

			{/* VS indicator */}
			<div className="flex items-center justify-center">
				<motion.div 
					className="bg-muted text-muted-foreground px-6 py-3 rounded-full text-lg font-bold"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
				>
					VS
				</motion.div>
			</div>

			{/* Manual selection controls */}
			<AnimatePresence>
				{selectedCard && (
					<motion.div
						className="flex items-center justify-center gap-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.3 }}
					>
						<Button
							variant="outline"
							onClick={handleSkip}
							disabled={disabled || isSubmitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							disabled={disabled || isSubmitting}
							className="min-w-[140px]"
						>
							{isSubmitting ? (
								<>
									<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
									Confirming...
								</>
							) : (
								'Confirm Choice'
							)}
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Skip button */}
			{!selectedCard && (
				<div className="flex items-center justify-center">
					<Button
						variant="ghost"
						onClick={handleSkip}
						disabled={disabled || isSubmitting}
						className="text-muted-foreground hover:text-foreground"
					>
						Skip This Comparison
					</Button>
				</div>
			)}

			{/* Keyboard shortcuts hint */}
			<motion.div
				className="text-center text-xs text-muted-foreground"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
			>
				Tip: Use arrow keys ← → to select, Enter to confirm, or Space to skip
			</motion.div>

			{/* Loading overlay */}
			<AnimatePresence>
				{isSubmitting && (
					<motion.div
						className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className="bg-card p-6 rounded-lg shadow-lg flex items-center gap-3">
							<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
							<span className="text-lg">Processing your choice...</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}