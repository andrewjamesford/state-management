# Demo application for State Management in ReactJS

https://github.com/andrewjamesford/state-management

This project is to be used in conjunction with the video tutorial of the same name.

## Project Overview and Purpose

This project demonstrates advanced state management in a ReactJS application. It is designed as an educational resource to showcase best practices for handling state in modern web applications, emphasizing scalability and maintainability.

## Dependencies

- Docker
- Nodejs 22+

## Libraries and Technologies Used

- Docker: Containerize the application for consistent development and deployment environments.
- Node.js (v22+): Server runtime for JavaScript.
- ReactJS: UI library for building interactive user interfaces.
- Redux & Redux Toolkit: Libraries for centralized state management.
- Zustand: Library for managing global state.
- Tanstack Query: Library for managing server state.
- React-Redux: Facilitates integration of Redux with React.
- TailwindCSS: Utility-first CSS framework for rapid UI styling.
- Express (if applicable): Backend framework for Node.js.
- Vite: Build tool and development server for modern web applications.
- Vitest: Testing framework for unit and integration tests.
- Biomejs: Linter and formatter for JavaScript and TypeScript.
- Date-fns: Library for date manipulation and formatting.
- React Helmet: Manages changes to the document head.
- Zustand: Lightweight state management library for React.
- Typescript: Type-safe programming language that builds on JavaScript.
- Tanstack Router: Declarative routing for React.js.
- Zod: TypeScript-first schema declaration and validation library.
- Supertest: TypeScript testing library for Supertest.
- Httpyac: HTTP client for testing and debugging APIs.
- pg: PostgreSQL client for Node.js.

## Getting started

Copy the `env.example` file and rename it to `.env`. In both the `server` and `client` folders, fill in the appropriate values for the environment variables.

In the root folder run the following:

```sh
docker compose up
```

Or alternatively you can run each project individually with:

- `cd server && npm i && npm start`
- `cd client && npm i && npm dev`
- Run db in docker with `cd db  && docker-compose db up`

Recommended to install the npm packages regardless if you are using Docker to get intellisense for TailwindCSS and other libraries etc.


## Educational Comparison of State Management Approaches

This project demonstrates three modern approaches to state management in React applications:

### 1. Redux Toolkit (RTK Query)
**Best for:** Large applications requiring strict state predictability and traceability  
**Key Characteristics:**
- Centralized store with single source of truth
- Immutable state updates via reducers
- Built-in async handling with RTK Query
- Excellent devtools support
- More boilerplate but highly structured

### 2. Zustand
**Best for:** Small to medium applications needing simplicity  
**Key Characteristics:**
- Minimal boilerplate
- Mutable state updates allowed
- No action/reducer separation
- Small bundle size
- Basic devtools support

### 3. TanStack Query (React Query)  
**Best for:** Data-fetching heavy applications  
**Key Characteristics:**
- Focused on server state management
- Automatic caching and deduping
- Background refetching/stale-while-revalidate
- Optimistic updates support
- Pagination/infinite query helpers

### Comparison Table

| Feature               | Redux Toolkit         | Zustand              | TanStack Query       |
|-----------------------|-----------------------|----------------------|----------------------|
| Learning Curve        | Steeper               | Moderate             | Moderate             |
| Bundle Size           | Larger (~5KB)         | Tiny (~1KB)          | Medium (~3KB)        |
| Cache Management      | Via RTK Query         | Manual               | Built-in             |
| DevTools              | Excellent             | Basic                | Good                 |
| Boilerplate           | High                  | Minimal              | Moderate             |
| Best Use Case         | Complex business logic | Component state sharing | Server state management |

## Implementation Patterns

Notice how each approach handles these common scenarios differently:

1. **Data Fetching**
   - Redux: `createApi` endpoints with auto-generated hooks
   - Zustand: Custom async methods in store
   - TanStack: `useQuery`/`useMutation` hooks

2. **State Updates**  
   - Redux: Dispatch actions to reducers
   - Zustand: Direct state mutation via `set`
   - TanStack: Mutation hooks with optimistic updates

3. **Error Handling**
   - Redux: RTK Query error states
   - Zustand: Manual error state tracking
   - TanStack: Built-in error states and retries

## How to Compare the Implementations

1. Browse through each implementation's route:
   - `/reduxrtk`
   - `/zustand` 
   - `/tsquery`

2. Compare these key files in each approach:
   - Store initialization
   - Data fetching logic
   - Form submission handling
   - Error state management

3. Notice how each solution:
   - Structures its code
   - Handles async operations
   - Manages derived state
2. Top‑level structure
    db/
    - Dockerfile + SQL scripts to spin up a Postgres instance, create the `categories` and `listings` tables, and seed them with sample data.
    server/
    - Express app in TypeScript exposing two REST resources:
        – GET /api/categories (with optional `parentId`)
        – GET|POST|PUT /api/listings
    - Uses `pg` for DB access, Zod for request validation, and Vitest + Supertest for unit/integration tests.
        - `npm run dev` (or via Docker) boots on port 5002.
    client/
    - Vite + React + TypeScript + TailwindCSS UI.
    - Central routing via TanStack Router and a shared layout (header, footer, skeleton loader).
    - Three parallel “flavors” of the same feature set under `src/routes/`:

        – **reduxrtk/** — uses Redux Toolkit’s `createApi` (RTK Query) + React‑Redux hooks

        – **tsquery/** — hand‑rolled use of TanStack/React Query’s `useQuery` + mutations

        – **zustand/** — everything in a single Zustand store with custom fetch/update methods

    - Shared UI components (`src/components/`), form (`src/forms/listingForm.tsx`), type definitions, and a thin `src/api.ts` wrapper over `fetch`.
    - Tests with Vitest + React Testing Library for unit/component tests, and Playwright for end‑to‑end scenarios.
    - `npm run dev` (or via Docker) serves on port 4002.
        docker-compose.yml
    - Brings up the three services together: client, server, and Postgres.
        state‑management.code‑workspace
    - VS Code workspace config to open client + server projects side by side.
3. How to run locally
    - Copy/rename `env.example` → `.env` in both `server/` and `client/`, fill in your API URLs or DB creds.
    - From the repo root:
        
        `docker compose up`
    - Or spin up each piece manually:

        `cd db && docker-compose up`

        `cd server && npm install && npm run dev`

        `cd client && npm install && npm run dev`
4. What you’ll see in the UI
    - A simple listings dashboard: list all auctions, view a single auction, add/edit a listing.
    - Three navigation tabs/routes—one for each state‑management approach—so you can compare code and behavior side by side.
5. Tech stack at a glance

    – Frontend: React, TypeScript, Vite, TanStack Router, Redux Toolkit Query, TanStack Query, Zustand, TailwindCSS

    – Backend: Node.js, Express, TypeScript, Zod, pg (PostgreSQL), Supertest, Vitest

    – DB: PostgreSQL (Dockerized), SQL schema + seed scripts

    – Testing: Vitest, React Testing Library, Supertest, Playwright
    
    – Lint/format: BiomeJS
