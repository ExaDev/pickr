import type { Metadata } from 'next';
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
				<MSWProvider>
					<div className="flex-1">{children}</div>
					<Footer />
				</MSWProvider>
			</body>
		</html>
	);
}
