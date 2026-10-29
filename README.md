# pickr

[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/ExaDev/pickr) [![CI](https://img.shields.io/github/actions/workflow/status/ExaDev/pickr/ci.yml?branch=main)](https://github.com/ExaDev/pickr/actions)

![Coverage](https://img.shields.io/badge/coverage-84.21%25-yellow.svg)

## Overview

pickr is a web application that enables users to create rankings of any set of items through intuitive swipe-based pairwise comparisons. Users can rank anything from personal preferences to team decisions by swiping through comparisons, similar to popular dating app interfaces. The app supports flexible comparison group sizes, real-time ranking visualisation, and shareable results through Paco encoding.

**Perfect for:**
- Personal decision making (favourite movies, restaurants, travel destinations)
- Team collaboration (feature prioritisation, candidate ranking, design selection)
- Entertainment & social activities (tier lists, polls, competitions)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/your-username/pickr
cd pickr
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🎯 Key Features

### ✅ Intuitive Ranking System
- **Swipe-based comparisons** - Familiar mobile-first interface
- **Pairwise comparisons** - Break complex decisions into simple choices
- **Flexible group sizes** - Compare 2-N items per round (configurable)
- **Real-time progress** - Live ranking updates as you compare

### ✅ Flexible Card Creation
- **Text-only cards** - Simple text-based items to rank
- **Image cards** - Visual comparisons with images
- **Mixed content** - Combine text and images for rich comparisons
- **Pack management** - Organise related items into collections

### ✅ Results & Sharing
- **Paco encoding** - Compact, shareable URLs for results
- **Multi-result comparison** - Compare rankings from different users
- **Aggregate analysis** - Identify consensus and differences
- **Offline functionality** - Works without internet connection

### ✅ Technical Excellence
- **Next.js 15** with App Router and TypeScript
- **React 19** with modern features
- **Zustand** for local state management
- **Static export** ready for CDN deployment
- **Mobile-responsive** design with Tailwind CSS
- **Comprehensive testing** with Vitest and MSW

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── create/          # Pack creation pages
│   │   ├── rank/            # Ranking session pages
│   │   ├── results/         # Results display pages
│   │   ├── compare/         # Multi-result comparison
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── cards/           # Card creation and display
│   │   ├── ranking/         # Swipe interface components
│   │   ├── results/         # Results visualisation
│   │   └── ui/              # Common UI components
│   ├── lib/                 # Core utilities
│   │   ├── ranking/         # Ranking algorithms
│   │   ├── paco/            # Paco encoding/decoding
│   │   ├── storage/         # Local storage utilities
│   │   └── utils.ts         # General utilities
│   ├── store/               # Zustand stores
│   │   ├── cards.ts         # Card and pack management
│   │   ├── ranking.ts       # Ranking session state
│   │   └── results.ts       # Results and comparison state
│   ├── types/               # TypeScript definitions
│   │   ├── cards.ts         # Card and pack types
│   │   ├── ranking.ts       # Ranking system types
│   │   └── results.ts       # Results and sharing types
│   └── mocks/               # MSW mock handlers
├── public/                  # Static assets and example images
└── docs/                    # Implementation documentation
```

## 🛠️ Development Commands

### Primary Development
```bash
npm run dev          # Start development server
npm test             # Run tests in watch mode
npm run coverage     # Generate test coverage report
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm run test:run     # Run tests once (CI mode)
npm run test:ui      # Open Vitest UI
npm run coverage     # Generate coverage report
```

### Building & Deployment
```bash
npm run build        # Build for production
npm run storybook    # Start Storybook
npm run build-storybook  # Build Storybook
```

### Release & Commits
```bash
npm run commit       # Interactive conventional commit
npm run release:dry  # Preview release
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:
```env
# Application Configuration
NEXT_PUBLIC_APP_NAME="pickr"
NEXT_PUBLIC_MAX_PACK_SIZE=50
NEXT_PUBLIC_DEFAULT_COMPARISON_SIZE=2

# Storage Configuration
NEXT_PUBLIC_STORAGE_PREFIX="pickr_"
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Development Settings
NEXT_PUBLIC_DEBUG_MODE=false
```

### Customisation Options
- **Comparison group size**: Adjust default comparison size (2-N items)
- **Pack size limits**: Set maximum number of items per pack
- **Storage settings**: Configure local storage behaviour
- **UI themes**: Customise colours and styling in `tailwind.config.ts`

## 🧪 Testing Strategy

### Core Algorithm Testing
- **Ranking algorithms** - Comprehensive tests for pairwise comparison logic
- **Paco encoding/decoding** - URL generation and parsing validation
- **State management** - Zustand store behaviour verification
- **Edge cases** - Handling of ties, incomplete comparisons, and invalid data

### Component Testing
- **Card creation** - Text and image card functionality
- **Swipe interface** - Touch and keyboard interaction testing
- **Results display** - Ranking visualisation and export features
- **Responsive design** - Mobile and desktop layout testing

### Integration Testing
- **Complete user flows** - End-to-end ranking sessions
- **Cross-browser compatibility** - Safari, Chrome, Firefox testing
- **Offline functionality** - Local storage and network independence
- **Performance testing** - Large pack handling and optimisation

## 🚀 Deployment

### Automatic Deployment
- **GitHub Pages** deployment on main branch push
- **Quality gates** ensure code quality
- **Semantic versioning** with automated releases
- **Static export** optimized for CDN

### Manual Deployment
```bash
npm run build    # Generate static export
npx serve out    # Test locally
```

## 🎨 Usage Guide

### Creating Your First Ranking

1. **Create a Pack**
   - Navigate to the create page
   - Add a title and description for your ranking
   - Add items (text, images, or both)
   - Save your pack

2. **Start Ranking**
   - Select your pack from the home page
   - Configure comparison settings (group size)
   - Begin swiping through comparisons
   - Watch the live ranking sidebar update

3. **View and Share Results**
   - Complete all comparisons to see final ranking
   - Share results via the generated Paco URL
   - Compare with other users' rankings

### Advanced Features

- **Custom comparison sizes**: Rank 3-5 items at once for faster sessions
- **Mixed content cards**: Combine text descriptions with images
- **Offline usage**: All functionality works without internet
- **Result analysis**: Compare multiple ranking sessions side-by-side

## 📚 Documentation

### Key Files
- `CLAUDE.md` - AI assistant guidance
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history
- `biome.json` - Code quality configuration
- `vitest.config.ts` - Testing configuration

### Storybook
Component documentation and development environment:
```bash
npm run storybook
```

## 🔒 Security

### Built-in Security Features
- **Dependency auditing** in CI/CD
- **No server-side** attack vectors (static export)
- **Privacy-first** LLM integration
- **Secure defaults** throughout

### Security Commands
```bash
npm run security:check  # Check for vulnerabilities
npm audit              # Dependency audit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Create a pull request

See `CONTRIBUTING.md` for detailed guidelines.

## 📄 License

This project is licensed under the {{LICENSE}} License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Refer to `CLAUDE.md` for AI assistant guidance

## 🎯 Roadmap

### Phase 1: MVP Core Features
- [ ] Basic pack creation with text cards
- [ ] Pairwise comparison engine
- [ ] Simple results display
- [ ] Local storage with Zustand
- [ ] Static export deployment

### Phase 2: Enhanced Experience
- [ ] Image support for cards
- [ ] Configurable group sizes (2-N comparisons)
- [ ] Live ranking sidebar
- [ ] Paco encoding for shareable URLs
- [ ] Mobile-optimised swipe gestures

### Phase 3: Collaboration & Analysis
- [ ] Multi-result comparison tools
- [ ] Aggregate ranking analysis
- [ ] Pack templates and sharing
- [ ] Performance optimisations for large packs
- [ ] Advanced visualisation options

### Future Considerations
- [ ] Real-time collaborative ranking
- [ ] Native mobile applications
- [ ] AI-powered suggestion engine
- [ ] Integration with external data sources
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

Built with modern web development best practices and inspired by the Next.js community. Special thanks to all contributors and the open-source ecosystem.

---

**Happy coding!** 🎉