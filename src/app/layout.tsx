import type { Metadata } from 'next';
import { SkipLinks } from '../components/accessibility/SkipLinks';
import Footer from '../components/Footer';
import MSWProvider from '../components/MSWProvider';
import './globals.css';

export const metadata: Metadata = {
	title: 'Pickr',
	description: 'A delightful card ranking and comparison application for making decisions easier',
	openGraph: {
		title: 'Pickr',
		description: 'A delightful card ranking and comparison application for making decisions easier',
		type: 'website',
	},
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
				<MSWProvider>
					<main id="main-content" className="flex-1" tabIndex={-1}>
						{children}
					</main>
					<Footer />
				</MSWProvider>
			</body>
		</html>
	);
}
