# Contributing to Copilot Kanban

We welcome contributions! Here's how you can help:

## How to Contribute

1. **Fork the repository**
   - Click the "Fork" button on GitHub

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update the CHANGELOG if needed

4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test
   ```

5. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commit format:
     ```
     feat: add drag-and-drop functionality
     fix: resolve board not updating on task creation
     docs: update installation instructions
     ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide a clear description of your changes

## Development Guidelines

- **Code Style**: Follow the existing TypeScript code style
- **Testing**: Write tests for new features
- **Documentation**: Update README and comments for public APIs
- **Commit Messages**: Use conventional commit format
- **Branch Names**: Use `feature/`, `fix/`, `docs/` prefixes

## Bug Reports

When reporting bugs, please include:
- VS Code version
- Extension version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## Feature Requests

For feature requests:
- Use the GitHub Issues tracker
- Describe the feature and its use case
- Explain why it would be valuable
- Consider if you can contribute the implementation

## Development Setup

If you're new to the project, follow these steps to set up your development environment:

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/VSC-Extension---Copilot-Kanban-Agent.git
   cd copilot-kanban
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Open in VS Code**
   ```bash
   code .
   ```

4. **Run in debug mode**
   - Press `F5` or go to Run → Start Debugging
   - A new VS Code window (Extension Development Host) will open

5. **Make changes**
   - Edit the TypeScript files in the `src/` directory
   - The extension will automatically recompile using `tsc -watch`

## Running Tests

Before submitting a pull request, make sure all tests pass:

```bash
npm run lint
npm run test
```

## Code Review Process

1. After you submit your pull request, maintainers will review your code
2. Address any feedback or requested changes
3. Once approved, your PR will be merged into the main branch

## Coding Standards

- Use TypeScript for type safety
- Follow existing code patterns and naming conventions
- Add comments for complex logic
- Keep functions small and focused
- Write meaningful commit messages

## Questions?

If you have questions about contributing, feel free to open an issue or contact the maintainers.

Thank you for contributing to Copilot Kanban! 🚀
