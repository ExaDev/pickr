import { http, HttpResponse } from 'msw';
import { server } from './node';

describe('MSW Handlers', () => {
	describe('LLM API endpoints', () => {
		it('should mock LLM chat endpoint', async () => {
			const response = await fetch('/api/llm/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages: [{ role: 'user', content: 'Hello, AI!' }],
				}),
			});

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data).toHaveProperty('id');
			expect(data).toHaveProperty('model', 'mock-llm-model');
			expect(data.choices[0].message.content).toContain('Mock response to: Hello, AI!');
		});

		it('should handle error scenarios', async () => {
			const response = await fetch('/api/llm/error-test', {
				method: 'POST',
			});

			expect(response.status).toBe(500);

			const data = await response.json();
			expect(data).toHaveProperty('error', 'Mock API error for testing');
		});
	});

	describe('Assessment endpoints', () => {
		it('should mock assessment question generation', async () => {
			const response = await fetch('/api/assessment/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					topic: 'React Hooks',
				}),
			});

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data.question).toHaveProperty('id');
			expect(data.question).toHaveProperty('type', 'multiple-choice');
			expect(data.question.question).toContain('React Hooks');
			expect(data.question.options).toHaveLength(4);
			expect(data.question.correctAnswer).toBe(0);
		});
	});

	describe('Course generation', () => {
		it('should mock course generation endpoint', async () => {
			const knowledgeGaps = [
				{ topic: 'Hooks', level: 'beginner' },
				{ topic: 'State Management', level: 'intermediate' },
			];

			const response = await fetch('/api/course/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ knowledgeGaps }),
			});

			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data.course).toHaveProperty('id');
			expect(data.course).toHaveProperty('title');
			expect(data.course.modules).toHaveLength(2);
			expect(data.course.estimatedDuration).toBe(240);
		});
	});

	describe('Custom handlers', () => {
		it('should allow overriding handlers in tests', async () => {
			// Override the default handler for this test
			server.use(
				http.get('/api/health', () => {
					return HttpResponse.json({
						status: 'custom',
						message: 'Custom handler for test',
					});
				})
			);

			const response = await fetch('/api/health');
			const data = await response.json();

			expect(data.status).toBe('custom');
			expect(data.message).toBe('Custom handler for test');
		});

		it('should reset to default handlers after test', async () => {
			const response = await fetch('/api/health');
			const data = await response.json();

			// Should be back to default handler
			expect(data.status).toBe('ok');
			expect(data.environment).toBe('mock');
		});
	});
});
