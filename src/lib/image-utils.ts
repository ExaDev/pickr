/**
 * Image handling utilities for pickr cards
 */

export interface ImageProcessingOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImage {
	dataUrl: string;
	blob: Blob;
	width: number;
	height: number;
	size: number;
}

/**
 * Process an image file for storage and display
 */
export async function processImage(
	file: File,
	options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
	const { maxWidth = 800, maxHeight = 600, quality = 0.8, format = 'jpeg' } = options;

	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();

		img.onload = () => {
			// Calculate new dimensions
			let { width, height } = img;

			if (width > maxWidth || height > maxHeight) {
				const aspectRatio = width / height;

				if (width > height) {
					width = maxWidth;
					height = width / aspectRatio;
				} else {
					height = maxHeight;
					width = height * aspectRatio;
				}
			}

			// Set canvas dimensions
			canvas.width = width;
			canvas.height = height;

			// Draw and compress image
			ctx?.drawImage(img, 0, 0, width, height);

			canvas.toBlob(
				blob => {
					if (!blob) {
						reject(new Error('Failed to process image'));
						return;
					}

					const dataUrl = canvas.toDataURL(`image/${format}`, quality);

					resolve({
						dataUrl,
						blob,
						width,
						height,
						size: blob.size,
					});
				},
				`image/${format}`,
				quality
			);
		};

		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = URL.createObjectURL(file);
	});
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
	// Check file type
	if (!file.type.startsWith('image/')) {
		return { isValid: false, error: 'File must be an image' };
	}

	// Check file size (10MB limit)
	const maxSize = 10 * 1024 * 1024;
	if (file.size > maxSize) {
		return { isValid: false, error: 'Image must be smaller than 10MB' };
	}

	// Check for supported formats
	const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
	if (!supportedFormats.includes(file.type)) {
		return { isValid: false, error: 'Unsupported image format. Use JPEG, PNG, GIF, or WebP' };
	}

	return { isValid: true };
}

/**
 * Create image from data URL
 */
export function createImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = dataUrl;
	});
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = URL.createObjectURL(file);
	});
}

/**
 * Convert file to data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = e => resolve(e.target?.result as string);
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

/**
 * Generate thumbnail from image
 */
export async function generateThumbnail(file: File, size = 150): Promise<string> {
	const processed = await processImage(file, {
		maxWidth: size,
		maxHeight: size,
		quality: 0.7,
		format: 'jpeg',
	});

	return processed.dataUrl;
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
	return new Promise(resolve => {
		const webP = new Image();
		webP.onload = webP.onerror = () => resolve(webP.height === 2);
		webP.src =
			'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
	});
}

/**
 * Storage utilities for images
 */
const STORAGE_KEY = 'pickr_images';
const MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB

function getStorage(): Record<string, string> {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : {};
	} catch {
		return {};
	}
}

function calculateStorageSize(storage: Record<string, string>): number {
	return Object.values(storage).reduce((total, dataUrl) => {
		return total + dataUrl.length * 0.75; // Approximate bytes (base64 overhead)
	}, 0);
}

/**
 * Store image data URL with an ID
 */
export async function storeImage(id: string, dataUrl: string): Promise<void> {
	try {
		const storage = getStorage();
		storage[id] = dataUrl;

		// Check storage size
		const totalSize = calculateStorageSize(storage);
		if (totalSize > MAX_STORAGE_SIZE) {
			throw new Error('Storage limit exceeded');
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
	} catch (error) {
		console.error('Failed to store image:', error);
		throw error;
	}
}

/**
 * Retrieve image data URL by ID
 */
export function getImage(id: string): string | null {
	try {
		const storage = getStorage();
		return storage[id] || null;
	} catch (error) {
		console.error('Failed to retrieve image:', error);
		return null;
	}
}

/**
 * Remove image by ID
 */
export function removeImage(id: string): void {
	try {
		const storage = getStorage();
		delete storage[id];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
	} catch (error) {
		console.error('Failed to remove image:', error);
	}
}

/**
 * Clear all stored images
 */
export function clearAllImages(): void {
	localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get current storage size in bytes
 */
export function getStorageSize(): number {
	const storage = getStorage();
	return calculateStorageSize(storage);
}
