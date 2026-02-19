# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Framework-specific client libraries (Angular + React) that embed Huly components into any application via iframes. This is the **client-side** piece of a two-repo system:

1. **`jariahh/huly`** — Fork of `hcengineering/platform` with an embed plugin (`plugins/embed/`) that serves individual Huly components at `/embed/*` URLs. The embed plugin has two layout modes: **fill mode** (kanban, issue-list, board, etc. — `height: 100vh; overflow: hidden`) and **flow mode** (create-issue, detail, comments — natural content height with resize events).
2. **This repo (`jariahh/huly-embed`)** — Angular and React wrappers that manage iframe lifecycle: token fetching, loading states, postMessage handling, resize/auto-height, error recovery.

## Build & Development Commands

```bash
npm install                    # Install all workspace dependencies
npm run build                  # Build all packages (core → angular → react, sequential)
npm run build -w packages/core # Build core package only
npm test                       # Run all tests
```

### Demo Apps

```bash
npm run dev -w react-demo      # Vite dev server at localhost:5173
npm run dev -w angular-demo    # ng serve at localhost:4201
node examples/api-server/server.js  # Token endpoint at localhost:3000
```

**Important**: After rebuilding the Angular library (`npm run build -w @huly-embed/angular`), the Angular demo dev server must be restarted — it does not hot-reload library changes.

## Architecture

### Three-Package Monorepo (`packages/`)

- **`core/`** (`@huly-embed/core`) — Framework-agnostic shared types, postMessage protocol helpers, URL builder, and token refresh logic. ESM output via `tsc`. **No Angular or React imports allowed.**
- **`angular/`** (`@huly-embed/angular`) — Angular 17+ standalone components (no NgModule), services, and `provideHulyEmbed()` DI setup. Built via `ng-packagr`. Uses signals + OnPush.
- **`react/`** (`@huly-embed/react`) — React 18+ functional components, hooks (`useHulyEmbed`, `useHulyMessages`), and `<HulyEmbedProvider>` context. Built via `tsc` with `jsx: react-jsx`.

### Iframe Sizing Modes

The base `<huly-embed>` / `<HulyEmbed>` component supports three sizing modes via the `height` prop:

| Mode | Prop | Behavior |
|---|---|---|
| **Fill** (default) | no `height` | `flex: 1` — iframe fills available parent space. Use for fill-mode embeds (kanban, issue-list, board). |
| **Auto** | `height="auto"` | Auto-sizes container to content height from `huly-embed-resize` events. Use for flow-mode embeds (create-issue, detail, comments). |
| **Constrained** | `height="500px"` | Fixed height, iframe scrolls internally if content overflows. |

The iframe uses absolute positioning inside a `position: relative` container. This decouples the iframe from the flex sizing chain (iframes as replaced elements resist flex constraints).

### How Components Work

Each embed component is a thin wrapper around an iframe pointing at a Svelte component in the Huly fork. The flow:

1. Component mounts → calls `GET {tokenEndpoint}?component={name}` to fetch a short-lived embed token
2. Builds iframe URL: `/embed/{component}?token={token}&project={project}&extraParams...`
3. Listens for `postMessage` events (prefixed `huly-embed-`) from the iframe
4. Auto-refreshes tokens `tokenRefreshBuffer` seconds before expiry
5. Forwards resize events; in auto mode, updates container height to match

### 26 Embed Components

All thin wrappers delegate to the base `<huly-embed>` component, passing component-specific params via `extraParams`.

**Tracker**: `create-issue`, `issue-list`, `issue-detail`, `issue-preview`, `kanban`, `my-issues`, `milestones`, `milestone-detail`, `components`, `issue-templates`, `time-reports`, `create-project`, `board`

**Documents**: `document`, `document-list`, `create-document`

**Drive**: `file-browser`, `file-detail`

**Other**: `comments`, `thread`, `activity`, `calendar`, `department-staff`, `todos`, `my-leads`, `applications`

### Adding a New Embed Component

Three files across two repos:

1. **Svelte wrapper** in `jariahh/huly` — `plugins/embed/resources/src/Embed{Name}.svelte`
2. **Angular component** — `packages/angular/src/lib/components/huly-{name}.component.ts`
3. **React component** — `packages/react/src/components/Huly{Name}.tsx`

Plus register the route in `EmbedApp.svelte`'s component switch and add it to the `FILL_VIEWPORT` set if it should use fill mode.

### postMessage Protocol

All messages use the `huly-embed-` prefix. Always validate `event.origin` against `allowedOrigins` before processing.

| Message Type | Direction | Payload |
|---|---|---|
| `huly-embed-ready` | iframe → parent | (none) |
| `huly-embed-issue-created` | iframe → parent | `{ issueId, identifier }` or `{ cancelled: true }` |
| `huly-embed-issue-selected` | iframe → parent | `{ issueId, identifier }` |
| `huly-embed-issue-closed` | iframe → parent | `{ issueId }` |
| `huly-embed-document-created` | iframe → parent | `{ documentId }` |
| `huly-embed-document-selected` | iframe → parent | `{ documentId }` |
| `huly-embed-file-selected` | iframe → parent | `{ fileId }` |
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
- Angular 17.3 requires TypeScript `>=5.2.0 and <5.5.0` — use `~5.4.0`
- Don't import a type with the same name as the class being defined in Angular (use aliased imports)

## Shared Types (`@huly-embed/core`)

```typescript
interface HulyEmbedConfig {
  hulyUrl: string;
  defaultProject: string;
  tokenEndpoint: string;
  allowedOrigins?: string[];
  tokenRefreshBuffer?: number;  // default: 60 seconds
}

type HulyEmbedComponent =
  | 'create-issue' | 'issue-list' | 'issue-detail' | 'issue-preview' | 'kanban'
  | 'my-issues' | 'milestones' | 'milestone-detail' | 'components'
  | 'issue-templates' | 'time-reports' | 'create-project' | 'board'
  | 'comments' | 'document' | 'document-list' | 'create-document'
  | 'file-browser' | 'file-detail' | 'thread' | 'activity'
  | 'calendar' | 'department-staff' | 'todos' | 'my-leads' | 'applications';
```

## Related Resources

- **Huly fork with embed plugin**: `jariahh/huly` (specifically `plugins/embed/`)
- **Full strategy doc**: `C:\projects\advantage\alchemy\docs\updated-huly.md`
- **Initial analysis**: `C:\projects\advantage\alchemy\docs\huly.md`
- **Upstream Huly**: `https://github.com/hcengineering/platform`
