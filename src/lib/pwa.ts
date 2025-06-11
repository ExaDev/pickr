/**
 * PWA utilities for service worker registration and app install prompts
 */

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

export class PWAManager {
	private deferredPrompt: BeforeInstallPromptEvent | null = null;
	private isInstalled = false;

	constructor() {
		// Only initialize on client side
		if (typeof window !== 'undefined') {
			this.init();
		}
	}

	private init() {
		// Check if app is already installed
		this.checkIfInstalled();

		// Listen for beforeinstallprompt event
		window.addEventListener('beforeinstallprompt', e => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later
			this.deferredPrompt = e as BeforeInstallPromptEvent;
			console.log('PWA install prompt available');
		});

		// Listen for app installed event
		window.addEventListener('appinstalled', () => {
			console.log('PWA was installed');
			this.isInstalled = true;
			this.deferredPrompt = null;
		});
	}

	/**
	 * Check if the app is running in standalone mode (installed)
	 */
	private checkIfInstalled(): boolean {
		if (typeof window === 'undefined') {
			return false;
		}

		const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches;
		const isIOSStandalone = (window.navigator as any).standalone === true;
		this.isInstalled = isStandalone || isIOSStandalone;
		return this.isInstalled;
	}

	/**
	 * Check if the app can be installed
	 */
	public canInstall(): boolean {
		return this.deferredPrompt !== null && !this.isInstalled;
	}

	/**
	 * Check if the app is currently installed
	 */
	public getIsInstalled(): boolean {
		return this.isInstalled;
	}

	/**
	 * Show the install prompt
	 */
	public async showInstallPrompt(): Promise<boolean> {
		if (!this.deferredPrompt) {
			console.log('No install prompt available');
			return false;
		}

		try {
			// Show the install prompt
			await this.deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
			const { outcome } = await this.deferredPrompt.userChoice;

			// Clear the saved prompt since it can only be used once
			this.deferredPrompt = null;

			console.log(`User ${outcome} the install prompt`);
			return outcome === 'accepted';
		} catch (error) {
			console.error('Error showing install prompt:', error);
			return false;
		}
	}

	/**
	 * Register the service worker
	 */
	public static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
		if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
			console.log('Service Workers not supported');
			return null;
		}

		try {
			const registration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/',
			});

			console.log('Service Worker registered successfully:', registration);

			// Handle updates
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							// New content is available, prompt user to refresh
							console.log('New content available, please refresh');
							// You could show a toast notification here
						}
					});
				}
			});

			return registration;
		} catch (error) {
			console.error('Service Worker registration failed:', error);
			return null;
		}
	}

	/**
	 * Check if the browser supports PWA features
	 */
	public static checkPWASupport(): {
		serviceWorker: boolean;
		manifest: boolean;
		installPrompt: boolean;
	} {
		if (typeof window === 'undefined') {
			return {
				serviceWorker: false,
				manifest: false,
				installPrompt: false,
			};
		}

		return {
			serviceWorker: 'serviceWorker' in navigator,
			manifest: 'onbeforeinstallprompt' in window,
			installPrompt: 'onbeforeinstallprompt' in window,
		};
	}

	/**
	 * Get network status
	 */
	public static getNetworkStatus(): {
		online: boolean;
		connection?: any;
	} {
		if (typeof window === 'undefined') {
			return { online: true };
		}

		return {
			online: navigator.onLine,
			connection:
				(navigator as any).connection ||
				(navigator as any).mozConnection ||
				(navigator as any).webkitConnection,
		};
	}
}

// Export singleton instance
export const pwaManager = new PWAManager();

/**
 * Hook for React components to use PWA functionality
 */
export function usePWA() {
	const [canInstall, setCanInstall] = useState(pwaManager.canInstall());
	const [isInstalled, setIsInstalled] = useState(pwaManager.getIsInstalled());
	const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

	useEffect(() => {
		// Update install state when beforeinstallprompt fires
		const handleBeforeInstallPrompt = () => {
			setCanInstall(pwaManager.canInstall());
		};

		// Update installed state when app is installed
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setCanInstall(false);
		};

		// Update online status
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.addEventListener('appinstalled', handleAppInstalled);
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
			window.removeEventListener('appinstalled', handleAppInstalled);
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	const installApp = async () => {
		const success = await pwaManager.showInstallPrompt();
		if (success) {
			setCanInstall(false);
			setIsInstalled(true);
		}
		return success;
	};

	return {
		canInstall,
		isInstalled,
		isOnline,
		installApp,
		pwaSupport: PWAManager.checkPWASupport(),
		networkStatus: PWAManager.getNetworkStatus(),
	};
}

// Import useState and useEffect for the hook
import { useEffect, useState } from 'react';
