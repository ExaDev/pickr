'use client';

import { type PanInfo, motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import type { Card } from '../../types';
import { PickrCard } from '../cards/PickrCard';

interface SwipeableCardProps {
	card: Card;
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	onTap?: () => void;
	disabled?: boolean;
	swipeThreshold?: number;
	className?: string;
}

export function SwipeableCard({
	card,
	onSwipeLeft,
	onSwipeRight,
	onTap,
	disabled = false,
	swipeThreshold = 100,
	className,
}: SwipeableCardProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

	const x = useMotionValue(0);
	const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
	const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);

	const handleDragStart = () => {
		if (disabled) return;
		setIsDragging(true);
	};

	const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		if (disabled) return;

		const currentX = info.offset.x;

		// Determine drag direction for visual feedback
		if (Math.abs(currentX) > 20) {
			setDragDirection(currentX > 0 ? 'right' : 'left');
		} else {
			setDragDirection(null);
		}
	};

	const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		if (disabled) return;

		setIsDragging(false);
		setDragDirection(null);

		const swipeDistance = Math.abs(info.offset.x);
		const swipeVelocity = Math.abs(info.velocity.x);

		// Determine if swipe is strong enough
		const isStrongSwipe = swipeDistance > swipeThreshold || swipeVelocity > 500;

		if (isStrongSwipe) {
			if (info.offset.x > 0) {
				onSwipeRight?.();
			} else {
				onSwipeLeft?.();
			}
		}

		// Reset position
		x.set(0);
	};

	const handleTap = () => {
		if (disabled || isDragging) return;
		onTap?.();
	};

	return (
		<motion.div
			className={`relative cursor-grab active:cursor-grabbing ${className || ''}`}
			style={{ x, rotate, opacity }}
			drag={disabled ? false : 'x'}
			dragConstraints={{ left: -300, right: 300 }}
			dragElastic={0.7}
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}
			onTap={handleTap}
			whileTap={disabled ? {} : { scale: 0.95 }}
			animate={{
				scale: isDragging ? 1.05 : 1,
			}}
			transition={{
				type: 'spring',
				stiffness: 300,
				damping: 30,
			}}
		>
			<PickrCard
				card={card}
				variant="comparison"
				disabled={disabled}
				className={`transition-all duration-200 ${isDragging ? 'shadow-2xl' : 'shadow-lg'} ${
					dragDirection === 'right'
						? 'ring-2 ring-green-400'
						: dragDirection === 'left'
							? 'ring-2 ring-red-400'
							: ''
				}`}
			/>

			{/* Swipe indicators */}
			{isDragging && (
				<>
					{/* Left swipe indicator */}
					<motion.div
						className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-start pl-8"
						initial={{ opacity: 0 }}
						animate={{
							opacity: dragDirection === 'left' ? 1 : 0,
						}}
						transition={{ duration: 0.2 }}
					>
						<div className="bg-red-500 text-white rounded-full p-3">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</motion.div>

					{/* Right swipe indicator */}
					<motion.div
						className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-end pr-8"
						initial={{ opacity: 0 }}
						animate={{
							opacity: dragDirection === 'right' ? 1 : 0,
						}}
						transition={{ duration: 0.2 }}
					>
						<div className="bg-green-500 text-white rounded-full p-3">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</motion.div>
				</>
			)}

			{/* Drag instruction */}
			{!isDragging && !disabled && (
				<motion.div
					className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.3 }}
				>
					Swipe or tap to choose
				</motion.div>
			)}
		</motion.div>
	);
}
