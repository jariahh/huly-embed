import type { HulyEmbedMessage } from './types.js';

export const EmbedMessageTypes = {
  Ready: 'huly-embed-ready',
  IssueCreated: 'huly-embed-issue-created',
  IssueSelected: 'huly-embed-issue-selected',
  IssueClosed: 'huly-embed-issue-closed',
  DocumentCreated: 'huly-embed-document-created',
  DocumentSelected: 'huly-embed-document-selected',
  FileSelected: 'huly-embed-file-selected',
  Resize: 'huly-embed-resize',
  Error: 'huly-embed-error',
} as const;

const HULY_PREFIX = 'huly-embed-';

const VALID_TYPES = new Set<string>(Object.values(EmbedMessageTypes));

export function isHulyMessage(event: MessageEvent, allowedOrigins: string[]): boolean {
  if (!allowedOrigins.includes(event.origin)) {
    return false;
  }

  const data = event.data;
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  if (typeof data.type !== 'string' || !data.type.startsWith(HULY_PREFIX)) {
    return false;
  }

  return VALID_TYPES.has(data.type);
}

export function parseHulyMessage(event: MessageEvent): HulyEmbedMessage | null {
  const data = event.data;

  if (typeof data !== 'object' || data === null || typeof data.type !== 'string') {
    return null;
  }

  switch (data.type) {
    case EmbedMessageTypes.Ready:
      return { type: data.type };

    case EmbedMessageTypes.IssueCreated:
      if (data.cancelled === true) {
        return { type: data.type, cancelled: true };
      }
      if (typeof data.issueId === 'string' && typeof data.identifier === 'string') {
        return { type: data.type, issueId: data.issueId, identifier: data.identifier };
      }
      return null;

    case EmbedMessageTypes.IssueSelected:
      if (typeof data.identifier === 'string') {
        return { type: data.type, identifier: data.identifier };
      }
      return null;

    case EmbedMessageTypes.IssueClosed:
      return {
        type: data.type,
        ...(typeof data.identifier === 'string' ? { identifier: data.identifier } : {}),
      };

    case EmbedMessageTypes.DocumentCreated:
      if (typeof data.documentId === 'string') {
        return { type: data.type, documentId: data.documentId };
      }
      return null;

    case EmbedMessageTypes.DocumentSelected:
      if (typeof data.documentId === 'string') {
        return { type: data.type, documentId: data.documentId };
      }
      return null;

    case EmbedMessageTypes.FileSelected:
      if (typeof data.fileId === 'string') {
        return { type: data.type, fileId: data.fileId };
      }
      return null;

    case EmbedMessageTypes.Resize:
      if (typeof data.height === 'number') {
        return { type: data.type, height: data.height };
      }
      return null;

    case EmbedMessageTypes.Error:
      if (typeof data.reason === 'string') {
        return { type: data.type, reason: data.reason };
      }
      return null;

    default:
      return null;
  }
}
