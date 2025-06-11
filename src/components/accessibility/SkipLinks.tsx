interface SkipLink {
	href: string;
	label: string;
}

interface SkipLinksProps {
	links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
	{ href: '#main-content', label: 'Skip to main content' },
	{ href: '#navigation', label: 'Skip to navigation' },
	{ href: '#footer', label: 'Skip to footer' },
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
	return (
		<div className="sr-only focus-within:not-sr-only">
			<div className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground rounded-md shadow-lg">
				{links.map(link => (
					<a
						key={link.href}
						href={link.href}
						className="block px-4 py-2 text-sm font-medium hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 first:rounded-t-md last:rounded-b-md"
					>
						{link.label}
					</a>
				))}
			</div>
		</div>
	);
}
