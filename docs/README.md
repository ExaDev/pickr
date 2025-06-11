# RankSwipe Documentation

This directory contains comprehensive documentation for the RankSwipe project.

## Documents

### [Implementation Plan](./IMPLEMENTATION_PLAN.md)
Detailed technical implementation plan covering:
- Architecture decisions and technology choices
- Phase-based development approach (MVP → Enhanced → Collaboration)
- Core type definitions and data structures
- Component architecture and state management
- Algorithm design for pairwise comparisons
- Testing strategies and deployment plans
- Timeline estimates and risk mitigation

### Project Structure
Refer to the main [README.md](../README.md) for:
- Project overview and key features
- Quick start guide
- Development commands
- Configuration options
- Usage instructions

## Development Phases

### Phase 1: MVP Core Features (3-4 weeks)
- [x] Project structure and type definitions
- [ ] Basic pack creation with text cards
- [ ] Pairwise comparison engine
- [ ] Simple results display
- [ ] Local storage with Zustand
- [ ] Static export deployment

### Phase 2: Enhanced Experience (2-3 weeks)
- [ ] Image support for cards
- [ ] Swipe gesture interface
- [ ] Live ranking sidebar
- [ ] Configurable group sizes (2-N comparisons)
- [ ] Paco encoding for shareable URLs

### Phase 3: Collaboration & Analysis (2-3 weeks)
- [ ] Multi-result comparison tools
- [ ] Advanced visualisation options
- [ ] Pack templates and sharing
- [ ] Performance optimisations
- [ ] Analytics dashboard

## Key Technical Decisions

### State Management
- **Zustand** for local state persistence
- Client-side only storage for privacy
- Reactive updates for real-time ranking display

### Ranking Algorithm
- **Pairwise comparisons** as core methodology
- Tournament-style elimination for efficiency
- Configurable comparison group sizes (2-N items)
- Tie handling and edge case management

### UI/UX Approach
- **Mobile-first** responsive design
- **Swipe gestures** for intuitive interaction
- **Progressive enhancement** for accessibility
- **Offline-capable** functionality

### Data Sharing
- **Paco encoding** for compact URL sharing
- **No server dependency** for privacy
- **Cross-platform compatibility** via web standards

## Getting Started with Development

1. **Review the Implementation Plan**: Start with `IMPLEMENTATION_PLAN.md` to understand the technical architecture
2. **Set up Development Environment**: Follow the quick start guide in the main README
3. **Choose a Phase**: Begin with Phase 1 MVP features for core functionality
4. **Run Tests**: Use `npm test` to ensure changes don't break existing functionality
5. **Follow Conventions**: Maintain TypeScript strict mode and comprehensive testing

## Contributing

When adding new features or documentation:

1. Update relevant documentation files
2. Add/update tests for new functionality
3. Follow the established file structure
4. Update the roadmap checkboxes as features are completed
5. Maintain backward compatibility where possible

## Architecture Diagrams

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pack Creator  │    │ Ranking Engine  │    │ Results Display │
│                 │    │                 │    │                 │
│ • Text Cards    │───▶│ • Comparisons   │───▶│ • Final Rankings│
│ • Image Cards   │    │ • Algorithms    │    │ • Paco Sharing  │
│ • Pack Mgmt     │    │ • Progress      │    │ • Analysis      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │ Zustand Store   │
                    │                 │
                    │ • Cards State   │
                    │ • Ranking State │
                    │ • Results State │
                    │ • Local Storage │
                    └─────────────────┘
```

## Questions & Support

For development questions:
1. Check the implementation plan for technical details
2. Review existing tests for usage examples
3. Consult the main README for configuration options
4. Create issues for bugs or feature requests

---

**Last Updated**: December 2024  
**Version**: 1.0.0-dev