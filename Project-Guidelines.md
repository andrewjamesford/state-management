# State Management Project Guidelines

## Build, Lint, Test Commands

### Client
- Build: `cd client && npm run build`
- Dev: `cd client && npm run dev`
- Format: `cd client && npm run format`
- Lint: `cd client && npm run check`
- Test all: `cd client && npm test`
- Test single file: `cd client && npx vitest run src/tests/path/to/test.test.tsx`
- Test components: `cd client && npm run test:components`
- Test with coverage: `cd client && npm run test:coverage`

### Server
- Build: `cd server && npm run build`
- Dev: `cd server && npm run dev`
- Format: `cd server && npm run format`
- Lint: `cd server && npm run check`
- Test: `cd server && npm test`
- Test HTTP endpoints: `cd server && npm run httptest`

## Code Style Guidelines

- **TypeScript**: Use strict mode with proper types for all variables, functions, and components
- **Component Structure**: React functional components with hooks, proper typing for props
- **Formatting**: Tabs (width: 2), max line width: 80, double quotes for strings/JSX
- **Imports**: Group imports by external, internal, types. Use path alias `~/*` for imports from src
- **Error Handling**: Use React Error Boundary for UI errors, proper API error handling with feedback
- **Naming**: PascalCase for components, camelCase for variables/functions, ALL_CAPS for constants
- **State Management**: Multiple approaches used - Redux, Zustand, TanStack Query
- **Testing**: Component tests with React Testing Library, unit tests with Vitest
- Use arrow functions for callbacks.
- Use async/await for asynchronous code.
- Use const for constants and let for variables that will be reassigned.
- Use destructuring for objects and arrays.
- Use template literals for strings that contain variables.
- Use the latest JavaScript features (ES6+) where possible.