/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const SingleLazyImport = createFileRoute('/single')()
const SimpleLazyImport = createFileRoute('/simple')()
const MultiLazyImport = createFileRoute('/multi')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SingleLazyRoute = SingleLazyImport.update({
  id: '/single',
  path: '/single',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/single.lazy').then((d) => d.Route))

const SimpleLazyRoute = SimpleLazyImport.update({
  id: '/simple',
  path: '/simple',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/simple.lazy').then((d) => d.Route))

const MultiLazyRoute = MultiLazyImport.update({
  id: '/multi',
  path: '/multi',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/multi.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/multi': {
      id: '/multi'
      path: '/multi'
      fullPath: '/multi'
      preLoaderRoute: typeof MultiLazyImport
      parentRoute: typeof rootRoute
    }
    '/simple': {
      id: '/simple'
      path: '/simple'
      fullPath: '/simple'
      preLoaderRoute: typeof SimpleLazyImport
      parentRoute: typeof rootRoute
    }
    '/single': {
      id: '/single'
      path: '/single'
      fullPath: '/single'
      preLoaderRoute: typeof SingleLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/multi': typeof MultiLazyRoute
  '/simple': typeof SimpleLazyRoute
  '/single': typeof SingleLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/multi': typeof MultiLazyRoute
  '/simple': typeof SimpleLazyRoute
  '/single': typeof SingleLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/multi': typeof MultiLazyRoute
  '/simple': typeof SimpleLazyRoute
  '/single': typeof SingleLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/multi' | '/simple' | '/single'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/multi' | '/simple' | '/single'
  id: '__root__' | '/' | '/about' | '/multi' | '/simple' | '/single'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AboutLazyRoute: typeof AboutLazyRoute
  MultiLazyRoute: typeof MultiLazyRoute
  SimpleLazyRoute: typeof SimpleLazyRoute
  SingleLazyRoute: typeof SingleLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AboutLazyRoute: AboutLazyRoute,
  MultiLazyRoute: MultiLazyRoute,
  SimpleLazyRoute: SimpleLazyRoute,
  SingleLazyRoute: SingleLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/multi",
        "/simple",
        "/single"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/multi": {
      "filePath": "multi.lazy.tsx"
    },
    "/simple": {
      "filePath": "simple.lazy.tsx"
    },
    "/single": {
      "filePath": "single.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
