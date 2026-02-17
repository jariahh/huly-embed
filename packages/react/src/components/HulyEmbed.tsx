import { useState, useCallback, type ReactNode } from 'react';
import type {
  HulyEmbedComponent,
  EmbedHideableField,
  HulyEmbedMessage,
  HulyIssueCreatedEvent,
  HulyIssueCancelledEvent,
  HulyIssueSelectedEvent,
  HulyIssueClosedEvent,
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
  onReady?: () => void;
  onIssueCreated?: (event: HulyIssueCreatedEvent) => void;
  onIssueCancelled?: (event: HulyIssueCancelledEvent) => void;
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
  onIssueClosed?: (event: HulyIssueClosedEvent) => void;
  onResize?: (event: HulyResizeEvent) => void;
  onError?: (event: HulyEmbedError) => void;
  loadingContent?: ReactNode;
  errorContent?: ReactNode;
}

export function HulyEmbed({
  component,
  project,
  issue,
  externalUser,
  hideFields,
  onReady,
  onIssueCreated,
  onIssueCancelled,
  onIssueSelected,
  onIssueClosed,
  onResize,
  onError,
  loadingContent,
  errorContent,
}: HulyEmbedProps) {
  const { embedUrl, loading, error, retry } = useHulyEmbed({
    component,
    project,
    issue,
    externalUser,
    hideFields,
  });

  const [iframeHeight, setIframeHeight] = useState(400);

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
        case EmbedMessageTypes.Resize:
          setIframeHeight((message as HulyResizeEvent).height);
          onResize?.(message as HulyResizeEvent);
          break;
        case EmbedMessageTypes.Error:
          onError?.(message as HulyEmbedError);
          break;
      }
    },
    [onReady, onIssueCreated, onIssueCancelled, onIssueSelected, onIssueClosed, onResize, onError]
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
    <>
      {loading && (
        <div className="huly-embed-loading">
          {loadingContent ?? <div className="huly-embed-spinner" />}
        </div>
      )}
      {embedUrl && (
        <iframe
          src={embedUrl}
          style={{
            width: '100%',
            height: `${iframeHeight}px`,
            border: 'none',
            display: loading ? 'none' : 'block',
          }}
          allow="clipboard-write"
        />
      )}
    </>
  );
}
