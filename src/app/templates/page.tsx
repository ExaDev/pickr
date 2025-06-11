'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TemplateBrowser } from '../../components/templates/TemplateBrowser';
import { Button } from '../../components/ui/Button';

export default function TemplatesPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header */}
				<header className="text-center mb-12">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl font-bold mb-4">Pack Templates</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
							Choose from hundreds of pre-made ranking templates or create your own. Get started
							instantly with curated lists across every category.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button onClick={() => router.push('/create')} size="lg">
								Create Custom Pack
							</Button>
							<Button variant="outline" onClick={() => router.push('/')} size="lg">
								← Back to Home
							</Button>
						</div>
					</motion.div>
				</header>

				{/* Template Browser */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<TemplateBrowser showSearch={true} showCategories={true} />
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					className="text-center mt-16 p-8 bg-muted/30 rounded-lg"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<h2 className="text-2xl font-semibold mb-4">Can't find what you're looking for?</h2>
					<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
						Create your own custom pack with items you want to rank. You can add text, images, and
						organize them however you like.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button onClick={() => router.push('/create')} size="lg">
							Create Custom Pack
						</Button>
						<Button variant="outline" onClick={() => router.push('/results/shared')} size="lg">
							View Shared Results
						</Button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
