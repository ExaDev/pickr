import type { Metadata, Viewport } from 'next';
import Footer from '../components/Footer';
import MSWProvider from '../components/MSWProvider';
import { PWAInstallPrompt, PWAStatusIndicator } from '../components/PWAInstallPrompt';
import PWAProvider from '../components/PWAProvider';
import { SkipLinks } from '../components/accessibility/SkipLinks';
import './globals.css';

export const metadata: Metadata = {
	title: 'Pickr - Pairwise Ranking Tool',
	description:
		'Make better decisions through pairwise comparisons. Rank anything from movies to restaurants to ideas.',
	keywords: ['ranking', 'comparison', 'decision making', 'pairwise', 'voting', 'survey'],
	authors: [{ name: 'Pickr Team' }],
	creator: 'Pickr Team',
	publisher: 'Pickr Team',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: 'Pickr - Pairwise Ranking Tool',
		description:
			'Make better decisions through pairwise comparisons. Rank anything from movies to restaurants to ideas.',
		type: 'website',
		locale: 'en_US',
		siteName: 'Pickr',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Pickr - Pairwise Ranking Tool',
		description:
			'Make better decisions through pairwise comparisons. Rank anything from movies to restaurants to ideas.',
	},
	manifest: '/manifest.json',
	icons: {
		icon: [
			{ url: '/icon-32.svg', sizes: '32x32', type: 'image/svg+xml' },
			{ url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
			{ url: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
		],
		apple: [{ url: '/icon-180.svg', sizes: '180x180', type: 'image/svg+xml' }],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Pickr',
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#000000' },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased min-h-screen flex flex-col">
				<SkipLinks />
				<PWAProvider>
					<MSWProvider>
						<PWAStatusIndicator />
						<main id="main-content" className="flex-1" tabIndex={-1}>
							{children}
						</main>
						<Footer />
						<PWAInstallPrompt />
					</MSWProvider>
				</PWAProvider>
			</body>
		</html>
	);
}
