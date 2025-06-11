import { describe, expect, it, vi } from 'vitest';
import {
	capitalize,
	cn,
	debounce,
	formatDate,
	formatDuration,
	formatRelativeTime,
	generateId,
	isBrowser,
	isEmpty,
	safeJsonParse,
	throttle,
	truncate,
} from './utils';

describe('Utils', () => {
	describe('cn (className merger)', () => {
		it('should merge tailwind classes correctly', () => {
			expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3');
			expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
		});

		it('should handle conditional classes', () => {
			expect(cn('base-class', true && 'conditional-class', false && 'hidden-class')).toBe(
				'base-class conditional-class'
			);
		});
	});

	describe('generateId', () => {
		it('should generate unique IDs', () => {
			const id1 = generateId();
			const id2 = generateId();

			expect(id1).not.toBe(id2);
			expect(typeof id1).toBe('string');
			expect(id1.length).toBeGreaterThan(0);
		});
	});

	describe('formatDate', () => {
		it('should format dates correctly', () => {
			const date = new Date('2024-01-15T14:30:00Z');
			const formatted = formatDate(date);

			expect(typeof formatted).toBe('string');
			expect(formatted).toContain('15');
			expect(formatted).toContain('Jan');
			expect(formatted).toContain('2024');
		});
	});

	describe('formatRelativeTime', () => {
		it('should format recent times correctly', () => {
			const now = new Date();
			const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
			const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

			expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
			expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
		});

		it('should handle just now correctly', () => {
			const now = new Date();
			expect(formatRelativeTime(now)).toBe('Just now');
		});
	});

	describe('formatDuration', () => {
		it('should format minutes correctly', () => {
			expect(formatDuration(30)).toBe('30 min');
			expect(formatDuration(45)).toBe('45 min');
		});

		it('should format hours correctly', () => {
			expect(formatDuration(60)).toBe('1h');
			expect(formatDuration(120)).toBe('2h');
		});

		it('should format hours and minutes correctly', () => {
			expect(formatDuration(90)).toBe('1h 30min');
			expect(formatDuration(135)).toBe('2h 15min');
		});
	});

	describe('capitalize', () => {
		it('should capitalize first letter', () => {
			expect(capitalize('hello')).toBe('Hello');
			expect(capitalize('WORLD')).toBe('WORLD');
			expect(capitalize('')).toBe('');
		});
	});

	describe('truncate', () => {
		it('should truncate long text', () => {
			expect(truncate('This is a long text', 10)).toBe('This is...');
			expect(truncate('Short', 10)).toBe('Short');
			expect(truncate('Exact length', 12)).toBe('Exact length');
		});

		it('should use custom suffix', () => {
			expect(truncate('Long text', 5, '---')).toBe('Lo---');
		});
	});

	describe('isEmpty', () => {
		it('should detect empty values', () => {
			expect(isEmpty(null)).toBe(true);
			expect(isEmpty(undefined)).toBe(true);
			expect(isEmpty('')).toBe(true);
			expect(isEmpty('   ')).toBe(true);
			expect(isEmpty([])).toBe(true);
			expect(isEmpty({})).toBe(true);
		});

		it('should detect non-empty values', () => {
			expect(isEmpty('hello')).toBe(false);
			expect(isEmpty([1, 2])).toBe(false);
			expect(isEmpty({ key: 'value' })).toBe(false);
			expect(isEmpty(0)).toBe(false);
			expect(isEmpty(false)).toBe(false);
		});
	});

	describe('safeJsonParse', () => {
		it('should parse valid JSON', () => {
			expect(safeJsonParse('{"key": "value"}', {})).toEqual({ key: 'value' });
		});

		it('should return fallback for invalid JSON', () => {
			expect(safeJsonParse('invalid json', { default: true })).toEqual({ default: true });
		});
	});

	describe('isBrowser', () => {
		it('should detect browser environment', () => {
			// In test environment, window is available through jsdom
			expect(typeof isBrowser()).toBe('boolean');
		});
	});

	describe('debounce', () => {
		it('should debounce function calls', async () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn();
			debouncedFn();
			debouncedFn();

			expect(mockFn).not.toHaveBeenCalled();

			await new Promise(resolve => setTimeout(resolve, 150));
			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});

	describe('throttle', () => {
		it('should throttle function calls', async () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 100);

			throttledFn();
			throttledFn();
			throttledFn();

			expect(mockFn).toHaveBeenCalledTimes(1);

			await new Promise(resolve => setTimeout(resolve, 150));
			throttledFn();
			expect(mockFn).toHaveBeenCalledTimes(2);
		});
	});
});
