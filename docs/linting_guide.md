# Linting Guide

This guide covers the linting setup and practices for the Promptmack project using pnpm as the package manager.

## Setup

The project uses ESLint for code linting. The configuration is managed through the following files:
- `.eslintrc.json` - Main ESLint configuration
- `eslint.config.mjs` - ESLint module configuration

## Installation

To install the linting dependencies, run:

```bash
pnpm install
```

All necessary linting packages are listed in the `package.json` dependencies.

## Running Linting

To lint your code, use the following commands:

```bash
# Lint all files
pnpm lint

# Lint and fix automatically fixable issues
pnpm lint:fix
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in `tsconfig.json`
- Explicitly declare types for function parameters and return values

### React Components

- Use functional components with hooks
- Include proper prop types using TypeScript interfaces
- Follow the "use client" directive for client components

### Imports

- Use absolute imports with `@/` prefix for internal modules
- Group imports in the following order:
  1. Third-party packages
  2. Local components and utilities
  3. Types and interfaces

### Naming Conventions

- Use PascalCase for component names
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Prefix boolean variables with "is", "has", or "should"

### File Organization

- One component per file
- Place related components in the same directory
- Use index files for cleaner imports

## Common Rules

### ESLint Rules

```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Best Practices

1. **Run Linting Before Commits**
   - Set up pre-commit hooks to run linting
   - Fix all linting errors before committing

2. **Keep Dependencies Updated**
   - Regularly update ESLint and its plugins
   - Review and update rules as needed

3. **Custom Rules**
   - Document any custom ESLint rules
   - Explain the reasoning behind rule modifications

4. **IDE Integration**
   - Configure your IDE to show linting errors
   - Enable auto-fix on save when possible

## Troubleshooting

### Common Issues

1. **ESLint Not Running**
   - Verify that all dependencies are installed
   - Check for conflicting ESLint configurations

2. **Rule Conflicts**
   - Review extended configurations
   - Adjust rule settings in `.eslintrc.json`

3. **Performance Issues**
   - Use `.eslintignore` for large generated files
   - Configure appropriate file patterns

## Contributing

When contributing to the project:

1. Follow the existing code style
2. Run linting before creating pull requests
3. Address all linting errors and warnings
4. Document any necessary rule exceptions

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)