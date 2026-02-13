# @huly-embed

Embeddable Huly components for Angular and React. Drop ticket forms, issue lists, and other Huly views into any application with a single tag.

## Packages

| Package | Description | Install |
|---|---|---|
| `@jariahh/core` | Shared types, postMessage protocol, utilities | `npm i @jariahh/core` |
| `@jariahh/angular` | Angular components, services, and provider | `npm i @jariahh/angular` |
| `@jariahh/react` | React components, hooks, and context provider | `npm i @jariahh/react` |

## How It Works

This library is the client-side piece of a two-repo system:

1. **[jariahh/huly](https://github.com/jariahh/huly)** — Fork of [hcengineering/platform](https://github.com/hcengineering/platform) with an embed plugin (`plugins/embed/`) that strips the Huly workbench and serves individual components at `/embed/*` URLs
2. **This repo (`jariahh/huly-embed`)** — Framework-specific wrappers that manage the iframe lifecycle (token fetching, loading states, postMessage handling, auto-resize, error recovery)

```
Your App                          Huly Server (forked)
┌──────────────────────┐          ┌──────────────────┐
│ <huly-create-issue /> │  iframe  │ /embed/          │
│                      │ ──────> │  create-issue     │
│ @jariahh/angular  │          │                  │
│ @jariahh/react    │ <────── │  postMessage      │
│                      │  events  │  (created, etc.)  │
└──────────────────────┘          └──────────────────┘
```

## Quick Start — Angular

**1. Configure once at app startup**

```typescript
// app.config.ts
import { provideHulyEmbed } from '@jariahh/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHulyEmbed({
      hulyUrl: 'https://huly.yourdomain.io',
      defaultProject: 'SUPPORT',
      tokenEndpoint: '/api/huly/embed-token',
    }),
  ]
};
```

**2. Use anywhere — zero config per page**

```html
<huly-create-issue (issueCreated)="onTicketSubmitted($event)" />

<huly-issue-list (issueSelected)="openTicketDetail($event)" />

<huly-issue-detail [issueId]="selectedTicketId" />
```

## Quick Start — React

**1. Configure once at app root**

```tsx
// App.tsx
import { HulyEmbedProvider } from '@jariahh/react';

function App() {
  return (
    <HulyEmbedProvider config={{
      hulyUrl: 'https://huly.yourdomain.io',
      defaultProject: 'SUPPORT',
      tokenEndpoint: '/api/huly/embed-token',
    }}>
      <Router />
    </HulyEmbedProvider>
  );
}
```

**2. Use anywhere — zero config per page**

```tsx
import { HulyCreateIssue, HulyIssueList, HulyIssueDetail } from '@jariahh/react';

<HulyCreateIssue onIssueCreated={(e) => toast(`Created ${e.identifier}`)} />

<HulyIssueList onIssueSelected={(e) => navigate(`/tickets/${e.issueId}`)} />

<HulyIssueDetail issueId={id} />
```

## Available Components

| Component | Angular | React | Purpose |
|---|---|---|---|
| Create Issue | `<huly-create-issue>` | `<HulyCreateIssue>` | Submit a new ticket |
| Issue List | `<huly-issue-list>` | `<HulyIssueList>` | View user's submitted tickets |
| Issue Detail | `<huly-issue-detail>` | `<HulyIssueDetail>` | Single ticket view |
| Kanban | `<huly-kanban>` | `<HulyKanban>` | Visual board view |
| Comments | `<huly-comments>` | `<HulyComments>` | Ticket discussion thread |

All components accept an optional `project` prop to override the default.

## Configuration

| Property | Required | Default | Description |
|---|---|---|---|
| `hulyUrl` | Yes | — | URL of your Huly server with the embed plugin |
| `defaultProject` | Yes | — | Default project identifier (e.g. `'SUPPORT'`) |
| `tokenEndpoint` | Yes | — | Your backend endpoint that generates embed tokens |
| `allowedOrigins` | No | `[hulyUrl]` | Origins accepted for postMessage events |
| `tokenRefreshBuffer` | No | `60` | Seconds before token expiry to auto-refresh |

## Architecture

See [docs/updated-huly.md](https://github.com/jariahh/huly-embed/blob/main/docs/updated-huly.md) in the Alchemy project for the full integration strategy including:
- Service account proxy pattern (users never need Huly accounts)
- Embed token flow
- Component mapping across all three layers
- Implementation phases

## Requirements

- A self-hosted Huly instance running `jariahh/huly` (the fork with the embed plugin)
- A backend proxy that authenticates users and generates embed tokens
- Angular 17+ or React 18+

## License

EPL-2.0 (matching Huly's license)
