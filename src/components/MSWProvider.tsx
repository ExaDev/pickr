'use client';

import { useEffect, useState } from 'react';

interface MSWProviderProps {
	children: React.ReactNode;
}

export default function MSWProvider({ children }: MSWProviderProps) {
	const [isMSWReady, setIsMSWReady] = useState(false);

	useEffect(() => {
		const initMSW = async () => {
			if (process.env.NODE_ENV === 'development') {
				try {
					// Add timeout to prevent hanging
					const timeoutPromise = new Promise((_, reject) =>
						setTimeout(() => reject(new Error('MSW initialization timeout')), 10000)
					);

					// Dynamic import to avoid SSR issues
					const { worker } = await import('../mocks/browser');

					// Start the worker with proper configuration and timeout
					await Promise.race([
						worker.start({
							onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
							serviceWorker: {
								url: '/mockServiceWorker.js',
							},
							waitUntilReady: true, // Wait for service worker to be ready
						}),
						timeoutPromise,
					]);

					console.log('🔶 MSW: Mock Service Worker started successfully');
					setIsMSWReady(true);
				} catch (error) {
					console.error('❌ MSW: Failed to start Mock Service Worker:', error);
					console.log('⚠️ MSW: Continuing without mocks to prevent app blocking');
					// Continue even if MSW fails to avoid blocking the app
					setIsMSWReady(true);
				}
			} else {
				// In production, skip MSW initialization
				setIsMSWReady(true);
			}
		};

		// Initialize MSW asynchronously
		initMSW();
	}, []);

	// Show loading indicator in development while MSW initializes
	if (process.env.NODE_ENV === 'development' && !isMSWReady) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
					<p className="text-gray-600">Initializing API mocks...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
