import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { CardInput } from '../../types';

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
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file');
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				alert('Image must be smaller than 5MB');
				return;
			}

			setImageFile(file);
			
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!content.trim()) {
			return;
		}

		const cardInput: CardInput = {
			content: content.trim(),
			imageFile: imageFile || undefined,
			imageUrl: imagePreview || undefined,
		};

		onSubmit(cardInput);
		
		// Reset form
		setContent('');
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
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
					>
						×
					</button>
				</div>
			)}

			{/* Content input */}
			<div className="space-y-2">
				<Input
					value={content}
					onChange={(e) => setContent(e.target.value)}
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
					disabled={disabled}
				>
					{imageFile ? 'Change Image' : 'Add Image'}
				</Button>
				{imageFile && (
					<span className="text-sm text-muted-foreground">
						{imageFile.name}
					</span>
				)}
			</div>

			{/* Actions */}
			<div className="flex items-center gap-2">
				<Button
					type="submit"
					disabled={disabled || !content.trim()}
					size="sm"
				>
					Add Card
				</Button>
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onCancel}
						disabled={disabled}
					>
						Cancel
					</Button>
				)}
			</div>
		</form>
	);
}