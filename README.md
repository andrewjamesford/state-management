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

Recommended to install the NPM packages regardless if you are using Docker to get intellisense for TailwindCSS and other libraries etc.
