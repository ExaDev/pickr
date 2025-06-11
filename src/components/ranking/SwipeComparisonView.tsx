'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import type { Card, Comparison } from '../../types';
import { Button } from '../ui/Button';
import { SwipeableCard } from './SwipeableCard';

type ComparisonMode = 'pick' | 'discard';

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
	const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0);
	const [mode, setMode] = useState<ComparisonMode>('pick');

	// Hide instructions after first interaction
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowInstructions(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	const handleSelection = useCallback(
		async (card: Card) => {
			setIsSubmitting(true);
			setShowInstructions(false);

			try {
				onSelect(card);
			} finally {
				setIsSubmitting(false);
				setSelectedCard(null);
			}
		},
		[onSelect]
	);

	// Helper function to execute the current mode action
	const executeAction = useCallback(
		(card: Card) => {
			if (mode === 'pick') {
				handleSelection(card);
			} else {
				// In discard mode, select the other card(s)
				const otherCards = comparison.cards.filter(c => c.id !== card.id);
				if (otherCards.length === 1) {
					handleSelection(otherCards[0]);
				} else if (otherCards.length > 1) {
					// For multi-card comparisons in discard mode, we'd need more complex logic
					// For now, just pick the first non-discarded card
					handleSelection(otherCards[0]);
				}
			}
		},
		[mode, comparison.cards, handleSelection]
	);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (disabled || isSubmitting) return;

			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault();
					if (comparison.cards.length === 2) {
						// With 2 cards: left arrow performs current action on left card
						executeAction(comparison.cards[0]);
					} else {
						// With more cards: left arrow navigates to previous card
						setFocusedCardIndex(
							prev => (prev - 1 + comparison.cards.length) % comparison.cards.length
						);
					}
					break;
				case 'ArrowRight':
					event.preventDefault();
					if (comparison.cards.length === 2) {
						// With 2 cards: right arrow performs current action on right card
						executeAction(comparison.cards[1]);
					} else {
						// With more cards: right arrow navigates to next card
						setFocusedCardIndex(prev => (prev + 1) % comparison.cards.length);
					}
					break;
				case ' ':
					event.preventDefault();
					if (comparison.cards.length > 2) {
						// With more cards: space performs action on focused card
						executeAction(comparison.cards[focusedCardIndex]);
					} else {
						// With 2 cards: space cancels selection
						setSelectedCard(null);
					}
					break;
				case 'Enter':
					event.preventDefault();
					if (selectedCard) {
						handleSelection(selectedCard);
					} else if (comparison.cards[focusedCardIndex]) {
						executeAction(comparison.cards[focusedCardIndex]);
					}
					break;
				case 'Escape':
					event.preventDefault();
					setSelectedCard(null);
					break;
				case 'p':
				case 'P':
					event.preventDefault();
					setMode('pick');
					break;
				case 'd':
				case 'D':
					event.preventDefault();
					setMode('discard');
					break;
				case '1':
					event.preventDefault();
					if (comparison.cards[0]) {
						executeAction(comparison.cards[0]);
					}
					break;
				case '2':
					event.preventDefault();
					if (comparison.cards[1]) {
						executeAction(comparison.cards[1]);
					}
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [
		disabled,
		isSubmitting,
		selectedCard,
		focusedCardIndex,
		comparison.cards,
		executeAction,
		handleSelection,
		setMode,
		setFocusedCardIndex,
		setSelectedCard,
	]);

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

	const handleConfirm = () => {
		if (selectedCard) {
			handleSelection(selectedCard);
		}
	};

	const handleSkip = () => {
		setSelectedCard(null);
	};

	const progressPercentage = progress ? Math.round((progress.current / progress.total) * 100) : 0;

	return (
		<div className="w-full max-w-6xl mx-auto space-y-6">
			{/* Progress indicator */}
			{showProgress && progress && (
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>
							Comparison {progress.current} of {progress.total}
						</span>
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

			{/* Mode toggle - simplified and less prominent */}
			<div className="flex items-center justify-center">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>Mode:</span>
					<button
						type="button"
						onClick={() => setMode(mode === 'pick' ? 'discard' : 'pick')}
						className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
						aria-label={`Switch to ${mode === 'pick' ? 'discard' : 'pick'} mode. Currently in ${mode} mode.`}
					>
						{mode === 'pick' ? (
							<>
								<span className="w-2 h-2 rounded-full bg-green-500" />
								Choose favorite
							</>
						) : (
							<>
								<span className="w-2 h-2 rounded-full bg-red-500" />
								Remove unwanted
							</>
						)}
						<svg
							className="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
							aria-label="Switch mode"
						>
							<title>Switch mode</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
					</button>
				</div>
			</div>

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
						<h2 className="text-2xl font-semibold">
							{mode === 'pick' ? 'Which do you prefer?' : 'Which would you eliminate?'}
						</h2>
						<p className="text-muted-foreground">
							{comparison.cards.length === 2 ? (
								<>Use arrow keys or tap to choose</>
							) : (
								<>Use arrow keys to browse, Space to select</>
							)}
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Cards comparison */}
			<fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 border-0 p-0">
				<legend className="sr-only">Comparison cards</legend>
				{comparison.cards.map((card, index) => (
					<motion.div
						key={card.id}
						initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{
							duration: 0.5,
							delay: index * 0.1,
							type: 'spring',
							stiffness: 100,
						}}
						className="relative"
					>
						<button
							type="button"
							aria-label={`Option ${index + 1}: ${card.content}${selectedCard?.id === card.id ? ' (selected)' : ''}${focusedCardIndex === index ? ' (focused)' : ''}`}
							aria-pressed={selectedCard?.id === card.id}
							onClick={() => handleCardTap(card)}
							onFocus={() => setFocusedCardIndex(index)}
							className={`w-full p-0 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg ${
								focusedCardIndex === index && comparison.cards.length > 2
									? 'ring-2 ring-primary/70'
									: ''
							}`}
						>
							<SwipeableCard
								card={card}
								onSwipeRight={() => handleCardSwipeRight(card)}
								onSwipeLeft={() => handleCardSwipeLeft(card)}
								onTap={() => handleCardTap(card)}
								disabled={disabled || isSubmitting}
								className={`transition-all duration-300 ${
									selectedCard?.id === card.id ? 'ring-2 ring-primary ring-offset-4' : ''
								} ${focusedCardIndex === index ? 'shadow-lg' : ''}`}
							/>
						</button>

						{/* Subtle focus indicator for multi-card comparisons */}
						{comparison.cards.length > 2 && focusedCardIndex === index && (
							<motion.div
								className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium shadow-sm border"
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 0.9 }}
								exit={{ scale: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								Space to {mode === 'pick' ? 'choose' : 'eliminate'}
							</motion.div>
						)}
					</motion.div>
				))}
			</fieldset>

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
						<Button variant="outline" onClick={handleSkip} disabled={disabled || isSubmitting}>
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

			{/* Simplified keyboard hints */}
			<motion.div
				className="text-center text-xs text-muted-foreground"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 2 }}
			>
				<div>
					Keyboard: {comparison.cards.length === 2 ? '← → to choose' : '← → Space to select'} • P/D
					to switch mode
				</div>
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
