// Assessment Types
export interface AssessmentQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	topic: string;
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	explanation?: string;
}

export interface AssessmentResult {
	questionId: string;
	selectedAnswer: number;
	isCorrect: boolean;
	timeSpent: number;
}

export interface KnowledgeGap {
	topic: string;
	level: 'beginner' | 'intermediate' | 'advanced';
	confidence: number; // 0-1 scale
	subtopics: string[];
}

// Course Types
export interface CourseModule {
	id: string;
	title: string;
	description: string;
	estimatedDuration: number; // in minutes
	prerequisites: string[];
	content: string;
	examples: CodeExample[];
}

export interface CodeExample {
	id: string;
	title: string;
	code: string;
	language: string;
	explanation: string;
}

export interface LearningPath {
	id: string;
	userId: string;
	modules: CourseModule[];
	completedModules: string[];
	currentModule: string | null;
	knowledgeGaps: KnowledgeGap[];
	progress: number; // 0-100 percentage
}

// LLM Types
export interface LLMProvider {
	id: string;
	name: string;
	type: 'local' | 'remote';
	isAvailable: boolean;
	capabilities: string[];
}

export interface LLMResponse {
	content: string;
	provider: string;
	timestamp: number;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

// User Types
export interface UserProfile {
	id: string;
	name: string;
	email: string;
	preferences: {
		learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
		difficulty: 'beginner' | 'intermediate' | 'advanced';
		topics: string[];
	};
	progress: {
		assessmentsCompleted: number;
		modulesCompleted: number;
		totalStudyTime: number; // in minutes
	};
}
