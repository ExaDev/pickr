import { useState } from 'react';
import { Button } from '../ui/Button';
import { PickrCard } from '../cards/PickrCard';
import type { RankedCard } from '../../types';

interface RankingSidebarProps {
	rankings: RankedCard[];
	isComplete?: boolean;
	isCollapsed?: boolean;
	onToggleCollapse?: () => void;
}

export function RankingSidebar({
	rankings,
	isComplete = false,
	isCollapsed = false,
	onToggleCollapse,
}: RankingSidebarProps) {
	const [showAll, setShowAll] = useState(false);

	const displayedRankings = showAll ? rankings : rankings.slice(0, 5);
	const hasMore = rankings.length > 5;

	if (isCollapsed) {
		return (
			<div className="fixed right-4 top-1/2 -translate-y-1/2 z-10">
				<Button
					variant="outline"
					size="icon"
					onClick={onToggleCollapse}
					className="rounded-full shadow-lg"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</Button>
			</div>
		);
	}

	return (
		<div className="w-80 bg-card border-l shadow-sm">
			<div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between">
				<div>
					<h3 className="font-semibold">
						{isComplete ? 'Final Rankings' : 'Current Rankings'}
					</h3>
					<p className="text-sm text-muted-foreground">
						{rankings.length} item{rankings.length !== 1 ? 's' : ''}
					</p>
				</div>
				{onToggleCollapse && (
					<Button
						variant="ghost"
						size="icon"
						onClick={onToggleCollapse}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Button>
				)}
			</div>

			<div className="overflow-y-auto max-h-screen pb-20">
				<div className="p-4 space-y-3">
					{displayedRankings.map((rankedCard, index) => (
						<div
							key={rankedCard.id}
							className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 transition-colors"
						>
							{/* Rank indicator */}
							<div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
								{rankedCard.rank}
							</div>

							{/* Card preview */}
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium truncate">
									{rankedCard.content}
								</div>
								<div className="text-xs text-muted-foreground">
									{rankedCard.wins}W - {rankedCard.losses}L
									{rankedCard.ties && rankedCard.ties > 0 && ` - ${rankedCard.ties}T`}
								</div>
							</div>

							{/* Score indicator */}
							<div className="flex-shrink-0 text-right">
								<div className="text-sm font-medium">
									{Math.round(rankedCard.score * 100)}%
								</div>
							</div>
						</div>
					))}

					{/* Show more/less button */}
					{hasMore && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowAll(!showAll)}
							className="w-full"
						>
							{showAll ? 'Show Less' : `Show ${rankings.length - 5} More`}
						</Button>
					)}

					{/* Empty state */}
					{rankings.length === 0 && (
						<div className="text-center text-muted-foreground py-8">
							<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</div>
							<p className="text-sm">No rankings yet</p>
							<p className="text-xs">Start comparing to see results</p>
						</div>
					)}
				</div>
			</div>

			{/* Status indicator */}
			{isComplete && (
				<div className="absolute bottom-4 left-4 right-4">
					<div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm text-center font-medium">
						✓ Ranking Complete
					</div>
				</div>
			)}
		</div>
	);
}