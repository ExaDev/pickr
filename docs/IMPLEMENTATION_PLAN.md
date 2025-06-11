# pickr Implementation Plan

## Overview

This document outlines the technical implementation plan for pickr, a web application that enables users to create rankings through intuitive swipe-based pairwise comparisons.

## Technical Architecture

### Core Technologies
- **Frontend Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand for local state persistence
- **Testing**: Vitest + React Testing Library + MSW
- **Deployment**: Static export for CDN hosting

### Key Libraries & Dependencies
- **@tailwindcss/postcss**: v4.1.8 - Modern CSS framework
- **zustand**: To be added - Lightweight state management
- **framer-motion**: To be added - Animation library for swipe gestures
- **react-spring**: Alternative option for gesture animations
- **fuse.js**: To be added - Fuzzy search for pack filtering

## Phase 1: MVP Core Features

### 1.1 Project Structure Setup
**Estimated Time**: 1-2 hours

#### Tasks:
1. Create directory structure as outlined in README
2. Set up base TypeScript types
3. Configure Zustand stores
4. Update package.json with required dependencies

#### Files to Create:
```
src/
├── types/
│   ├── cards.ts
│   ├── ranking.ts
│   └── results.ts
├── store/
│   ├── cards.ts
│   ├── ranking.ts
│   └── results.ts
├── lib/
│   ├── ranking/
│   │   ├── algorithms.ts
│   │   └── utils.ts
│   ├── storage/
│   │   └── local.ts
│   └── utils.ts
```

### 1.2 Type Definitions
**Estimated Time**: 2-3 hours

#### Core Types (src/types/cards.ts):
```typescript
export interface Card {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Pack {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Ranking Types (src/types/ranking.ts):
```typescript
export interface Comparison {
  id: string;
  cards: Card[];
  winner?: Card;
  timestamp?: Date;
}

export interface RankingSession {
  id: string;
  packId: string;
  comparisons: Comparison[];
  currentComparison?: Comparison;
  isComplete: boolean;
  settings: RankingSettings;
}

export interface RankingSettings {
  comparisonSize: number; // 2-N items per comparison
  algorithm: 'pairwise' | 'tournament' | 'swiss';
}
```

#### Results Types (src/types/results.ts):
```typescript
export interface RankingResult {
  id: string;
  sessionId: string;
  packId: string;
  rankings: RankedCard[];
  createdAt: Date;
  pacoCode?: string;
}

export interface RankedCard extends Card {
  rank: number;
  score: number;
  wins: number;
  losses: number;
}
```

### 1.3 State Management with Zustand
**Estimated Time**: 3-4 hours

#### Cards Store (src/store/cards.ts):
```typescript
interface CardsState {
  packs: Pack[];
  currentPack: Pack | null;
  addPack: (pack: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePack: (id: string, updates: Partial<Pack>) => void;
  deletePack: (id: string) => void;
  setCurrentPack: (pack: Pack) => void;
  addCardToPack: (packId: string, card: Omit<Card, 'id' | 'createdAt'>) => void;
  removeCardFromPack: (packId: string, cardId: string) => void;
}
```

#### Ranking Store (src/store/ranking.ts):
```typescript
interface RankingState {
  currentSession: RankingSession | null;
  startSession: (packId: string, settings: RankingSettings) => void;
  submitComparison: (winner: Card) => void;
  completeSession: () => RankingResult;
  resetSession: () => void;
}
```

### 1.4 Core Ranking Algorithm
**Estimated Time**: 4-5 hours

#### Pairwise Comparison Engine (src/lib/ranking/algorithms.ts):
```typescript
export class PairwiseRanking {
  private comparisons: Map<string, number> = new Map();
  
  generateNextComparison(cards: Card[], completed: Comparison[]): Card[] | null {
    // Generate next pair based on existing comparisons
    // Implement round-robin or optimized pairing
  }
  
  calculateRankings(cards: Card[], comparisons: Comparison[]): RankedCard[] {
    // Calculate final rankings based on comparison results
    // Handle ties and edge cases
  }
  
  isComplete(cards: Card[], comparisons: Comparison[]): boolean {
    // Determine if enough comparisons have been made
  }
}
```

### 1.5 Basic UI Components
**Estimated Time**: 6-8 hours

#### Card Component (src/components/cards/Card.tsx):
```typescript
interface CardProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Card({ card, onClick, selected, disabled }: CardProps) {
  // Render card with text/image content
  // Handle selection states
  // Responsive design
}
```

#### Comparison Interface (src/components/ranking/ComparisonView.tsx):
```typescript
interface ComparisonViewProps {
  comparison: Comparison;
  onSelect: (winner: Card) => void;
}

export function ComparisonView({ comparison, onSelect }: ComparisonViewProps) {
  // Display cards for comparison
  // Handle selection input (click/tap initially)
  // Show progress indicator
}
```

### 1.6 Basic Pages
**Estimated Time**: 4-6 hours

#### Home Page (src/app/page.tsx):
- Pack selection interface
- Create new pack button
- Recent rankings display

#### Pack Creation (src/app/create/page.tsx):
- Form for pack details
- Card addition interface
- Validation and save functionality

#### Ranking Session (src/app/rank/[packId]/page.tsx):
- Comparison interface
- Progress tracking
- Results redirection

#### Results Display (src/app/results/[sessionId]/page.tsx):
- Final ranking display
- Basic sharing functionality

### 1.7 Local Storage Integration
**Estimated Time**: 2-3 hours

#### Storage Utilities (src/lib/storage/local.ts):
```typescript
export class LocalStorage {
  private prefix = 'pickr_';
  
  savePacks(packs: Pack[]): void;
  loadPacks(): Pack[];
  saveSession(session: RankingSession): void;
  loadSession(id: string): RankingSession | null;
  saveResult(result: RankingResult): void;
  loadResults(): RankingResult[];
}
```

## Phase 2: Enhanced Experience

### 2.1 Image Support for Cards
**Estimated Time**: 4-5 hours

#### Enhanced Card Types:
```typescript
interface Card {
  id: string;
  content: string;
  imageUrl?: string;
  imageFile?: File; // For local uploads
  createdAt: Date;
}
```

#### Image Handling:
- File upload component
- Image preview and cropping
- Local storage for images (base64 or object URLs)
- Responsive image display

### 2.2 Swipe Gesture Interface
**Estimated Time**: 6-8 hours

#### Swipe Component (src/components/ranking/SwipeInterface.tsx):
```typescript
interface SwipeInterfaceProps {
  comparison: Comparison;
  onSwipe: (direction: 'left' | 'right', winner: Card) => void;
}
```

#### Implementation:
- Touch and mouse gesture detection
- Smooth animations with framer-motion
- Visual feedback for swipe actions
- Keyboard shortcuts for desktop users

### 2.3 Live Ranking Sidebar
**Estimated Time**: 4-5 hours

#### Ranking Sidebar (src/components/ranking/RankingSidebar.tsx):
- Real-time ranking updates
- Collapsible/expandable interface
- Progress visualization
- Smooth animations for rank changes

### 2.4 Configurable Group Sizes
**Estimated Time**: 3-4 hours

#### Multi-Card Comparisons:
- Support for 2-N item comparisons
- Modified ranking algorithms
- Updated UI for multiple selections
- Settings panel for configuration

### 2.5 Paco Encoding System
**Estimated Time**: 5-6 hours

#### Paco Library (src/lib/paco/):
```typescript
export interface PacoData {
  packId: string;
  rankings: RankedCard[];
  metadata: {
    timestamp: Date;
    version: string;
  };
}

export function encodeToPaco(data: PacoData): string;
export function decodeFromPaco(pacoCode: string): PacoData;
```

#### URL Sharing:
- Compact encoding of results
- URL generation and parsing
- Share buttons and copy functionality
- QR code generation for mobile sharing

## Phase 3: Collaboration & Analysis

### 3.1 Multi-Result Comparison
**Estimated Time**: 6-8 hours

#### Comparison Tools (src/app/compare/page.tsx):
- Input multiple Paco URLs
- Side-by-side ranking display
- Aggregate analysis
- Consensus identification

### 3.2 Advanced Visualization
**Estimated Time**: 4-6 hours

#### Chart Components:
- Bar charts for rankings
- Heatmaps for agreement/disagreement
- Interactive result exploration
- Export functionality (PNG/SVG)

### 3.3 Pack Templates and Sharing
**Estimated Time**: 5-7 hours

#### Template System:
- Predefined pack categories
- Community sharing (future)
- Import/export pack functionality
- Template customization

## Technical Implementation Details

### Database Schema (Local Storage)
```typescript
// Storage structure
interface StorageSchema {
  packs: Record<string, Pack>;
  sessions: Record<string, RankingSession>;
  results: Record<string, RankingResult>;
  settings: UserSettings;
}
```

### Performance Considerations
1. **Large Pack Optimization**:
   - Efficient comparison algorithms
   - Pagination for large result sets
   - Lazy loading of images
   - Web Workers for heavy calculations

2. **Mobile Performance**:
   - Touch gesture optimization
   - Reduced animation complexity on low-end devices
   - Progressive loading of components
   - Service worker for offline functionality

### Security & Privacy
1. **Data Protection**:
   - No server-side data storage
   - Local-only processing
   - Optional data export/backup
   - Clear data deletion options

2. **Input Validation**:
   - Sanitize user input
   - File type validation for images
   - Size limits for uploads
   - XSS prevention

### Testing Strategy

#### Unit Tests:
- Ranking algorithm correctness
- Paco encoding/decoding
- Store mutations and side effects
- Utility functions

#### Component Tests:
- Card rendering and interaction
- Swipe gesture handling
- Form validation
- Responsive layout

#### Integration Tests:
- Complete ranking workflows
- Data persistence
- URL sharing functionality
- Cross-browser compatibility

#### Performance Tests:
- Large pack handling (50+ items)
- Memory usage monitoring
- Animation performance
- Bundle size optimization

## Deployment Strategy

### Static Export Configuration
```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};
```

### Hosting Options
1. **GitHub Pages**: Free, automatic deployment
2. **Vercel**: Optimized Next.js hosting
3. **Netlify**: Easy deployment with form handling
4. **CDN Distribution**: CloudFront, CloudFlare

### Progressive Web App (PWA)
- Service worker for offline functionality
- Web app manifest
- Install prompts
- Background sync capabilities

## Development Timeline

### Phase 1 (MVP): 3-4 weeks
- Week 1: Project setup, types, core algorithm
- Week 2: Basic UI components and pages
- Week 3: Local storage, testing, refinement
- Week 4: Deployment, documentation, polish

### Phase 2 (Enhanced): 2-3 weeks
- Week 1: Image support, swipe gestures
- Week 2: Live sidebar, Paco encoding
- Week 3: Testing, optimization, deployment

### Phase 3 (Collaboration): 2-3 weeks
- Week 1: Multi-result comparison
- Week 2: Advanced visualization, templates
- Week 3: Performance optimization, final polish

## Risk Mitigation

### Technical Risks
1. **Algorithm Complexity**: Start with simple pairwise, iterate
2. **Mobile Performance**: Progressive enhancement approach
3. **Browser Compatibility**: Comprehensive testing matrix
4. **Storage Limitations**: Implement data cleanup strategies

### UX Risks
1. **Gesture Learning Curve**: Provide clear onboarding
2. **Comparison Fatigue**: Optimize algorithm efficiency
3. **Result Clarity**: A/B test visualization approaches
4. **Mobile Usability**: Extensive mobile testing

## Success Metrics

### Technical Metrics
- Bundle size < 500KB gzipped
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

### User Experience Metrics
- Completion rate > 70% for started rankings
- Average session duration > 5 minutes
- Return user rate > 30%
- Share rate > 15% of completed rankings

## Future Enhancements

### Advanced Features
1. **AI-Powered Suggestions**: ML-based initial ordering
2. **Real-time Collaboration**: WebRTC or WebSocket integration
3. **Advanced Analytics**: Detailed comparison insights
4. **API Integration**: Connect to external data sources
5. **Native Mobile Apps**: React Native implementation

### Scalability Considerations
1. **Backend API**: Optional server-side features
2. **User Accounts**: Authentication and cloud sync
3. **Community Features**: Public pack sharing
4. **Enterprise Features**: Team collaboration tools

This implementation plan provides a structured approach to building pickr while maintaining flexibility for iteration and improvement based on user feedback and technical discoveries during development.