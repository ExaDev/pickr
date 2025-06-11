/**
 * Paco encoding system for sharing ranking results via URLs
 * Implements a compact, URL-safe encoding format
 */

import type { PacoData, RankedCard } from '../../types';

// Current version of the encoding format
const _PACO_VERSION = '1.0';

// Base64 URL-safe characters (RFC 4648)
const _BASE64_URL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

interface CompactRankedCard {
	i: string; // id
	c: string; // content
	r: number; // rank
	s: number; // score (0-100)
	w: number; // wins
	l: number; // losses
	img?: string; // imageUrl (optional)
}

interface CompactPacoData {
	v: string; // version
	p: string; // packId
	t: number; // timestamp (unix)
	a: string; // algorithm
	r: CompactRankedCard[]; // rankings
}

/**
 * Encode ranking data to Paco format
 */
export function encodeToPaco(data: PacoData): string {
	try {
		// Create compact representation
		const compact: CompactPacoData = {
			v: data.metadata.version,
			p: data.packId,
			t: Math.floor(data.metadata.timestamp.getTime() / 1000),
			a: data.metadata.algorithm,
			r: data.rankings.map(card => ({
				i: card.id,
				c: card.content,
				r: card.rank,
				s: Math.round(card.score * 100),
				w: card.wins,
				l: card.losses,
				...(card.imageUrl && { img: compressImageUrl(card.imageUrl) }),
			})),
		};

		// Convert to JSON and compress
		const jsonString = JSON.stringify(compact);
		const compressed = compressString(jsonString);

		// Encode to base64 URL-safe
		const encoded = encodeBase64Url(compressed);

		return `p_${encoded}`;
	} catch (error) {
		console.error('Failed to encode Paco data:', error);
		throw new Error('Failed to generate sharing code');
	}
}

/**
 * Decode Paco format to ranking data
 */
export function decodeFromPaco(pacoCode: string): PacoData | null {
	try {
		// Validate format
		if (!pacoCode.startsWith('p_')) {
			throw new Error('Invalid Paco code format');
		}

		// Decode from base64 URL-safe
		const encoded = pacoCode.slice(2);
		const compressed = decodeBase64Url(encoded);

		// Decompress
		const jsonString = decompressString(compressed);
		const compact: CompactPacoData = JSON.parse(jsonString);

		// Validate required fields
		if (!compact.v || !compact.p || !compact.r) {
			throw new Error('Invalid Paco data structure');
		}

		// Convert back to full format
		const rankings: RankedCard[] = compact.r.map(card => ({
			id: card.i,
			content: card.c,
			rank: card.r,
			score: card.s / 100,
			wins: card.w,
			losses: card.l,
			createdAt: new Date(), // Placeholder since we don't store this
			...(card.img && { imageUrl: decompressImageUrl(card.img) }),
		}));

		return {
			packId: compact.p,
			rankings,
			metadata: {
				timestamp: new Date(compact.t * 1000),
				version: compact.v,
				algorithm: compact.a,
			},
		};
	} catch (error) {
		console.error('Failed to decode Paco data:', error);
		return null;
	}
}

/**
 * Validate Paco code format
 */
export function validatePacoCode(pacoCode: string): boolean {
	if (!pacoCode || typeof pacoCode !== 'string') {
		return false;
	}

	if (!pacoCode.startsWith('p_')) {
		return false;
	}

	// Try to decode - if it fails, it's invalid
	return decodeFromPaco(pacoCode) !== null;
}

/**
 * Get shareable URL for Paco code
 */
export function getShareableUrl(pacoCode: string, baseUrl?: string): string {
	const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
	return `${base}/results/shared?code=${encodeURIComponent(pacoCode)}`;
}

/**
 * Extract Paco code from shareable URL
 */
export function extractPacoFromUrl(url: string): string | null {
	try {
		const urlObj = new URL(url);
		const code = urlObj.searchParams.get('code');
		return code && validatePacoCode(code) ? code : null;
	} catch {
		return null;
	}
}

/**
 * Simple string compression using run-length encoding for repeated characters
 */
function compressString(str: string): string {
	// For now, just return the string - could implement LZ77 or similar
	// This is a placeholder for more sophisticated compression
	return str;
}

/**
 * Decompress string
 */
function decompressString(str: string): string {
	// Placeholder - should match compressString implementation
	return str;
}

/**
 * Encode string to base64 URL-safe format
 */
function encodeBase64Url(str: string): string {
	// Convert string to base64
	const base64 = btoa(unescape(encodeURIComponent(str)));

	// Make URL-safe
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode base64 URL-safe format to string
 */
function decodeBase64Url(str: string): string {
	// Add padding if needed
	const padded = str + '='.repeat((4 - (str.length % 4)) % 4);

	// Convert back from URL-safe
	const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');

	// Decode from base64
	return decodeURIComponent(escape(atob(base64)));
}

/**
 * Compress image URL (placeholder - could implement actual compression)
 */
function compressImageUrl(imageUrl: string): string {
	// For data URLs, we could compress the base64 data
	// For now, just return as-is (could be improved)
	if (imageUrl.startsWith('data:')) {
		// Could compress the base64 part
		return imageUrl;
	}
	return imageUrl;
}

/**
 * Decompress image URL
 */
function decompressImageUrl(compressed: string): string {
	// Should match compressImageUrl implementation
	return compressed;
}

/**
 * Generate short Paco code for sharing (first 8 characters + checksum)
 */
export function generateShortCode(pacoCode: string): string {
	if (!validatePacoCode(pacoCode)) {
		throw new Error('Invalid Paco code');
	}

	const content = pacoCode.slice(2); // Remove 'p_' prefix
	const short = content.slice(0, 8);
	const checksum = generateChecksum(content);

	return `${short}${checksum}`;
}

/**
 * Generate checksum for validation
 */
function generateChecksum(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}

	// Convert to base36 and take first 2 characters
	return Math.abs(hash).toString(36).slice(0, 2);
}

/**
 * Estimate encoded size
 */
export function estimateEncodedSize(data: PacoData): number {
	// Rough estimate of final encoded size in characters
	const jsonSize = JSON.stringify(data).length;
	const compressedEstimate = jsonSize * 0.7; // Assume 30% compression
	const base64Estimate = compressedEstimate * 1.33; // Base64 overhead

	return Math.ceil(base64Estimate);
}
