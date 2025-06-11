import '@testing-library/jest-dom';
import { vi } from 'vitest';
import './msw-setup';

// Mock Next.js router
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
		prefetch: vi.fn(),
	}),
	useSearchParams: () => new URLSearchParams(),
	usePathname: () => '/',
}));

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
	disconnect() {}
	observe() {}
	unobserve() {}
};

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
	disconnect() {}
	observe() {}
	unobserve() {}
};

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
