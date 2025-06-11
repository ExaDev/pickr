import { describe, expect, it } from 'vitest';
import type {
	AssessmentQuestion,
	AssessmentResult,
	CourseModule,
	KnowledgeGap,
	LearningPath,
	UserProfile,
} from './index';

describe('Type Definitions', () => {
	describe('AssessmentQuestion', () => {
		it('should accept valid assessment question structure', () => {
			const question: AssessmentQuestion = {
				id: 'react-hooks-1',
				question: 'What is the primary purpose of useState hook?',
				options: [
					'To handle side effects',
					'To manage component state',
					'To optimize performance',
					'To handle routing',
				],
				correctAnswer: 1,
				topic: 'React Hooks',
				difficulty: 'beginner',
				explanation: 'useState is used to add state to functional components',
			};

			expect(question.id).toBe('react-hooks-1');
			expect(question.options).toHaveLength(4);
			expect(question.difficulty).toBe('beginner');
		});
	});

	describe('KnowledgeGap', () => {
		it('should accept valid knowledge gap structure', () => {
			const gap: KnowledgeGap = {
				topic: 'React Hooks',
				level: 'intermediate',
				confidence: 0.3,
				subtopics: ['useEffect', 'useContext', 'useReducer'],
			};

			expect(gap.confidence).toBeGreaterThanOrEqual(0);
			expect(gap.confidence).toBeLessThanOrEqual(1);
			expect(gap.subtopics).toContain('useEffect');
		});
	});

	describe('CourseModule', () => {
		it('should accept valid course module structure', () => {
			const module: CourseModule = {
				id: 'react-hooks-basics',
				title: 'Introduction to React Hooks',
				description: 'Learn the fundamentals of React Hooks',
				estimatedDuration: 45,
				prerequisites: ['javascript-basics'],
				content: 'Detailed explanation of React Hooks...',
				examples: [
					{
						id: 'useState-example',
						title: 'Counter with useState',
						code: 'const [count, setCount] = useState(0);',
						language: 'javascript',
						explanation: 'Basic useState example',
					},
				],
			};

			expect(module.estimatedDuration).toBeGreaterThan(0);
			expect(module.examples).toHaveLength(1);
			expect(module.examples[0].language).toBe('javascript');
		});
	});

	describe('UserProfile', () => {
		it('should accept valid user profile structure', () => {
			const profile: UserProfile = {
				id: 'user-123',
				name: 'Test User',
				email: 'test@example.com',
				preferences: {
					learningStyle: 'visual',
					difficulty: 'intermediate',
					topics: ['react', 'typescript'],
				},
				progress: {
					assessmentsCompleted: 3,
					modulesCompleted: 5,
					totalStudyTime: 120,
				},
			};

			expect(profile.preferences.learningStyle).toBe('visual');
			expect(profile.progress.totalStudyTime).toBeGreaterThan(0);
			expect(profile.preferences.topics).toContain('react');
		});
	});
});
