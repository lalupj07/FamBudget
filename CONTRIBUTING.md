# Contributing to FamBudget

Thank you for your interest in contributing to FamBudget! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

### Suggesting Features

We love new ideas! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Mockups or examples if applicable

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Create a Pull Request**

## Development Guidelines

### Code Style

**TypeScript:**
- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable names
- Add JSDoc comments for complex functions

**React/React Native:**
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for prop types
- Follow Material Design principles

**Backend:**
- Use NestJS decorators and patterns
- Validate all inputs with DTOs
- Handle errors gracefully
- Add proper logging

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add split rule builder UI
fix: correct envelope calculation logic
docs: update API endpoint documentation
```

### Testing

**Backend:**
```bash
cd backend
npm run test
npm run test:e2e
```

**Mobile:**
```bash
cd mobile
npm test
```

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Changes tested on iOS/Android (for mobile)

## Project Structure

```
FamBudget/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── entities/    # Database models
│   │   ├── modules/     # Feature modules
│   │   └── common/      # Shared utilities
├── mobile/           # React Native app
│   └── src/
│       ├── screens/     # Screen components
│       ├── navigation/  # Navigation config
│       ├── contexts/    # React contexts
│       └── services/    # API services
└── docs/             # Documentation
```

## Getting Help

- Read [SETUP.md](./SETUP.md) for setup instructions
- Check [README.md](./README.md) for feature overview
- Review existing issues and PRs
- Ask questions in discussions

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on what's best for the project

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make FamBudget better! 💰✨

