# TanStack Query Documentation

TanStack Query (formerly known as React Query) is often described as the missing data-fetching library for web applications. In more technical terms, it makes fetching, caching, synchronizing, and updating server state in your web applications a breeze.

## What is TanStack Query?

TanStack Query is a powerful library for data-fetching and state management in JavaScript and TypeScript applications. It's framework-agnostic, with official adapters for React, Vue, Solid, Svelte, and Angular.

TanStack Query helps you to:

- Remove many lines of complicated and misunderstood code from your application
- Make your application more maintainable
- Build features faster without worrying about wiring up data fetching
- Make your application more responsive with background updates and caching
- Save on bandwidth and increase memory performance

## Installation

TanStack Query is available as a package on NPM:

```bash
# NPM
npm install @tanstack/react-query

# Yarn
yarn add @tanstack/react-query

# PNPM
pnpm add @tanstack/react-query
```

For development tools:

```bash
npm install @tanstack/react-query-devtools
```

## Motivation

Most core web frameworks don't come with an opinionated way of fetching or updating data in a holistic way. While traditional state management libraries are great for client state, they're not ideal for async or server state.

Server state is unique because it:

- Is persisted remotely in a location you may not control or own
- Requires asynchronous APIs for fetching and updating
- Implies shared ownership and can be changed by other people
- Can potentially become "out of date" in your applications

TanStack Query addresses common server state challenges:

- Caching
- Deduping multiple requests for the same data
- Updating "out of date" data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

## Core Concepts

TanStack Query has three main concepts:

1. **Queries** - For fetching data
2. **Mutations** - For creating, updating, or deleting data
3. **Query Invalidation** - For automatically refreshing data

### Setting Up the Query Client

The Query Client is the central hub for managing all queries and mutations:

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Queries

A query is an asynchronous data source bound to a unique key:

```javascript
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { isPending, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isPending) return 'Loading...';
  if (error) return `An error has occurred: ${error.message}`;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

A query can be in one of the following states:

- `isPending` or `status === 'pending'` - The query is currently loading
- `isError` or `status === 'error'` - The query encountered an error
- `isSuccess` or `status === 'success'` - The query was successful
- `isFetching` - The query is currently fetching data (can be combined with other states)

### Mutations

Mutations are used to create, update, or delete data:

```javascript
import { useMutation } from '@tanstack/react-query';

function AddTodo() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo);
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? <div>Todo added!</div> : null}
          <button
            onClick={() => {
              mutation.mutate({ title: 'Do Laundry' });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

A mutation can be in one of the following states:

- `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
- `isPending` or `status === 'pending'` - The mutation is currently running
- `isError` or `status === 'error'` - The mutation encountered an error
- `isSuccess` or `status === 'success'` - The mutation was successful

### Query Invalidation

Query invalidation allows you to automatically refetch data when it becomes stale:

```javascript
// Invalidate every query in the cache
queryClient.invalidateQueries();

// Invalidate every query with a key that starts with 'todos'
queryClient.invalidateQueries({ queryKey: ['todos'] });
```

## Advanced Features

### Prefetching

Prefetch data before it's needed:

```javascript
const prefetchTodos = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
};
```

### Pagination

Handle paginated data:

```javascript
function Todos({ page }) {
  const { data, error, isPending } = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(page),
  });
  
  // ...
}
```

### Infinite Queries

Load more data on demand:

```javascript
function Todos() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: ({ pageParam = 0 }) => fetchTodoPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  
  // ...
}
```

### Dependent Queries

Execute queries that depend on each other:

```javascript
function UserProjects() {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => fetchProjects(user.id),
    // The query won't execute until the user is available
    enabled: !!user,
  });

  // ...
}
```

### Mutation Side Effects

Handle side effects during the mutation lifecycle:

```javascript
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: (variables) => {
    // A mutation is about to happen!
    // Optionally return a context
    return { id: variables.id };
  },
  onError: (error, variables, context) => {
    // An error happened!
    console.log(`Rolling back optimistic update with id: ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, context) => {
    // Error or success... doesn't matter!
  },
});
```

## Optimistic Updates

Provide instant feedback to users before server confirmation:

```javascript
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos', newTodo.id] });

    // Snapshot the previous value
    const previousTodo = queryClient.getQueryData(['todos', newTodo.id]);

    // Optimistically update to the new value
    queryClient.setQueryData(['todos', newTodo.id], newTodo);

    // Return a context object with the snapshot
    return { previousTodo };
  },
  // If the mutation fails, restore previous value
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(
      ['todos', newTodo.id],
      context.previousTodo
    );
  },
  // Always refetch after error or success
  onSettled: (newTodo) => {
    queryClient.invalidateQueries({ queryKey: ['todos', newTodo.id] });
  },
});
```

## Resources for Learning More

- **Official Documentation**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **GitHub Repository**: [https://github.com/tanstack/query](https://github.com/tanstack/query)
- **TanStack Discord Community**: [https://discord.com/invite/WrRKjPJ](https://discord.com/invite/WrRKjPJ)