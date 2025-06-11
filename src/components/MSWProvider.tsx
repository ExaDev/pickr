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
					const { startMSW } = await import('../mocks/browser');
					await startMSW();
					setIsMSWReady(true);
				} catch (error) {
					console.error('Failed to initialize MSW:', error);
					setIsMSWReady(true); // Continue even if MSW fails
				}
			} else {
				setIsMSWReady(true);
			}
		};

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
