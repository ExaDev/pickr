import { useState } from 'react';
import { PickrCard } from '../cards/PickrCard';
import { Button } from '../ui/Button';
import type { Comparison, Card } from '../../types';

interface ComparisonViewProps {
	comparison: Comparison;
	onSelect: (winner: Card) => void;
	disabled?: boolean;
	showProgress?: boolean;
	progress?: {
		current: number;
		total: number;
	};
}

export function ComparisonView({
	comparison,
	onSelect,
	disabled = false,
	showProgress = true,
	progress,
}: ComparisonViewProps) {
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCardSelect = (card: Card) => {
		if (disabled || isSubmitting) return;
		setSelectedCard(card);
	};

	const handleConfirm = async () => {
		if (!selectedCard || disabled || isSubmitting) return;
		
		setIsSubmitting(true);
		try {
			onSelect(selectedCard);
		} finally {
			setIsSubmitting(false);
			setSelectedCard(null);
		}
	};

	const handleSkip = () => {
		if (disabled || isSubmitting) return;
		setSelectedCard(null);
	};

	const progressPercentage = progress
		? Math.round((progress.current / progress.total) * 100)
		: 0;

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			{/* Progress indicator */}
			{showProgress && progress && (
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>Comparison {progress.current} of {progress.total}</span>
						<span>{progressPercentage}% complete</span>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<div
							className="bg-primary h-2 rounded-full transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			)}

			{/* Instruction */}
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-semibold">Which do you prefer?</h2>
				<p className="text-muted-foreground">
					Select the option you like better, or skip if you can't decide
				</p>
			</div>

			{/* Cards comparison */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{comparison.cards.map((card) => (
					<PickrCard
						key={card.id}
						card={card}
						variant="comparison"
						selected={selectedCard?.id === card.id}
						disabled={disabled || isSubmitting}
						onClick={() => handleCardSelect(card)}
						className="transition-all duration-200 hover:shadow-lg"
					/>
				))}
			</div>

			{/* VS indicator */}
			<div className="flex items-center justify-center">
				<div className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium">
					VS
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex items-center justify-center gap-4">
				<Button
					variant="outline"
					onClick={handleSkip}
					disabled={disabled || isSubmitting}
				>
					Skip This Comparison
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={!selectedCard || disabled || isSubmitting}
					className="min-w-[120px]"
				>
					{isSubmitting ? (
						<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
					) : (
						'Confirm Choice'
					)}
				</Button>
			</div>

			{/* Keyboard shortcuts hint */}
			<div className="text-center text-xs text-muted-foreground">
				Tip: Use arrow keys to select and Enter to confirm
			</div>
		</div>
	);
}