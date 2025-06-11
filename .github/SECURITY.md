# Security Policy

## Supported Versions

We actively support the following versions of BrainPatch with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in BrainPatch, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: [security@brainpatch.dev] (if available)
3. Include detailed steps to reproduce the vulnerability
4. Provide any proof-of-concept code (if applicable)

### What to Include

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and attack scenarios
- **Reproduction**: Step-by-step instructions to reproduce
- **Environment**: Browser, OS, and version information
- **Proof of Concept**: Code or screenshots demonstrating the issue

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Timeline**: Varies based on severity and complexity
- **Disclosure**: Coordinated disclosure after fix is deployed

## Security Measures

### Development Security

- **Dependency Scanning**: Automated npm audit in CI/CD
- **Code Quality**: Biome linting with security-focused rules  
- **Testing**: Comprehensive test coverage including security tests
- **Static Analysis**: TypeScript strict mode for type safety

### Deployment Security

- **Static Export**: No server-side attack surface
- **Client-Side LLM**: Data processing stays on user devices
- **HTTPS**: All deployments must use HTTPS
- **CSP**: Content Security Policy headers recommended

### Dependency Security

- **Automated Updates**: Dependabot for security patches
- **Audit Gates**: CI fails on high/critical vulnerabilities in production dependencies
- **Minimal Dependencies**: Prefer fewer, well-maintained packages
- **Regular Reviews**: Quarterly dependency security reviews

## Security Best Practices for Contributors

### Code Security

- **Input Validation**: Validate all user inputs and LLM outputs
- **XSS Prevention**: Sanitize any dynamic content rendering
- **CSRF Protection**: Use proper CSRF tokens for forms
- **Data Validation**: Validate data types and ranges
- **Error Handling**: Avoid exposing sensitive information in errors

### LLM Security

- **Prompt Injection**: Sanitize and validate LLM prompts
- **Output Filtering**: Filter potentially harmful LLM outputs
- **Rate Limiting**: Implement client-side rate limiting
- **Privacy**: Ensure no sensitive data in LLM interactions
- **Model Validation**: Verify integrity of downloaded models

### General Guidelines

- **Least Privilege**: Request minimal permissions
- **Defense in Depth**: Multiple security layers
- **Regular Updates**: Keep dependencies current
- **Security Testing**: Include security-focused tests
- **Documentation**: Document security considerations

## Vulnerability Disclosure Policy

We are committed to responsible disclosure:

1. **Coordination**: Work with reporters to understand and fix issues
2. **Credit**: Security researchers will be credited (if desired)
3. **Timeline**: Aim for 90-day disclosure timeline
4. **Updates**: Provide regular updates during investigation
5. **Publication**: Publish security advisories after fixes

## Security Contact

For security-related questions or concerns:

- **Issues**: Use GitHub's private vulnerability reporting
- **General Questions**: Create a discussion in GitHub Discussions
- **Development**: Include security considerations in all PRs

## Known Security Considerations

### Browser LLM Security

- **Model Integrity**: Verify model checksums before use
- **Resource Limits**: Monitor memory and CPU usage
- **WebGPU Security**: Be aware of WebGPU attack vectors
- **Local Storage**: Securely handle cached model data

### Static Site Security

- **CDN Security**: Ensure CDN configurations are secure
- **Asset Integrity**: Use SRI for external resources
- **Client-Side Routing**: Properly handle 404s and redirects
- **Build Security**: Secure build and deployment pipelines

## Acknowledgments

We thank the security research community for helping keep BrainPatch safe for everyone.