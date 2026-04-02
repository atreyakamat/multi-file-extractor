# Contributing to BatchUnpack

Thank you for your interest in contributing to BatchUnpack! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- 7-Zip CLI (for 7z extraction support)
  - **Windows**: Download from [7-zip.org](https://www.7-zip.org/)
  - **macOS**: `brew install p7zip`
  - **Linux**: `apt-get install p7zip-full` or equivalent

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/multi-file-extractor.git
   cd multi-file-extractor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run electron:dev
   ```

## Project Structure

```
multi-file-extractor/
├── electron/              # Electron main process code
│   ├── main.ts           # Main process entry point
│   ├── preload.ts        # Preload script (IPC bridge)
│   └── extractors.ts     # Archive extraction logic
├── src/                  # React frontend code
│   ├── components/       # React components
│   ├── App.tsx          # Main app component
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   └── index.css        # Global styles
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Available Scripts

- `npm run electron:dev` - Run app in development mode
- `npm run build` - Build the complete application
- `npm run build:vite` - Build only the frontend
- `npm run build:win` - Build Windows installer
- `npm run build:mac` - Build macOS installer
- `npm run build:linux` - Build Linux installer
- `npm run typecheck` - Run TypeScript type checking
- `npm run clean` - Clean all build artifacts

## Coding Guidelines

### TypeScript

- Always use TypeScript for new code
- Define proper types and interfaces
- Avoid using `any` type
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop typing with TypeScript

### File Organization

- Place React components in `src/components/`
- Place utility functions in `src/utils.ts`
- Place type definitions in `src/types.ts`
- Keep Electron main process code in `electron/`

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add meaningful comments for complex logic

## Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits format:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`
- `chore: update dependencies`

### Pull Request Process

1. Create a new branch from `main`
2. Make your changes
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

## Adding New Features

### Adding a New Archive Format

1. Add extraction logic to `electron/extractors.ts`
2. Update validation in `electron/main.ts`
3. Add format to supported list in `src/utils.ts`
4. Update documentation

### Adding UI Components

1. Create component file in `src/components/`
2. Define proper prop types
3. Import and use in parent component
4. Add styles to `src/index.css` if needed

## Testing

Currently, the project does not have automated tests. Contributions to add testing infrastructure are welcome!

### Manual Testing

Before submitting a PR, manually test:

1. Drag and drop functionality
2. File validation
3. Output folder selection
4. Extraction of different archive formats
5. Progress tracking
6. Error handling
7. Summary screen

## Architecture Decisions

### Why Electron?

Electron provides native file system access and cross-platform support, making it ideal for a desktop archive extractor.

### Why React?

React provides a component-based architecture that makes the UI maintainable and easy to extend.

### Why Vite?

Vite offers fast development builds and excellent TypeScript support out of the box.

## Extraction Strategy

- Each archive is extracted into its own subfolder
- Internal directory structure is preserved
- Concurrent extraction (max 4 files) for performance
- Failed extractions don't stop the batch

## Performance Considerations

- Limit concurrent extractions to 4 to avoid overwhelming the system
- Use progress callbacks to update UI without blocking
- Keep the main thread responsive

## Security Considerations

- Validate all file paths to prevent directory traversal
- Handle corrupt archives gracefully
- Don't execute extracted files automatically
- Sanitize user input

## Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to BatchUnpack!
