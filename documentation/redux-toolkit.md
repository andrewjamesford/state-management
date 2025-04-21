# Redux Toolkit Documentation

Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It is intended to be the standard way to write Redux logic, and is strongly recommended by the Redux team.

## What is Redux Toolkit?

Redux Toolkit makes it easier to write good Redux applications and speeds up development by:

- Baking in recommended best practices
- Providing good default behaviors
- Catching common mistakes
- Allowing you to write simpler code

It's beneficial to all Redux users regardless of skill level or experience. It can be added at the start of a new project, or used as part of an incremental migration in an existing project.

## Installation

Redux Toolkit is available as a package on NPM for use with a module bundler or in a Node application:

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit

# PNPM
pnpm add @reduxjs/toolkit
```

## Purpose

The Redux core library is deliberately unopinionated. Redux Toolkit was originally created to help address three common concerns about Redux:

1. "Configuring a Redux store is too complicated"
2. "I have to add a lot of packages to get Redux to do anything useful"
3. "Redux requires too much boilerplate code"

## What's Included

Redux Toolkit includes:

- **`configureStore()`**: Wraps `createStore` to provide simplified configuration options and good defaults. It can automatically combine your slice reducers, adds whatever Redux middleware you supply, includes `redux-thunk` by default, and enables use of the Redux DevTools Extension.

- **`createReducer()`**: Lets you supply a lookup table of action types to case reducer functions, rather than writing switch statements. In addition, it automatically uses the immer library to let you write simpler immutable updates with normal mutative code, like `state.todos[3].completed = true`.

- **`createAction()`**: Generates an action creator function for the given action type string. The function itself has `toString()` defined, so that it can be used in place of the type constant.

- **`createSlice()`**: Accepts an object of reducer functions, a slice name, and an initial state value, and automatically generates a slice reducer with corresponding action creators and action types.

- **`createAsyncThunk`**: Accepts an action type string and a function that returns a promise, and generates a thunk that dispatches pending/fulfilled/rejected action types based on that promise.

- **`createEntityAdapter`**: Generates a set of reusable reducers and selectors to manage normalized data in the store.

- **`createSelector`**: The utility from the Reselect library, re-exported for ease of use.

## RTK Query

RTK Query is provided as an optional addon within the `@reduxjs/toolkit` package. It is purpose-built to solve the use case of data fetching and caching, supplying a compact, but powerful toolset to define an API interface layer for your app.

### What Problems Does RTK Query Solve?

Web applications typically need to:

- Fetch data from a server to display it
- Make updates to that data
- Send updates to the server
- Keep cached data in sync with server data

RTK Query simplifies these common challenges:

- Tracking loading state for UI spinners
- Avoiding duplicate requests for the same data
- Optimistic updates for a faster UI experience
- Managing cache lifetimes with user interaction

### RTK Query APIs

RTK Query is included within the installation of the core Redux Toolkit package. It is available via either of these two entry points:

```javascript
// Standard entry point
import { createApi } from '@reduxjs/toolkit/query'

// React-specific entry point that automatically generates hooks
import { createApi } from '@reduxjs/toolkit/query/react'
```

RTK Query includes these APIs:

- **`createApi()`**: The core of RTK Query's functionality. It allows you to define a set of "endpoints" that describe how to retrieve data from backend APIs and other async sources, including configuration for fetching and transforming data.

- **`fetchBaseQuery()`**: A small wrapper around fetch that simplifies requests. It's the recommended `baseQuery` to use with `createApi` for most users.

- **`<ApiProvider />`**: Can be used as a Provider if you do not already have a Redux store.

- **`setupListeners()`**: A utility used to enable `refetchOnMount` and `refetchOnReconnect` behaviors.

### Bundle Size Considerations

RTK Query adds a fixed one-time amount to your app's bundle size:

- If already using RTK: ~9kb for RTK Query and ~2kb for the hooks.
- If not already using RTK:
  - Without React: 17kb for RTK+dependencies+RTK Query
  - With React: 19kb + React-Redux (peer dependency)

The functionality included in RTK Query quickly pays for the added bundle size, and the elimination of hand-written data fetching logic should be a net improvement in size for most applications.

## Basic Usage Example

```javascript
// Create an API slice
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => '/items'
    }),
    addItem: builder.mutation({
      query: (newItem) => ({
        url: '/items',
        method: 'POST',
        body: newItem
      })
    })
  })
});

// Export hooks for usage in components
export const { useGetItemsQuery, useAddItemMutation } = apiSlice;

// Configure the store
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);
```

## Common Use Cases

### Authentication

RTK Query can handle authentication scenarios by taking a JWT from a login mutation, storing it, and then using `prepareHeaders` to inject authentication headers into every subsequent request.

### Optimistic Updates

RTK Query allows for optimistic updates where updates to the UI happen immediately before the server confirms the change, providing a more responsive user experience.

### Working with GraphQL

RTK Query works well with GraphQL APIs, allowing you to define endpoints that construct GraphQL queries and manage the responses.

## Resources for Learning More

- **Official Documentation**: [https://redux-toolkit.js.org](https://redux-toolkit.js.org)
- **RTK Query Documentation**: [https://redux-toolkit.js.org/rtk-query/overview](https://redux-toolkit.js.org/rtk-query/overview)
- **Redux Essentials Tutorial**: A "top-down" tutorial that teaches how to use Redux the right way with recommended APIs and best practices
- **Redux Fundamentals Tutorial**: For those who want to understand the core principles of Redux