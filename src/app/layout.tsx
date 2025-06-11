import type { Metadata } from 'next';
import Footer from '../components/Footer';
import MSWProvider from '../components/MSWProvider';
import './globals.css';

export const metadata: Metadata = {
	title: 'BrainPatch',
	description:
		'Intelligent, LLM-powered learning platform that creates personalised courses based on individual knowledge gaps',
	openGraph: {
		title: 'BrainPatch',
		description:
			'Intelligent, LLM-powered learning platform that creates personalised courses based on individual knowledge gaps',
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
