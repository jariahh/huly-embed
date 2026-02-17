export interface HulyEmbedConfig {
  hulyUrl: string;
  defaultProject: string;
  tokenEndpoint: string;
  allowedOrigins?: string[];
  tokenRefreshBuffer?: number;
}

export type HulyEmbedComponent = 'create-issue' | 'issue-list' | 'issue-detail' | 'kanban' | 'comments';

export type EmbedHideableField = 'status' | 'priority' | 'assignee' | 'estimation' | 'milestone' | 'duedate' | 'parent';

export interface EmbedTokenResponse {
  token: string;
  expiresIn: number;
}

export interface HulyReadyEvent {
  type: 'huly-embed-ready';
}

export interface HulyIssueCreatedEvent {
  type: 'huly-embed-issue-created';
  issueId: string;
  identifier: string;
  cancelled?: never;
}

export interface HulyIssueCancelledEvent {
  type: 'huly-embed-issue-created';
  cancelled: true;
  issueId?: never;
  identifier?: never;
}

export interface HulyIssueSelectedEvent {
  type: 'huly-embed-issue-selected';
  identifier: string;
}

export interface HulyIssueClosedEvent {
  type: 'huly-embed-issue-closed';
  identifier?: string;
}

export interface HulyResizeEvent {
  type: 'huly-embed-resize';
  height: number;
}

export interface HulyEmbedError {
  type: 'huly-embed-error';
  reason: string;
}

export type HulyEmbedMessage =
  | HulyReadyEvent
  | HulyIssueCreatedEvent
  | HulyIssueCancelledEvent
  | HulyIssueSelectedEvent
  | HulyIssueClosedEvent
  | HulyResizeEvent
  | HulyEmbedError;

export interface HulyEmbedState {
  embedUrl: string | null;
  loading: boolean;
  error: string | null;
}
