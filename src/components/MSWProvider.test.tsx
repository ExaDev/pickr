import { render, screen, waitFor } from '@testing-library/react';
import MSWProvider from './MSWProvider';

// Mock the MSW browser module
vi.mock('../mocks/browser', () => ({
	startMSW: vi.fn().mockResolvedValue(undefined),
}));

describe('MSWProvider', () => {
	const TestChild = () => <div>Test Content</div>;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders children when not in development mode', async () => {
		// Mock production environment
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';

		render(
			<MSWProvider>
				<TestChild />
			</MSWProvider>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();

		// Restore environment
		process.env.NODE_ENV = originalEnv;
	});

	it('shows loading state in development before MSW initializes', () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		render(
			<MSWProvider>
				<TestChild />
			</MSWProvider>
		);

		expect(screen.getByText('Initializing API mocks...')).toBeInTheDocument();

		// Restore environment
		process.env.NODE_ENV = originalEnv;
	});

	it('renders children after MSW initializes in development', async () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		render(
			<MSWProvider>
				<TestChild />
			</MSWProvider>
		);

		await waitFor(() => {
			expect(screen.getByText('Test Content')).toBeInTheDocument();
		});

		// Restore environment
		process.env.NODE_ENV = originalEnv;
	});

	it('handles MSW initialization errors gracefully', async () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		// Mock import failure
		vi.doMock('../mocks/browser', () => ({
			startMSW: vi.fn().mockRejectedValue(new Error('MSW init failed')),
		}));

		render(
			<MSWProvider>
				<TestChild />
			</MSWProvider>
		);

		await waitFor(() => {
			expect(screen.getByText('Test Content')).toBeInTheDocument();
		});

		// Restore environment
		process.env.NODE_ENV = originalEnv;
	});
});
