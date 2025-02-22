# Demo application for State Management in ReactJS

This project is to be used in conjunction with the video tutorial of the same name.

## Project Overview

This project demonstrates advanced state management in a ReactJS application. It is designed as an educational resource to showcase best practices for handling state in modern web applications, emphasizing scalability and maintainability.

## Dependencies

- Docker
- Nodejs 22+

## Libraries and Technologies Used

- Docker: Containerize the application for consistent development and deployment environments.
- Node.js (v22+): Server runtime for JavaScript.
- ReactJS: UI library for building interactive user interfaces.
- Redux & Redux Toolkit: Libraries for centralized state management.
- React-Redux: Facilitates integration of Redux with React.
- TailwindCSS: Utility-first CSS framework for rapid UI styling.
- Express (if applicable): Backend framework for Node.js.
- Webpack/Babel: Bundling and transpilation tools.
- Additional testing and development tools as required.

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

Recommended to install the NPM packages regardless if you are using Docker to get intellisense for TailwindCSS.