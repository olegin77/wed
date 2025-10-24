# 🤝 Contributing to WeddingTech Platform

Thank you for your interest in contributing to WeddingTech! This document provides guidelines for contributing to the project.

## 📋 Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or newer
- npm 10.x or newer
- Git
- Docker (optional, for database)

### Setup Development Environment

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/weddingtech.git
cd weddingtech

# 3. Add upstream remote
git remote add upstream https://github.com/original/weddingtech.git

# 4. Install dependencies
npm install

# 5. Start development environment
npm run dev:full
```

## 🔀 Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Pull Request

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill in the PR template
   - Link related issues

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(auth): add OAuth2 login support
fix(catalog): resolve vendor search pagination issue
docs(api): update endpoint documentation
test(payments): add integration tests for Stripe
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=apps/svc-auth

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test edge cases and error conditions

Example:
```typescript
describe('VendorService', () => {
  it('should return vendor by id', async () => {
    const vendor = await vendorService.getById('123');
    expect(vendor).toBeDefined();
    expect(vendor.id).toBe('123');
  });

  it('should throw error for invalid id', async () => {
    await expect(vendorService.getById('invalid'))
      .rejects.toThrow('Vendor not found');
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex logic
- Include usage examples

```typescript
/**
 * Creates a new vendor profile
 * @param {CreateVendorDto} data - Vendor creation data
 * @returns {Promise<Vendor>} Created vendor object
 * @throws {ValidationError} If data is invalid
 * @example
 * const vendor = await createVendor({
 *   name: "Beautiful Venues",
 *   category: "venue"
 * });
 */
async function createVendor(data: CreateVendorDto): Promise<Vendor> {
  // Implementation
}
```

### Documentation Files

When adding features, update:
- README.md (if user-facing)
- API documentation
- Architecture diagrams
- Migration guides

## 🎨 Code Style

### TypeScript/JavaScript

- Use TypeScript for new code
- Follow ESLint configuration
- Use async/await over promises
- Prefer const over let
- Use meaningful variable names

```typescript
// ✅ Good
const activeVendors = await getActiveVendors();

// ❌ Bad
let v = await getActiveVendors();
```

### File Organization

```
service/
├── src/
│   ├── api/          # API endpoints
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   ├── utils/        # Utilities
│   ├── types/        # TypeScript types
│   └── main.ts       # Entry point
├── tests/
│   └── *.test.ts
└── package.json
```

### Naming Conventions

- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Interfaces: `IPascalCase` or `PascalCase`

## 🔍 Code Review Process

### Before Requesting Review

- [ ] Code builds successfully
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-review completed

### Review Checklist

Reviewers will check:
- Code quality and readability
- Test coverage
- Performance implications
- Security concerns
- Documentation completeness

## 🐛 Reporting Bugs

### Before Reporting

1. Search existing issues
2. Try latest version
3. Check documentation

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Ubuntu 22.04]
- Node.js: [e.g. 20.10.0]
- Browser: [e.g. Chrome 120]

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Template

```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Mockups, examples, etc.
```

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Email: security@weddingtech.uz

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📦 Release Process

Releases are managed by maintainers:

1. Version bump following SemVer
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to staging
5. QA testing
6. Deploy to production

## 🏆 Recognition

Contributors are recognized:
- In CHANGELOG.md
- GitHub contributors page
- Annual contributor spotlight

## 📞 Getting Help

- **Questions**: GitHub Discussions
- **Bugs**: GitHub Issues
- **Chat**: Discord/Slack (if available)
- **Email**: dev@weddingtech.uz

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making WeddingTech better! 🎉**

*Last updated: 2025-10-24*
