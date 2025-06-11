'use client';

import { useEffect } from 'react';
import { PWAManager } from '../lib/pwa';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		// Register service worker on component mount
		PWAManager.registerServiceWorker();

		// Add any additional PWA initialization here
		console.log('PWA Provider initialized');
	}, []);

	return <>{children}</>;
}
