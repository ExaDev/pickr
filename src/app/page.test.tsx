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

	it('shows the four main feature cards', () => {
		render(<Home />);

		// Check that there are 4 feature cards (h2 elements)
		const featureHeadings = screen.getAllByRole('heading', { level: 2 });
		expect(featureHeadings).toHaveLength(4);
	});

	it('displays the call-to-action button', () => {
		render(<Home />);

		// Look for any button - works regardless of text content
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('has a call-to-action section', () => {
		render(<Home />);

		// Check for the CTA section heading (h3)
		const ctaHeading = screen.getByRole('heading', { level: 3 });
		expect(ctaHeading).toBeInTheDocument();
	});
});
