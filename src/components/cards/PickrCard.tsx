import { useState } from 'react';
import { cn } from '../../lib/utils';
import type { Card as CardType } from '../../types';

interface PickrCardProps {
	card: CardType;
	onClick?: () => void;
	onImageLoad?: () => void;
	selected?: boolean;
	disabled?: boolean;
	variant?: 'default' | 'compact' | 'comparison';
	className?: string;
}

export function PickrCard({
	card,
	onClick,
	onImageLoad,
	selected = false,
	disabled = false,
	variant = 'default',
	className,
}: PickrCardProps) {
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(!!card.imageUrl);

	const handleImageLoad = () => {
		setImageLoading(false);
		onImageLoad?.();
	};

	const handleImageError = () => {
		setImageLoading(false);
		setImageError(true);
	};

	const cardVariants = {
		default: 'p-4 min-h-[120px]',
		compact: 'p-3 min-h-[80px]',
		comparison: 'p-6 min-h-[200px]',
	};

	return (
		<div
			className={cn(
				'relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 cursor-pointer',
				cardVariants[variant],
				{
					'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]': onClick && !disabled,
					'ring-2 ring-primary ring-offset-2 bg-primary/5': selected,
					'opacity-50 cursor-not-allowed': disabled,
					'border-primary': selected,
				},
				className
			)}
			onClick={onClick && !disabled ? onClick : undefined}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick && !disabled ? 0 : undefined}
			onKeyDown={e => {
				if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault();
					onClick();
				}
			}}
		>
			{/* Image section */}
			{card.imageUrl && !imageError && (
				<div className="relative mb-3 overflow-hidden rounded-md">
					{imageLoading && <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />}
					<img
						src={card.imageUrl}
						alt={card.content}
						className={cn('w-full object-cover transition-opacity', {
							'h-32': variant === 'default',
							'h-20': variant === 'compact',
							'h-40': variant === 'comparison',
							'opacity-0': imageLoading,
							'opacity-100': !imageLoading,
						})}
						onLoad={handleImageLoad}
						onError={handleImageError}
						loading="lazy"
					/>
				</div>
			)}

			{/* Content section */}
			<div className="flex-1">
				<p
					className={cn('text-sm font-medium leading-relaxed text-foreground', {
						'text-base': variant === 'comparison',
						'text-xs': variant === 'compact',
					})}
				>
					{card.content}
				</p>
			</div>

			{/* Selection indicator */}
			{selected && (
				<div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
					<svg
						className="w-4 h-4 text-primary-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Selected checkmark</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
			)}

			{/* Loading indicator for comparison cards */}
			{variant === 'comparison' && imageLoading && (
				<div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
					<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
