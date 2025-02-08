/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TsqueryIndexImport } from './routes/tsquery/index'
import { Route as TsqueryListingIdImport } from './routes/tsquery/$listingId'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const TsqueryIndexRoute = TsqueryIndexImport.update({
  id: '/tsquery/',
  path: '/tsquery/',
  getParentRoute: () => rootRoute,
} as any)

const TsqueryListingIdRoute = TsqueryListingIdImport.update({
  id: '/tsquery/$listingId',
  path: '/tsquery/$listingId',
  getParentRoute: () => rootRoute,
} as any)

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
    '/tsquery/$listingId': {
      id: '/tsquery/$listingId'
      path: '/tsquery/$listingId'
      fullPath: '/tsquery/$listingId'
      preLoaderRoute: typeof TsqueryListingIdImport
      parentRoute: typeof rootRoute
    }
    '/tsquery/': {
      id: '/tsquery/'
      path: '/tsquery'
      fullPath: '/tsquery'
      preLoaderRoute: typeof TsqueryIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/tsquery/$listingId': typeof TsqueryListingIdRoute
  '/tsquery': typeof TsqueryIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/tsquery/$listingId': typeof TsqueryListingIdRoute
  '/tsquery': typeof TsqueryIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/tsquery/$listingId': typeof TsqueryListingIdRoute
  '/tsquery/': typeof TsqueryIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/tsquery/$listingId' | '/tsquery'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/tsquery/$listingId' | '/tsquery'
  id: '__root__' | '/' | '/tsquery/$listingId' | '/tsquery/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  TsqueryListingIdRoute: typeof TsqueryListingIdRoute
  TsqueryIndexRoute: typeof TsqueryIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  TsqueryListingIdRoute: TsqueryListingIdRoute,
  TsqueryIndexRoute: TsqueryIndexRoute,
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
        "/tsquery/$listingId",
        "/tsquery/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/tsquery/$listingId": {
      "filePath": "tsquery/$listingId.tsx"
    },
    "/tsquery/": {
      "filePath": "tsquery/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
