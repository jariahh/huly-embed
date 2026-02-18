export interface HulyEmbedConfig {
  hulyUrl: string;
  defaultProject: string;
  tokenEndpoint: string;
  allowedOrigins?: string[];
  tokenRefreshBuffer?: number;
}

export type HulyEmbedComponent =
  | 'create-issue'
  | 'issue-list'
  | 'issue-detail'
  | 'kanban'
  | 'comments'
  | 'my-issues'
  | 'milestones'
  | 'milestone-detail'
  | 'components'
  | 'issue-templates'
  | 'issue-preview'
  | 'time-reports'
  | 'create-project'
  | 'document'
  | 'document-list'
  | 'create-document'
  | 'file-browser'
  | 'file-detail'
  | 'thread'
  | 'activity'
  | 'calendar'
  | 'board'
  | 'department-staff'
  | 'todos'
  | 'my-leads'
  | 'applications';

export type EmbedHideableField = 'status' | 'priority' | 'assignee' | 'labels' | 'component' | 'estimation' | 'milestone' | 'duedate' | 'parent' | '*';

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

export interface HulyDocumentCreatedEvent {
  type: 'huly-embed-document-created';
  documentId: string;
}

export interface HulyDocumentSelectedEvent {
  type: 'huly-embed-document-selected';
  documentId: string;
}

export interface HulyFileSelectedEvent {
  type: 'huly-embed-file-selected';
  fileId: string;
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
  | HulyDocumentCreatedEvent
  | HulyDocumentSelectedEvent
  | HulyFileSelectedEvent
  | HulyResizeEvent
  | HulyEmbedError;

export interface HulyEmbedState {
  embedUrl: string | null;
  loading: boolean;
  error: string | null;
}
