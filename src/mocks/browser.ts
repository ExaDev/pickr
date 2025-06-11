import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW for browser environment
export const worker = setupWorker(...handlers);

// Start MSW in development mode
export const startMSW = async () => {
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
		try {
			await worker.start({
				onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
				serviceWorker: {
					url: '/mockServiceWorker.js',
				},
			});
			console.log('🔶 MSW: Mock Service Worker started');
		} catch (error) {
			console.error('❌ MSW: Failed to start Mock Service Worker:', error);
		}
	}
};
