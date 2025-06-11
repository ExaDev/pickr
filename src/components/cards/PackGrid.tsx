import { formatRelativeTime } from '../../lib/utils';
import type { Pack } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface PackGridProps {
	packs: Pack[];
	onSelectPack: (pack: Pack) => void;
	onDeletePack?: (packId: string) => void;
	onCreatePack?: () => void;
	loading?: boolean;
}

export function PackGrid({
	packs,
	onSelectPack,
	onDeletePack,
	onCreatePack,
	loading = false,
}: PackGridProps) {
	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(skeletonId => (
					<Card key={skeletonId} className="animate-pulse">
						<CardHeader>
							<div className="h-6 bg-muted rounded w-3/4" />
							<div className="h-4 bg-muted rounded w-1/2" />
						</CardHeader>
						<CardContent>
							<div className="h-4 bg-muted rounded w-full mb-2" />
							<div className="h-4 bg-muted rounded w-2/3" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (packs.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
					<svg
						className="w-8 h-8 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Empty pack list icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-semibold mb-2">No packs yet</h3>
				<p className="text-muted-foreground mb-6">Create your first pack to start ranking items</p>
				{onCreatePack && <Button onClick={onCreatePack}>Create Your First Pack</Button>}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{packs.map(pack => (
				<Card
					key={pack.id}
					className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] group"
					onClick={() => onSelectPack(pack)}
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between">
							<div className="flex-1 min-w-0">
								<CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
									{pack.name}
								</CardTitle>
								{pack.description && (
									<CardDescription className="mt-1 line-clamp-2">
										{pack.description}
									</CardDescription>
								)}
							</div>
							{onDeletePack && (
								<Button
									variant="ghost"
									size="icon"
									onClick={e => {
										e.stopPropagation();
										onDeletePack(pack.id);
									}}
									className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<title>Delete pack</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</Button>
							)}
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{/* Stats */}
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<title>Cards count icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5z"
									/>
								</svg>
								<span>{pack.cards.length} cards</span>
							</div>
							<div className="text-xs">{formatRelativeTime(pack.updatedAt)}</div>
						</div>

						{/* Card preview */}
						{pack.cards.length > 0 && (
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground">Preview:</p>
								<div className="text-sm">
									{pack.cards.slice(0, 2).map((card, index) => (
										<div key={card.id} className="truncate">
											{index + 1}. {card.content}
										</div>
									))}
									{pack.cards.length > 2 && (
										<div className="text-muted-foreground">+{pack.cards.length - 2} more...</div>
									)}
								</div>
							</div>
						)}

						{/* Action hint */}
						<div className="pt-2 border-t">
							<p className="text-xs text-muted-foreground">Click to start ranking →</p>
						</div>
					</CardContent>
				</Card>
			))}

			{/* Create new pack card */}
			{onCreatePack && (
				<Card
					className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-dashed border-2 hover:border-primary/50"
					onClick={onCreatePack}
				>
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
							<svg
								className="w-6 h-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Create new pack</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
						<h3 className="font-semibold text-lg mb-2">Create New Pack</h3>
						<p className="text-muted-foreground text-sm">Add items to rank and compare</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
