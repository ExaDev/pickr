// Generic API service functions that work with MSW mocks
// Replace with your application-specific API functions

interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

interface LLMResponse {
	id: string;
	model: string;
	choices: Array<{
		message: ChatMessage;
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

interface AssessmentQuestion {
	id: string;
	type: 'multiple-choice' | 'open-ended' | 'code-completion';
	question: string;
	options?: string[];
	correctAnswer?: number;
	explanation: string;
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	topic: string;
	subtopics: string[];
}

interface CourseModule {
	id: string;
	title: string;
	description: string;
	duration: number;
	lessons: Array<{
		id: string;
		title: string;
		type: 'theory' | 'practical' | 'assessment';
		content: string;
		estimatedTime: number;
	}>;
}

interface Course {
	id: string;
	title: string;
	description: string;
	estimatedDuration: number;
	modules: CourseModule[];
	prerequisites: string[];
	learningObjectives: string[];
}

/**
 * Send a chat message to the LLM API
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<LLMResponse> {
	const response = await fetch('/api/llm/chat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ messages }),
	});

	if (!response.ok) {
		throw new Error(`LLM API error: ${response.status}`);
	}

	return response.json();
}

/**
 * Generate assessment questions for a specific topic
 */
export async function generateAssessmentQuestion(
	topic: string
): Promise<{ question: AssessmentQuestion }> {
	const response = await fetch('/api/assessment/generate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ topic }),
	});

	if (!response.ok) {
		throw new Error(`Assessment API error: ${response.status}`);
	}

	return response.json();
}

/**
 * Generate a personalized course based on knowledge gaps
 */
export async function generateCourse(
	knowledgeGaps: Array<{ topic: string; level: string }>
): Promise<{ course: Course }> {
	const response = await fetch('/api/course/generate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ knowledgeGaps }),
	});

	if (!response.ok) {
		throw new Error(`Course generation error: ${response.status}`);
	}

	return response.json();
}

/**
 * Update user progress
 */
export async function updateProgress(data: {
	courseId: string;
	completedLessons: string[];
	currentModule: number;
}): Promise<{
	success: boolean;
	progress: {
		userId: string;
		courseId: string;
		completedLessons: string[];
		currentModule: number;
		overallProgress: number;
		timeSpent: number;
	};
}> {
	const response = await fetch('/api/progress/update', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`Progress API error: ${response.status}`);
	}

	return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{
	status: string;
	timestamp: string;
	environment: string;
}> {
	const response = await fetch('/api/health');

	if (!response.ok) {
		throw new Error(`Health check failed: ${response.status}`);
	}

	return response.json();
}
