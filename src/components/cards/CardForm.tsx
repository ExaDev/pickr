import { useRef, useState } from 'react';
import {
	generateThumbnail,
	processImage,
	storeImage,
	validateImageFile,
} from '../../lib/image-utils';
import { generateId } from '../../lib/utils';
import type { CardInput } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CardFormProps {
	onSubmit: (card: CardInput) => void;
	onCancel?: () => void;
	disabled?: boolean;
	placeholder?: string;
}

export function CardForm({
	onSubmit,
	onCancel,
	disabled = false,
	placeholder = 'Enter card content...',
}: CardFormProps) {
	const [content, setContent] = useState('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isProcessingImage, setIsProcessingImage] = useState(false);
	const [imageError, setImageError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Reset previous errors
		setImageError(null);

		// Validate file
		const validation = validateImageFile(file);
		if (!validation.isValid) {
			setImageError(validation.error || 'Invalid image file');
			return;
		}

		setIsProcessingImage(true);

		try {
			// Generate thumbnail for preview
			const thumbnail = await generateThumbnail(file, 200);
			setImagePreview(thumbnail);
			setImageFile(file);
		} catch (error) {
			setImageError('Failed to process image. Please try another file.');
			console.error('Image processing error:', error);
		} finally {
			setIsProcessingImage(false);
		}
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim()) {
			return;
		}

		try {
			let imageUrl: string | undefined;

			// Process and store image if provided
			if (imageFile) {
				const processed = await processImage(imageFile, {
					maxWidth: 800,
					maxHeight: 600,
					quality: 0.8,
					format: 'jpeg',
				});

				// Store image with unique ID
				const imageId = generateId();
				await storeImage(imageId, processed.dataUrl);
				imageUrl = processed.dataUrl;
			}

			const cardInput: CardInput = {
				content: content.trim(),
				imageUrl,
			};

			onSubmit(cardInput);

			// Reset form
			setContent('');
			setImageFile(null);
			setImagePreview(null);
			setImageError(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (error) {
			setImageError('Failed to process image. Please try again.');
			console.error('Image submission error:', error);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			handleSubmit(e);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Image preview */}
			{imagePreview && (
				<div className="relative">
					<img
						src={imagePreview}
						alt="Preview"
						className="w-full h-32 object-cover rounded-md border"
					/>
					<button
						type="button"
						onClick={handleRemoveImage}
						className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/80"
						disabled={isProcessingImage}
					>
						×
					</button>
					{isProcessingImage && (
						<div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
							<div className="text-white text-sm flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Processing...
							</div>
						</div>
					)}
				</div>
			)}

			{/* Image error */}
			{imageError && (
				<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
					<p className="text-sm text-destructive">{imageError}</p>
				</div>
			)}

			{/* Content input */}
			<div className="space-y-2">
				<Input
					value={content}
					onChange={e => setContent(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					required
					autoFocus
				/>
				<p className="text-xs text-muted-foreground">
					{content.length}/200 characters • Press Cmd+Enter to add
				</p>
			</div>

			{/* Image upload */}
			<div className="flex items-center gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="hidden"
					disabled={disabled}
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
					disabled={disabled || isProcessingImage}
				>
					{isProcessingImage ? (
						<>
							<div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-2" />
							Processing...
						</>
					) : (
						<>{imageFile ? 'Change Image' : 'Add Image'}</>
					)}
				</Button>
				{imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
			</div>

			{/* Actions */}
			<div className="flex items-center gap-2">
				<Button type="submit" disabled={disabled || !content.trim()} size="sm">
					Add Card
				</Button>
				{onCancel && (
					<Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={disabled}>
						Cancel
					</Button>
				)}
			</div>
		</form>
	);
}
