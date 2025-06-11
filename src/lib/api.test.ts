import {
	checkHealth,
	generateAssessmentQuestion,
	generateCourse,
	sendChatMessage,
	updateProgress,
} from './api';

describe('API Service', () => {
	describe('sendChatMessage', () => {
		it('should send chat messages and receive response', async () => {
			const messages = [{ role: 'user' as const, content: 'What is React?' }];

			const response = await sendChatMessage(messages);

			expect(response).toHaveProperty('id');
			expect(response).toHaveProperty('model', 'mock-llm-model');
			expect(response.choices).toHaveLength(1);
			expect(response.choices[0].message.content).toContain('Mock response to: What is React?');
			expect(response.usage.total_tokens).toBe(30);
		});
	});

	describe('generateAssessmentQuestion', () => {
		it('should generate assessment questions for a topic', async () => {
			const result = await generateAssessmentQuestion('JavaScript');

			expect(result.question).toHaveProperty('id');
			expect(result.question).toHaveProperty('type', 'multiple-choice');
			expect(result.question.question).toContain('JavaScript');
			expect(result.question.options).toHaveLength(4);
			expect(result.question.correctAnswer).toBe(0);
			expect(result.question.difficulty).toBe('intermediate');
		});
	});

	describe('generateCourse', () => {
		it('should generate a course based on knowledge gaps', async () => {
			const knowledgeGaps = [
				{ topic: 'React Hooks', level: 'beginner' },
				{ topic: 'State Management', level: 'intermediate' },
			];

			const result = await generateCourse(knowledgeGaps);

			expect(result.course).toHaveProperty('id');
			expect(result.course).toHaveProperty('title', 'Personalized React Learning Path');
			expect(result.course.modules).toHaveLength(2);
			expect(result.course.estimatedDuration).toBe(240);
			expect(result.course.modules[0].title).toContain('React Hooks');
			expect(result.course.modules[1].title).toContain('State Management');
		});
	});

	describe('updateProgress', () => {
		it('should update user progress', async () => {
			const progressData = {
				courseId: 'course-123',
				completedLessons: ['lesson-1', 'lesson-2'],
				currentModule: 2,
			};

			const result = await updateProgress(progressData);

			expect(result.success).toBe(true);
			expect(result.progress).toHaveProperty('courseId', 'course-123');
			expect(result.progress.overallProgress).toBe(0.65);
			expect(result.progress.timeSpent).toBe(120);
		});
	});

	describe('checkHealth', () => {
		it('should check API health', async () => {
			const health = await checkHealth();

			expect(health).toHaveProperty('status', 'ok');
			expect(health).toHaveProperty('environment', 'mock');
			expect(health).toHaveProperty('timestamp');
		});
	});

	describe('error handling', () => {
		it('should handle API errors gracefully', async () => {
			// This will trigger the error handler in our MSW setup
			await expect(
				fetch('/api/llm/error-test', { method: 'POST' }).then(res => {
					if (!res.ok) throw new Error(`API error: ${res.status}`);
					return res.json();
				})
			).rejects.toThrow('API error: 500');
		});
	});
});
