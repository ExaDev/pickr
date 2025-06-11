import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { handlers } from './handlers';

// Setup MSW for Node.js environment (testing)
export const server = setupServer(...handlers);

// Test utilities
export const setupMSWServer = () => {
	// Enable API mocking before all tests
	beforeAll(() => {
		server.listen({
			onUnhandledRequest: 'error',
		});
	});

	// Reset any request handlers that are declared as a part of test
	afterEach(() => {
		server.resetHandlers();
	});

	// Disable API mocking after all tests are done
	afterAll(() => {
		server.close();
	});
};
