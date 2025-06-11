import { useEffect, useRef } from 'react';

export function useFocusManagement() {
	const previousFocusRef = useRef<HTMLElement | null>(null);

	const saveFocus = () => {
		previousFocusRef.current = document.activeElement as HTMLElement;
	};

	const restoreFocus = () => {
		if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
			previousFocusRef.current.focus();
		}
	};

	const focusFirst = (container?: HTMLElement) => {
		const element = container || document;
		const focusable = element.querySelector(
			'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
		) as HTMLElement;

		if (focusable) {
			focusable.focus();
			return true;
		}
		return false;
	};

	const trapFocus = (container: HTMLElement) => {
		const focusableElements = container.querySelectorAll(
			'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
		);

		const firstFocusable = focusableElements[0] as HTMLElement;
		const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				if (event.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstFocusable) {
						event.preventDefault();
						lastFocusable.focus();
					}
				} else {
					// Tab
					if (document.activeElement === lastFocusable) {
						event.preventDefault();
						firstFocusable.focus();
					}
				}
			}
		};

		container.addEventListener('keydown', handleKeyDown);
		return () => container.removeEventListener('keydown', handleKeyDown);
	};

	return {
		saveFocus,
		restoreFocus,
		focusFirst,
		trapFocus,
	};
}

// Hook for auto-focusing elements
export function useAutoFocus(shouldFocus = true, delay = 0) {
	const elementRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (shouldFocus && elementRef.current) {
			const timer = setTimeout(() => {
				elementRef.current?.focus();
			}, delay);

			return () => clearTimeout(timer);
		}
	}, [shouldFocus, delay]);

	return elementRef;
}

// Hook for focus trapping in modals/dialogs
export function useFocusTrap(isActive = true) {
	const containerRef = useRef<HTMLElement>(null);
	const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();

	useEffect(() => {
		if (isActive && containerRef.current) {
			saveFocus();
			const cleanup = trapFocus(containerRef.current);

			// Focus first element in container
			const firstFocusable = containerRef.current.querySelector(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
			) as HTMLElement;

			if (firstFocusable) {
				firstFocusable.focus();
			}

			return () => {
				cleanup();
				restoreFocus();
			};
		}
	}, [isActive, saveFocus, restoreFocus, trapFocus]);

	return containerRef;
}
