# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Framework-specific client libraries (Angular + React) that embed Huly components into any application via iframes. This is the **client-side** piece of a two-repo system:

1. **`jariahh/huly`** — Fork of `hcengineering/platform` with an embed plugin (`plugins/embed/`) that serves individual Huly components at `/embed/*` URLs
2. **This repo (`jariahh/huly-embed`)** — Angular and React wrappers that manage iframe lifecycle: token fetching, loading states, postMessage handling, auto-resize, error recovery

## Build & Development Commands

**Status: Build tooling not yet configured.** When package.json files are created, the monorepo will use npm workspaces. Expected commands:

```bash
npm install                    # Install all workspace dependencies
npm run build                  # Build all packages
npm run build -w packages/core # Build core package only
npm run test                   # Run all tests
npm run lint                   # Lint all packages
```

## Architecture

### Three-Package Monorepo (`packages/`)

- **`core/`** (`@jariahh/core`) — Framework-agnostic shared types, postMessage protocol helpers, and token refresh logic. **No Angular or React imports allowed.**
- **`angular/`** (`@jariahh/angular`) — Angular 17+ standalone components (no NgModule), services, and `provideHulyEmbed()` DI setup. Uses signals where appropriate.
- **`react/`** (`@jariahh/react`) — React 18+ functional components, hooks (`useHulyEmbed`, `useHulyMessages`), and `<HulyEmbedProvider>` context.

### How Components Work

Each embed component is a thin wrapper around an iframe pointing at a Svelte component in the Huly fork. The flow:

1. Component mounts → calls `GET {tokenEndpoint}?component={name}` to fetch a short-lived embed token
2. Builds iframe URL: `/embed/{component}?token={token}&project={project}`
3. Listens for `postMessage` events (prefixed `huly-embed-`) from the iframe
4. Auto-refreshes tokens `tokenRefreshBuffer` seconds before expiry

### Adding a New Embed Component

Three files across two repos:

1. **Svelte wrapper** in `jariahh/huly` — `plugins/embed/resources/src/Embed{Name}.svelte`
2. **Angular component** — `packages/angular/src/lib/components/huly-{name}.component.ts`
3. **React component** — `packages/react/src/components/Huly{Name}.tsx`

Plus register the route in `EmbedApp.svelte`'s component switch.

### postMessage Protocol

All messages use the `huly-embed-` prefix. Always validate `event.origin` against `allowedOrigins` before processing.

| Message Type | Direction | Payload |
|---|---|---|
| `huly-embed-ready` | iframe → parent | (none) |
| `huly-embed-issue-created` | iframe → parent | `{ issueId, identifier }` |
| `huly-embed-issue-selected` | iframe → parent | `{ issueId, identifier }` |
| `huly-embed-resize` | iframe → parent | `{ height }` |
| `huly-embed-error` | iframe → parent | `{ reason }` |

### Service Account Proxy

Users never have Huly accounts. A service account (`alchemy-bot`) creates/queries tickets on their behalf. Custom fields stamp real identity: `externalUserId`, `externalUserEmail`, `externalUserName`, `submittedVia`.

## Key Design Constraints

- Keep wrappers thin — all business logic lives in Huly's existing components
- Core package must remain framework-agnostic (no Angular or React imports)
- Angular components must be standalone (no NgModule)
- React components must be functional with hooks
- Always validate postMessage origins
- Never expose embed tokens to end users in a way they could reuse

## Shared Types (`@jariahh/core`)

```typescript
interface HulyEmbedConfig {
  hulyUrl: string;
  defaultProject: string;
  tokenEndpoint: string;
  allowedOrigins?: string[];
  tokenRefreshBuffer?: number;  // default: 60 seconds
}

type HulyEmbedComponent = 'create-issue' | 'issue-list' | 'issue-detail' | 'kanban' | 'comments';
```

## Related Resources

- **Huly fork with embed plugin**: `jariahh/huly` (specifically `plugins/embed/`)
- **Full strategy doc**: `C:\projects\advantage\alchemy\docs\updated-huly.md`
- **Initial analysis**: `C:\projects\advantage\alchemy\docs\huly.md`
- **Upstream Huly**: `https://github.com/hcengineering/platform`
