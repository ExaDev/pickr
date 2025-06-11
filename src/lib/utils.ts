import type { AssessmentResult, KnowledgeGap } from '@/types';

/**
 * Calculate assessment score as a percentage
 */
export function calculateAssessmentScore(results: AssessmentResult[]): number {
	if (results.length === 0) return 0;

	const correctAnswers = results.filter(result => result.isCorrect).length;
	return Math.round((correctAnswers / results.length) * 100);
}

/**
 * Determine knowledge gaps based on assessment results
 */
export function identifyKnowledgeGaps(
	results: AssessmentResult[],
	topics: string[]
): KnowledgeGap[] {
	const topicScores = new Map<string, { correct: number; total: number }>();

	// Initialize topic scores
	topics.forEach(topic => {
		topicScores.set(topic, { correct: 0, total: 0 });
	});

	// Calculate scores per topic (simplified - would need question-topic mapping)
	results.forEach(result => {
		const topic = topics[Math.floor(Math.random() * topics.length)]; // Simplified
		const scores = topicScores.get(topic);
		if (scores) {
			scores.total += 1;
			if (result.isCorrect) {
				scores.correct += 1;
			}
		}
	});

	// Identify gaps (confidence < 0.7)
	const gaps: KnowledgeGap[] = [];
	topicScores.forEach((scores, topic) => {
		const confidence = scores.total > 0 ? scores.correct / scores.total : 0;
		if (confidence < 0.7) {
			gaps.push({
				topic,
				level: confidence < 0.3 ? 'beginner' : confidence < 0.6 ? 'intermediate' : 'advanced',
				confidence,
				subtopics: [], // Would be populated based on detailed analysis
			});
		}
	});

	return gaps;
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
	if (minutes < 60) {
		return `${minutes} min`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${remainingMinutes}min`;
}

/**
 * Generate a random ID string
 */
export function generateId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Check if browser supports WebGPU for LLM acceleration
 */
export async function checkWebGPUSupport(): Promise<boolean> {
	if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
		return false;
	}

	try {
		const gpu = (navigator as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
		if (!gpu) return false;
		const adapter = await gpu.requestAdapter();
		return adapter !== null;
	} catch {
		return false;
	}
}
