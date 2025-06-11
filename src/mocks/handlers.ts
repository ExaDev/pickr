import { http, HttpResponse } from 'msw';

// Type definitions for request bodies
type ChatRequestBody = {
	messages: Array<{ role: string; content: string }>;
};

type AssessmentRequestBody = {
	topic: string;
};

type CourseRequestBody = {
	knowledgeGaps: Array<{ topic: string; level: string }>;
};

type ProgressRequestBody = {
	courseId: string;
	completedLessons: string[];
	currentModule: number;
};

// Mock API handlers for development and testing
export const handlers = [
	// Mock LLM API endpoints
	http.post('/api/llm/chat', async ({ request }) => {
		const body = await request.json();
		const messages = (body as ChatRequestBody)?.messages || [];

		// Simulate processing delay
		await new Promise(resolve => setTimeout(resolve, 1000));

		return HttpResponse.json({
			id: `mock-response-${Date.now()}`,
			model: 'mock-llm-model',
			choices: [
				{
					message: {
						role: 'assistant',
						content: `Mock response to: ${messages[messages.length - 1]?.content || 'Hello!'}`,
					},
					finish_reason: 'stop',
				},
			],
			usage: {
				prompt_tokens: 10,
				completion_tokens: 20,
				total_tokens: 30,
			},
		});
	}),

	// Mock assessment question generation
	http.post('/api/assessment/generate', async ({ request }) => {
		const body = await request.json();
		const topic = (body as AssessmentRequestBody)?.topic || 'React';

		await new Promise(resolve => setTimeout(resolve, 800));

		return HttpResponse.json({
			question: {
				id: `mock-q-${Date.now()}`,
				type: 'multiple-choice',
				question: `What is the primary purpose of ${topic} hooks?`,
				options: [
					'To manage component state and lifecycle',
					'To style components',
					'To handle routing',
					'To manage API calls only',
				],
				correctAnswer: 0,
				explanation:
					'Hooks allow you to use state and other React features in functional components.',
				difficulty: 'intermediate',
				topic: topic,
				subtopics: ['hooks', 'state-management'],
			},
		});
	}),

	// Mock course generation
	http.post('/api/course/generate', async ({ request }) => {
		const body = await request.json();
		const gaps = (body as CourseRequestBody)?.knowledgeGaps || [];

		await new Promise(resolve => setTimeout(resolve, 1500));

		return HttpResponse.json({
			course: {
				id: `mock-course-${Date.now()}`,
				title: 'Personalized React Learning Path',
				description: 'A course tailored to your specific knowledge gaps',
				estimatedDuration: 240, // minutes
				modules: gaps.slice(0, 3).map((gap: { topic: string; level: string }, index: number) => ({
					id: `module-${index + 1}`,
					title: `Mastering ${gap.topic}`,
					description: `Deep dive into ${gap.topic} concepts`,
					duration: 80,
					lessons: [
						{
							id: `lesson-${index + 1}-1`,
							title: `Introduction to ${gap.topic}`,
							type: 'theory',
							content: `This lesson covers the fundamentals of ${gap.topic}...`,
							estimatedTime: 20,
						},
						{
							id: `lesson-${index + 1}-2`,
							title: `${gap.topic} in Practice`,
							type: 'practical',
							content: `Let's implement ${gap.topic} in a real project...`,
							estimatedTime: 40,
						},
					],
				})),
				prerequisites: [],
				learningObjectives: [
					'Understand core concepts',
					'Apply knowledge in practical scenarios',
					'Build confidence in the subject area',
				],
			},
		});
	}),

	// Mock user progress tracking
	http.post('/api/progress/update', async ({ request }) => {
		const body = await request.json();

		await new Promise(resolve => setTimeout(resolve, 300));

		return HttpResponse.json({
			success: true,
			progress: {
				userId: 'mock-user',
				courseId: (body as ProgressRequestBody)?.courseId,
				completedLessons: (body as ProgressRequestBody)?.completedLessons || [],
				currentModule: (body as ProgressRequestBody)?.currentModule || 1,
				overallProgress: 0.65,
				timeSpent: 120, // minutes
			},
		});
	}),

	// Mock WebLLM model loading
	http.get('/models/:modelName', ({ params }) => {
		const { modelName } = params;

		return HttpResponse.json({
			model: modelName,
			size: '2.1GB',
			status: 'available',
			capabilities: ['text-generation', 'code-analysis'],
			downloadUrl: `https://mock-cdn.example.com/models/${modelName}`,
		});
	}),

	// Mock error scenarios for testing
	http.post('/api/llm/error-test', () => {
		return HttpResponse.json({ error: 'Mock API error for testing' }, { status: 500 });
	}),

	// Health check endpoint
	http.get('/api/health', () => {
		return HttpResponse.json({
			status: 'ok',
			timestamp: new Date().toISOString(),
			environment: 'mock',
		});
	}),
];
