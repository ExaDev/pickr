# BrainPatch CI/CD & Security

This directory contains the CI/CD pipeline and security configuration for BrainPatch.

## CI/CD Pipeline (.github/workflows/ci.yml)

### Security Auditing
The CI pipeline includes comprehensive security checks:

- **npm audit**: Scans for known vulnerabilities in dependencies
- **Production Focus**: High/critical vulnerabilities in production dependencies fail the build
- **Development Tolerance**: Moderate vulnerabilities in dev dependencies are reported but don't fail
- **Multi-level Checks**: Different audit levels for different dependency scopes

### Quality Gates
All code must pass these checks before merging:

1. **Linting & Formatting**: Biome checks for code quality
2. **Type Checking**: TypeScript strict mode validation  
3. **Testing**: Full test suite with coverage reporting
4. **Security Audit**: Dependency vulnerability scanning
5. **Build Verification**: Successful static export generation

### Pipeline Jobs

```yaml
lint-and-format → 
test            → build → release (main branch only)
security-audit  →
```

### Job Details

**lint-and-format**:
- Biome linting and formatting checks
- TypeScript type checking
- Fast feedback on code quality issues

**test**:
- Vitest test suite execution
- Coverage report generation
- Codecov integration for coverage tracking

**security-audit**:
- `npm audit --audit-level=moderate` for all dependencies
- `npm audit --omit=dev --audit-level=high` for production only
- Fails CI if high/critical vulnerabilities in production dependencies

**build**:
- Next.js static export build
- Artifact upload for deployment verification
- Build output validation

**release** (main branch only):
- Semantic release with conventional commits
- Automated versioning and changelog generation
- GitHub release creation

## Dependency Management (.github/dependabot.yml)

### Automated Updates
Dependabot provides:

- **Weekly Updates**: Every Monday at 09:00 UTC
- **Grouped PRs**: Related dependencies updated together
- **Security Patches**: Immediate updates for security vulnerabilities
- **PR Limits**: Maximum 5 npm + 3 GitHub Actions PRs open simultaneously

### Dependency Groups
- **react-ecosystem**: React, Next.js, and related packages
- **testing**: Vitest, Testing Library, jsdom
- **code-quality**: Biome, ESLint, Prettier
- **build-tools**: Vite, Webpack, PostCSS, Tailwind
- **release-tools**: Semantic Release, Commitizen, Husky

### GitHub Actions Updates
- **Weekly Schedule**: Keep CI actions up to date
- **Security Focused**: Automatic updates for action vulnerabilities

## Security Policy (.github/SECURITY.md)

### Vulnerability Reporting
- Responsible disclosure process
- 48-hour acknowledgment SLA
- Coordinated disclosure timeline

### Security Measures
- **Development**: Dependency scanning, code quality, testing
- **Deployment**: Static export, client-side LLM, HTTPS
- **Dependencies**: Automated updates, audit gates, minimal deps

### LLM-Specific Security
- **Prompt Injection**: Input sanitization guidelines
- **Model Integrity**: Checksum verification requirements
- **Privacy**: Client-side processing guarantees
- **Resource Limits**: Memory and CPU monitoring

## Local Security Commands

```bash
# Basic audit
npm run audit

# Production dependencies only  
npm run audit:prod

# Security check (high/critical in prod)
npm run security:check

# CI-level audit
npm run audit:ci

# Fix automatically
npm run audit:fix
```

## Security Status

### Current Status
- ✅ **Production Dependencies**: No high/critical vulnerabilities
- ⚠️ **Development Dependencies**: 7 moderate vulnerabilities (Vitest ecosystem)
- ✅ **CI Pipeline**: All security checks passing
- ✅ **Dependabot**: Configured for automated updates

### Development Vulnerabilities
Current moderate vulnerabilities are in the Vitest/Vite ecosystem (development-only):
- esbuild development server security issue
- These do not affect production builds or runtime security

### Resolution Strategy
- Monitor for Vitest ecosystem updates
- Development vulnerabilities are acceptable as they don't affect production
- Production builds use Next.js static export (no development server)

## Monitoring & Maintenance

### Weekly Tasks
- Review Dependabot PRs
- Check security audit reports
- Update vulnerability assessments

### Monthly Tasks  
- Comprehensive dependency review
- Security policy updates
- CI/CD pipeline optimization

### Quarterly Tasks
- Full security assessment
- Dependency cleanup and optimization
- Security training and documentation updates

## Best Practices

### For Developers
1. Run `npm run security:check` before commits
2. Review Dependabot PRs promptly
3. Follow security guidelines in SECURITY.md
4. Include security considerations in PR reviews

### For Maintainers
1. Monitor CI security job failures closely
2. Investigate and resolve high/critical vulnerabilities immediately
3. Keep security policy updated
4. Coordinate security disclosures responsibly