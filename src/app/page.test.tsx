import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Home Page', () => {
	it('renders the main heading', () => {
		render(<Home />);

		// Look for any h1 heading - works for both template and configured versions
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toBeInTheDocument();
	});

	it('displays the main description', () => {
		render(<Home />);

		// Look for multiple paragraphs to verify content is present
		const paragraphs = screen.getAllByRole('paragraph');
		expect(paragraphs.length).toBeGreaterThan(0);
	});

	it('shows the main feature sections', () => {
		render(<Home />);

		// Check that there are h2 headings (at least the "Try Example Packs" section)
		const featureHeadings = screen.getAllByRole('heading', { level: 2 });
		expect(featureHeadings.length).toBeGreaterThan(0);
	});

	it('displays action buttons', () => {
		render(<Home />);

		// Look for the primary CTA button
		const createButton = screen.getByRole('button', { name: /create new pack/i });
		expect(createButton).toBeInTheDocument();
	});

	it('has feature sections with h3 headings', () => {
		render(<Home />);

		// Check for feature headings (h3)
		const featureHeadings = screen.getAllByRole('heading', { level: 3 });
		expect(featureHeadings.length).toBeGreaterThan(2); // At least 3 feature cards
	});
});
