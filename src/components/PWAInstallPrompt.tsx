'use client';

import { useState } from 'react';
import { usePWA } from '../lib/pwa';
import { Button } from './ui/Button';

export function PWAInstallPrompt() {
	const { canInstall, isInstalled, installApp } = usePWA();
	const [isInstalling, setIsInstalling] = useState(false);
	const [dismissed, setDismissed] = useState(false);

	// Don't show if already installed or dismissed
	if (isInstalled || dismissed || !canInstall) {
		return null;
	}

	const handleInstall = async () => {
		setIsInstalling(true);
		try {
			await installApp();
		} catch (error) {
			console.error('Failed to install app:', error);
		} finally {
			setIsInstalling(false);
		}
	};

	const handleDismiss = () => {
		setDismissed(true);
	};

	return (
		<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-background border border-border rounded-lg shadow-lg p-4 z-50">
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
					<svg
						className="w-6 h-6 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Install app icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
						/>
					</svg>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-medium text-foreground mb-1">Install Pickr</h3>
					<p className="text-xs text-muted-foreground mb-3">
						Install the app for a better experience and offline access.
					</p>
					<div className="flex gap-2">
						<Button size="sm" onClick={handleInstall} disabled={isInstalling} className="flex-1">
							{isInstalling ? 'Installing...' : 'Install'}
						</Button>
						<Button size="sm" variant="outline" onClick={handleDismiss} className="px-3">
							Later
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function PWAStatusIndicator() {
	const { isOnline, isInstalled } = usePWA();

	if (isOnline && !isInstalled) {
		return null;
	}

	return (
		<div className="fixed top-4 right-4 z-40">
			{!isOnline && (
				<div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
					<div className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse" />
					Offline
				</div>
			)}
			{isInstalled && (
				<div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
					<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
						<title>App installed icon</title>
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
					Installed
				</div>
			)}
		</div>
	);
}
