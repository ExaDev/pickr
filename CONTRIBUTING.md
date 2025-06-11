# Contributing to Pickr

Thank you for your interest in contributing to Pickr! This document provides guidelines and information for contributors.

## Development Workflow

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Examples
```bash
feat: add card comparison algorithm
fix: resolve swipe gesture issue
docs: update installation instructions
test: add integration tests for ranking system
```

### Interactive Commits
Use the interactive commit tool for guided conventional commits:
```bash
npm run commit
```

This will prompt you through the commit message format and ensure compliance.

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Open test UI
npm run coverage     # Generate coverage report

# Code Quality
npm run lint         # Check code quality
npm run lint:fix     # Fix auto-fixable issues
npm run format       # Format code
npm run type-check   # Check TypeScript types

# Release
npm run release:dry  # Preview release without publishing
npm run release      # Create release (CI only)
```

## Code Quality

### Pre-commit Hooks
Husky automatically runs the following on each commit:
- **Biome**: Linting and formatting
- **Tests**: Related tests for changed files
- **Commitlint**: Validates commit message format

### Code Standards
- **TypeScript**: Strict type checking enabled
- **Biome**: Enforces consistent code style
- **Testing**: Comprehensive test coverage expected
- **Documentation**: Update docs for user-facing changes

## Release Process

### Automated Versioning
This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning:

- **Patch**: Bug fixes (`fix:` type)
- **Minor**: New features (`feat:` type)
- **Major**: Breaking changes (`BREAKING CHANGE:` footer)

### Release Branches
- **main**: Production releases
- **beta**: Beta pre-releases
- **alpha**: Alpha pre-releases

### Manual Release
For maintainers only:
```bash
npm run release:dry    # Preview what would be released
npm run release        # Create actual release
```

## Testing Guidelines

### Test Structure
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows (future)

### Test Patterns
```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Coverage Requirements
- **Statements**: 80%+
- **Branches**: 70%+
- **Functions**: 80%+
- **Lines**: 80%+

## Architecture Guidelines

### File Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── test/            # Test utilities and setup
```

### Card Ranking Features
- **Intuitive interface**: Prioritise user-friendly comparison flows
- **Performance**: Handle large card sets efficiently
- **Mobile-first**: Optimise for touch-based interactions
- **Privacy**: All data processing happens client-side

### Component Guidelines
- **TypeScript**: All components must be typed
- **Accessibility**: Follow WCAG 2.1 AA guidelines  
- **Performance**: Optimise for static generation
- **Testing**: Include tests for public interfaces

## Getting Help

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Documentation**: Check the README and inline docs

## License

By contributing to Pickr, you agree that your contributions will be licensed under the same license as the project.