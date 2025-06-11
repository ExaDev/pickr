'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { RankedCard } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface RankingChartProps {
	rankings: RankedCard[];
	title?: string;
	maxItems?: number;
}

type ChartType = 'bar' | 'horizontal' | 'podium' | 'scatter';

export function RankingChart({ rankings, title = 'Rankings', maxItems = 10 }: RankingChartProps) {
	const [chartType, setChartType] = useState<ChartType>('bar');

	const displayedRankings = rankings.slice(0, maxItems);
	const maxScore = Math.max(...displayedRankings.map(r => r.score));

	const chartTypes = [
		{ type: 'bar' as ChartType, label: 'Bar Chart', icon: '📊' },
		{ type: 'horizontal' as ChartType, label: 'Horizontal', icon: '📈' },
		{ type: 'podium' as ChartType, label: 'Podium', icon: '🏆' },
		{ type: 'scatter' as ChartType, label: 'Win/Loss', icon: '📉' },
	];

	const getBarHeight = (score: number) => {
		return `${(score / maxScore) * 100}%`;
	};

	const getBarWidth = (score: number) => {
		return `${(score / maxScore) * 100}%`;
	};

	const getPodiumHeight = (rank: number) => {
		switch (rank) {
			case 1:
				return '120px';
			case 2:
				return '100px';
			case 3:
				return '80px';
			default:
				return '60px';
		}
	};

	const getPodiumColor = (rank: number) => {
		switch (rank) {
			case 1:
				return '#ffd700'; // Gold
			case 2:
				return '#c0c0c0'; // Silver
			case 3:
				return '#cd7f32'; // Bronze
			default:
				return '#6b7280'; // Gray
		}
	};

	const BarChart = () => (
		<div className="space-y-4">
			<div className="flex items-end gap-2 h-64 p-4 bg-muted/20 rounded-lg">
				{displayedRankings.map((ranking, index) => (
					<motion.div
						key={ranking.id}
						className="flex-1 flex flex-col items-center gap-2"
						initial={{ height: 0 }}
						animate={{ height: 'auto' }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
					>
						<motion.div
							className="w-full bg-primary rounded-t-md min-h-[20px] flex items-end justify-center pb-2"
							initial={{ height: 0 }}
							animate={{ height: getBarHeight(ranking.score) }}
							transition={{ duration: 0.8, delay: index * 0.1 }}
						>
							<span className="text-xs font-semibold text-primary-foreground">{ranking.rank}</span>
						</motion.div>
						<div className="text-xs text-center">
							<div className="font-medium truncate max-w-[60px]" title={ranking.content}>
								{ranking.content}
							</div>
							<div className="text-muted-foreground">{Math.round(ranking.score * 100)}%</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);

	const HorizontalChart = () => (
		<div className="space-y-3">
			{displayedRankings.map((ranking, index) => (
				<motion.div
					key={ranking.id}
					className="flex items-center gap-4"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
				>
					<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
						{ranking.rank}
					</div>
					<div className="flex-1 min-w-0">
						<div className="font-medium truncate">{ranking.content}</div>
						<div className="flex items-center gap-2 mt-1">
							<div className="flex-1 bg-muted rounded-full h-2">
								<motion.div
									className="bg-primary h-2 rounded-full"
									initial={{ width: 0 }}
									animate={{ width: getBarWidth(ranking.score) }}
									transition={{ duration: 0.8, delay: index * 0.1 }}
								/>
							</div>
							<span className="text-sm text-muted-foreground min-w-[40px] text-right">
								{Math.round(ranking.score * 100)}%
							</span>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);

	const PodiumChart = () => {
		const topThree = displayedRankings.slice(0, 3);
		const others = displayedRankings.slice(3);

		return (
			<div className="space-y-6">
				{/* Podium */}
				<div className="flex items-end justify-center gap-4 h-40">
					{/* 2nd place */}
					{topThree[1] && (
						<motion.div
							className="flex flex-col items-center gap-2"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div className="text-center mb-2">
								<div className="font-medium text-sm">{topThree[1].content}</div>
								<div className="text-xs text-muted-foreground">
									{Math.round(topThree[1].score * 100)}%
								</div>
							</div>
							<div
								className="w-20 rounded-t-lg flex items-center justify-center text-white font-bold text-lg"
								style={{
									height: getPodiumHeight(2),
									backgroundColor: getPodiumColor(2),
								}}
							>
								2
							</div>
						</motion.div>
					)}

					{/* 1st place */}
					{topThree[0] && (
						<motion.div
							className="flex flex-col items-center gap-2"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							<div className="text-center mb-2">
								<div className="font-medium text-sm">{topThree[0].content}</div>
								<div className="text-xs text-muted-foreground">
									{Math.round(topThree[0].score * 100)}%
								</div>
							</div>
							<div
								className="w-20 rounded-t-lg flex items-center justify-center text-white font-bold text-xl relative"
								style={{
									height: getPodiumHeight(1),
									backgroundColor: getPodiumColor(1),
								}}
							>
								<div className="absolute -top-6 text-2xl">👑</div>1
							</div>
						</motion.div>
					)}

					{/* 3rd place */}
					{topThree[2] && (
						<motion.div
							className="flex flex-col items-center gap-2"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div className="text-center mb-2">
								<div className="font-medium text-sm">{topThree[2].content}</div>
								<div className="text-xs text-muted-foreground">
									{Math.round(topThree[2].score * 100)}%
								</div>
							</div>
							<div
								className="w-20 rounded-t-lg flex items-center justify-center text-white font-bold text-lg"
								style={{
									height: getPodiumHeight(3),
									backgroundColor: getPodiumColor(3),
								}}
							>
								3
							</div>
						</motion.div>
					)}
				</div>

				{/* Others */}
				{others.length > 0 && (
					<div className="space-y-2">
						<h4 className="font-medium text-sm text-muted-foreground">Other Rankings</h4>
						{others.map((ranking, index) => (
							<motion.div
								key={ranking.id}
								className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
							>
								<div className="flex items-center gap-3">
									<span className="w-6 h-6 bg-muted-foreground text-white rounded-full flex items-center justify-center text-xs">
										{ranking.rank}
									</span>
									<span className="font-medium">{ranking.content}</span>
								</div>
								<span className="text-sm text-muted-foreground">
									{Math.round(ranking.score * 100)}%
								</span>
							</motion.div>
						))}
					</div>
				)}
			</div>
		);
	};

	const ScatterChart = () => {
		const maxWins = Math.max(...displayedRankings.map(r => r.wins));
		const maxLosses = Math.max(...displayedRankings.map(r => r.losses));

		return (
			<div className="space-y-4">
				<div className="relative h-64 bg-muted/20 rounded-lg p-4">
					{/* Axes */}
					<div className="absolute bottom-4 left-4 right-4 border-t border-muted-foreground/30" />
					<div className="absolute bottom-4 left-4 top-4 border-r border-muted-foreground/30" />

					{/* Axis labels */}
					<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
						Wins
					</div>
					<div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
						Losses
					</div>

					{/* Data points */}
					{displayedRankings.map((ranking, index) => {
						const x = maxWins > 0 ? (ranking.wins / maxWins) * 80 : 0;
						const y = maxLosses > 0 ? (ranking.losses / maxLosses) * 80 : 0;

						return (
							<motion.div
								key={ranking.id}
								className="absolute w-3 h-3 rounded-full bg-primary cursor-pointer group"
								style={{
									left: `${10 + x}%`,
									bottom: `${10 + y}%`,
								}}
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								title={`${ranking.content}: ${ranking.wins}W-${ranking.losses}L`}
							>
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
									{ranking.content}
									<br />
									{ranking.wins}W - {ranking.losses}L
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderChart = () => {
		switch (chartType) {
			case 'bar':
				return <BarChart />;
			case 'horizontal':
				return <HorizontalChart />;
			case 'podium':
				return <PodiumChart />;
			case 'scatter':
				return <ScatterChart />;
			default:
				return <BarChart />;
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{title}</CardTitle>
						<CardDescription>
							Showing top {displayedRankings.length} of {rankings.length} items
						</CardDescription>
					</div>
					<div className="flex gap-2">
						{chartTypes.map(type => (
							<Button
								key={type.type}
								variant={chartType === type.type ? 'default' : 'outline'}
								size="sm"
								onClick={() => setChartType(type.type)}
								className="text-xs"
								title={type.label}
							>
								{type.icon}
							</Button>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent>{renderChart()}</CardContent>
		</Card>
	);
}
