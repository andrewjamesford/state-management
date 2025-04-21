# Zustand Documentation

Zustand is a small, fast, and scalable state management solution for React applications. Its name comes from the German word for "state". Zustand offers a minimalist API that makes state management simple and intuitive.

## What is Zustand?

Zustand is a lightweight state management library that embraces the concept of a single source of truth. It provides a simplified flux-like state management approach with less boilerplate compared to other state management solutions like Redux.

Key characteristics of Zustand include:

- **Small bundle size**: Minimal impact on your application's size
- **Simplicity**: Less boilerplate with a straightforward API
- **Hooks-based**: Built for the React hooks era
- **Framework agnostic**: Can be used with React, Vue, Angular, or even vanilla JavaScript
- **Immutable updates**: Promotes immutability by default
- **Centralized state**: Stores the entire application state in a centralized store
- **Modularity**: Supports splitting state into slices for better organization

## Installation

```bash
# NPM
npm install zustand

# Yarn
yarn add zustand

# PNPM
pnpm add zustand
```

## Basic Usage

### Creating a Store

```javascript
import { create } from 'zustand'

// Create a store
const useStore = create((set) => ({
  // Initial state
  count: 0,
  
  // Actions to update state
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### Using the Store in Components

```jsx
function Counter() {
  // Use the store in a component
  const { count, increment, decrement, reset } = useStore()
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Selective State Usage

You can subscribe to only the parts of the state that your component needs, which optimizes re-renders:

```jsx
function CountDisplay() {
  // Only subscribe to count changes
  const count = useStore((state) => state.count)
  return <div>The count is: {count}</div>
}
```

## Advanced Features

### Middleware

Zustand provides several middleware options to enhance functionality:

#### Persist Middleware

Store your state in localStorage or other storage solutions:

```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'count-storage', // unique name
      // Optional storage configuration
      storage: localStorage, // Use sessionStorage or custom storage
    }
  )
)
```

#### Immer Middleware

Use Immer for simpler state updates:

```javascript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  immer((set) => ({
    todos: [{ id: 1, title: 'Learn Zustand', done: false }],
    addTodo: (title) =>
      set((state) => {
        // Direct mutation with Immer!
        state.todos.push({ 
          id: Date.now(), 
          title, 
          done: false 
        })
      }),
    toggleTodo: (id) =>
      set((state) => {
        const todo = state.todos.find(todo => todo.id === id)
        if (todo) todo.done = !todo.done
      }),
  }))
)
```

#### DevTools Middleware

Connect to Redux DevTools for better debugging:

```javascript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set(
      (state) => ({ count: state.count + 1 }),
      undefined,
      'increment' // Action name for DevTools
    ),
  }), 
  { name: 'CounterStore' }) // Store name in DevTools
)
```

### Combining Multiple Middleware

You can combine multiple middleware for enhanced functionality:

```javascript
import { create } from 'zustand'
import { devtools, persist, immer } from 'zustand/middleware'

const useStore = create()(
  devtools(
    persist(
      immer((set) => ({
        count: 0,
        increment: () => set((state) => { state.count++ }),
      })),
      { name: 'count-storage' }
    ),
    { name: 'CounterStore' }
  )
)
```

## TypeScript Support

Zustand provides excellent TypeScript support:

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Define your state interface
interface CounterState {
  count: number
  increment: (by?: number) => void
  decrement: (by?: number) => void
  reset: () => void
}

// Create the store with TypeScript
const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: (by = 1) => set(
          (state) => ({ count: state.count + by }),
          undefined,
          'increment'
        ),
        decrement: (by = 1) => set(
          (state) => ({ count: state.count - by }),
          undefined,
          'decrement'
        ),
        reset: () => set({ count: 0 }, undefined, 'reset'),
      }),
      { name: 'counter-storage' }
    )
  )
)
```

## Context Usage

While Zustand doesn't require a context provider, you can use it with React Context for dependency injection:

```jsx
import { createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

// Create a vanilla store (no hooks)
const store = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// Create a context for the store
const StoreContext = createContext()

// Provider component
const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
)

// Consumer component
const Counter = () => {
  // Get store from context
  const store = useContext(StoreContext)
  // Use the store with a selector
  const count = useStore(store, (state) => state.count)
  const increment = useStore(store, (state) => state.increment)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

## Best Practices

### Store Organization

For larger applications, consider organizing your store into slices:

```javascript
// userSlice.js
export const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
})

// todosSlice.js
export const createTodosSlice = (set) => ({
  todos: [],
  addTodo: (todo) => set((state) => ({ 
    todos: [...state.todos, todo] 
  })),
})

// store.js
import { create } from 'zustand'
import { createUserSlice } from './userSlice'
import { createTodosSlice } from './todosSlice'

export const useStore = create((...args) => ({
  ...createUserSlice(...args),
  ...createTodosSlice(...args),
}))
```

### State Updates

- Always update state immutably (or use the immer middleware)
- Use selectors to subscribe only to needed state
- Keep actions in the store, not in components
- Use action names with DevTools for better debugging

## Comparison with Other Solutions

Zustand offers several advantages over other state management libraries:

- **Vs Redux**: Simpler API, less boilerplate, no providers needed
- **Vs Context API**: Better performance for frequent updates, less re-renders
- **Vs MobX**: Smaller bundle size, more explicit state management
- **Vs Recoil**: Simpler setup, no need for provider

## Resources

- **Official Documentation**: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **Zustand GitHub**: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **NPM Package**: [https://www.npmjs.com/package/zustand](https://www.npmjs.com/package/zustand)