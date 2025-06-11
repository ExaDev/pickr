import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// Mock environment variables
const mockEnv = {
	NEXT_PUBLIC_APP_VERSION: '1.2.3',
	NEXT_PUBLIC_COMMIT_HASH: 'abc123def456',
	NEXT_PUBLIC_BUILD_TIME: '2024-01-06T12:00:00Z',
	NEXT_PUBLIC_BRANCH: 'main',
};

describe('Footer', () => {
	beforeEach(() => {
		// Mock process.env
		Object.assign(process.env, mockEnv);
	});

	afterEach(() => {
		// Clean up
		Object.keys(mockEnv).forEach(key => {
			delete process.env[key];
		});
	});

	it('renders footer with version and commit information', () => {
		render(<Footer />);

		expect(screen.getByText('Pickr')).toBeInTheDocument();
		expect(screen.getByText('Card Ranking Application')).toBeInTheDocument();
		expect(screen.getByText('1.2.3')).toBeInTheDocument();
		expect(screen.getByText('abc123d')).toBeInTheDocument(); // Short commit hash
	});

	it('shows build date when build time is available', () => {
		render(<Footer />);

		expect(screen.getByText(/Built/)).toBeInTheDocument();
	});

	it('shows branch name for non-main branches', () => {
		process.env.NEXT_PUBLIC_BRANCH = 'feature-branch';

		render(<Footer />);

		expect(screen.getByText('feature-branch')).toBeInTheDocument();
	});

	it('hides branch name for main branch', () => {
		process.env.NEXT_PUBLIC_BRANCH = 'main';

		render(<Footer />);

		expect(screen.queryByText('main')).not.toBeInTheDocument();
	});

	it('handles missing environment variables gracefully', () => {
		// Clear all env vars
		Object.keys(mockEnv).forEach(key => {
			delete process.env[key];
		});

		render(<Footer />);

		expect(screen.getByText('Pickr')).toBeInTheDocument();
		expect(screen.getByText('dev')).toBeInTheDocument(); // Default version
		expect(screen.getByText('unknown')).toBeInTheDocument(); // Default commit
	});
});
