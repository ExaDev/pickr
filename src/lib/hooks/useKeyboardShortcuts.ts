import { useEffect } from 'react';

export interface KeyboardShortcut {
	key: string;
	modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
	handler: (event: KeyboardEvent) => void;
	description: string;
	disabled?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Find matching shortcut
			const shortcut = shortcuts.find(s => {
				if (s.disabled) return false;

				// Check if key matches
				if (s.key.toLowerCase() !== event.key.toLowerCase()) return false;

				// Check modifiers
				const modifiers = s.modifiers || [];
				const ctrlRequired = modifiers.includes('ctrl');
				const altRequired = modifiers.includes('alt');
				const shiftRequired = modifiers.includes('shift');
				const metaRequired = modifiers.includes('meta');

				return (
					event.ctrlKey === ctrlRequired &&
					event.altKey === altRequired &&
					event.shiftKey === shiftRequired &&
					event.metaKey === metaRequired
				);
			});

			if (shortcut) {
				event.preventDefault();
				shortcut.handler(event);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [shortcuts]);
}

// Global keyboard shortcuts that work across the app
export function useGlobalKeyboardShortcuts() {
	const shortcuts: KeyboardShortcut[] = [
		{
			key: '/',
			handler: () => {
				// Focus search input if available
				const searchInput = document.querySelector('[role="searchbox"]') as HTMLInputElement;
				if (searchInput) {
					searchInput.focus();
				}
			},
			description: 'Focus search',
		},
		{
			key: '?',
			modifiers: ['shift'],
			handler: () => {
				// Show keyboard shortcuts modal (to be implemented)
				console.log('Show keyboard shortcuts help');
			},
			description: 'Show keyboard shortcuts help',
		},
		{
			key: 'Escape',
			handler: () => {
				// Close modals, cancel selections, etc.
				const activeElement = document.activeElement as HTMLElement;
				if (activeElement?.blur) {
					activeElement.blur();
				}
			},
			description: 'Cancel/close current action',
		},
	];

	useKeyboardShortcuts(shortcuts);
}
