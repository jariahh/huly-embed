import { useCallback, useState, type ReactNode } from 'react';
import type {
  HulyEmbedComponent,
  EmbedHideableField,
  HulyEmbedMessage,
  HulyIssueCreatedEvent,
  HulyIssueCancelledEvent,
  HulyIssueSelectedEvent,
  HulyIssueClosedEvent,
  HulyDocumentCreatedEvent,
  HulyDocumentSelectedEvent,
  HulyFileSelectedEvent,
  HulyResizeEvent,
  HulyEmbedError,
} from '@huly-embed/core';
import { EmbedMessageTypes } from '@huly-embed/core';
import { useHulyEmbed } from '../hooks/useHulyEmbed.js';
import { useHulyMessages } from '../hooks/useHulyMessages.js';

export interface HulyEmbedProps {
  component: HulyEmbedComponent;
  project?: string;
  issue?: string;
  externalUser?: string;
  hideFields?: EmbedHideableField[];
  extraParams?: Record<string, string | boolean | undefined>;
  onReady?: () => void;
  onIssueCreated?: (event: HulyIssueCreatedEvent) => void;
  onIssueCancelled?: (event: HulyIssueCancelledEvent) => void;
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
  onIssueClosed?: (event: HulyIssueClosedEvent) => void;
  onDocumentCreated?: (event: HulyDocumentCreatedEvent) => void;
  onDocumentSelected?: (event: HulyDocumentSelectedEvent) => void;
  onFileSelected?: (event: HulyFileSelectedEvent) => void;
  onResize?: (event: HulyResizeEvent) => void;
  onError?: (event: HulyEmbedError) => void;
  height?: string;
  loadingContent?: ReactNode;
  errorContent?: ReactNode;
}

export function HulyEmbed({
  component,
  project,
  issue,
  externalUser,
  hideFields,
  extraParams,
  onReady,
  onIssueCreated,
  onIssueCancelled,
  onIssueSelected,
  onIssueClosed,
  onDocumentCreated,
  onDocumentSelected,
  onFileSelected,
  onResize,
  onError,
  height,
  loadingContent,
  errorContent,
}: HulyEmbedProps) {
  const [autoHeight, setAutoHeight] = useState<string | undefined>();

  const { embedUrl, loading, error, retry } = useHulyEmbed({
    component,
    project,
    issue,
    externalUser,
    hideFields,
    extraParams,
  });

  const handleMessage = useCallback(
    (message: HulyEmbedMessage) => {
      switch (message.type) {
        case EmbedMessageTypes.Ready:
          onReady?.();
          break;
        case EmbedMessageTypes.IssueCreated:
          if ('cancelled' in message && message.cancelled) {
            onIssueCancelled?.(message as HulyIssueCancelledEvent);
          } else {
            onIssueCreated?.(message as HulyIssueCreatedEvent);
          }
          break;
        case EmbedMessageTypes.IssueSelected:
          onIssueSelected?.(message as HulyIssueSelectedEvent);
          break;
        case EmbedMessageTypes.IssueClosed:
          onIssueClosed?.(message as HulyIssueClosedEvent);
          break;
        case EmbedMessageTypes.DocumentCreated:
          onDocumentCreated?.(message as HulyDocumentCreatedEvent);
          break;
        case EmbedMessageTypes.DocumentSelected:
          onDocumentSelected?.(message as HulyDocumentSelectedEvent);
          break;
        case EmbedMessageTypes.FileSelected:
          onFileSelected?.(message as HulyFileSelectedEvent);
          break;
        case EmbedMessageTypes.Resize:
          if (height === 'auto') {
            setAutoHeight((message as HulyResizeEvent).height + 'px');
          }
          onResize?.(message as HulyResizeEvent);
          break;
        case EmbedMessageTypes.Error:
          onError?.(message as HulyEmbedError);
          break;
      }
    },
    [onReady, onIssueCreated, onIssueCancelled, onIssueSelected, onIssueClosed, onDocumentCreated, onDocumentSelected, onFileSelected, onResize, onError, height]
  );

  useHulyMessages(handleMessage);

  if (error) {
    return (
      <div className="huly-embed-error">
        {errorContent ?? (
          <div>
            <p>{error}</p>
            <button onClick={retry}>Retry</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      flex: (height === 'auto' ? (autoHeight ? 'none' : 1) : (height ? 'none' : 1)),
      height: height === 'auto' ? (autoHeight || undefined) : (height || undefined),
      minHeight: 0,
    }}>
      {loading && (
        <div className="huly-embed-loading">
          {loadingContent ?? <div className="huly-embed-spinner" />}
        </div>
      )}
      {embedUrl && (
        <iframe
          src={embedUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            display: loading ? 'none' : 'block',
          }}
          allow="clipboard-write"
        />
      )}
    </div>
  );
}
