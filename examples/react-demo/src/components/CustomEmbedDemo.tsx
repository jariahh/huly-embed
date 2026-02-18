import { useState, useCallback } from 'react';
import { useHulyEmbed, useHulyMessages } from '@huly-embed/react';
import type { HulyEmbedComponent, HulyEmbedMessage } from '@huly-embed/core';

const COMPONENTS: HulyEmbedComponent[] = [
  'create-issue', 'issue-list', 'issue-detail', 'kanban', 'comments',
];

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function CustomEmbedDemo({ project, externalUser, onEvent }: Props) {
  const [component, setComponent] = useState<HulyEmbedComponent>('create-issue');

  const { embedUrl, loading, error, retry } = useHulyEmbed({
    component,
    project,
    externalUser,
  });

  const handleMessage = useCallback(
    (message: HulyEmbedMessage) => {
      onEvent(`[custom] ${message.type}: ${JSON.stringify(message)}`);
    },
    [onEvent]
  );

  useHulyMessages(handleMessage);

  return (
    <div className="demo-section">
      <h2>Custom Embed (Raw Hooks)</h2>
      <div className="demo-controls">
        <label>
          Component:
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value as HulyEmbedComponent)}
          >
            {COMPONENTS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        {error && (
          <button className="retry-btn" onClick={retry}>
            Retry
          </button>
        )}
      </div>

      <div className="debug-panel">
        <p>
          <span className="label">loading: </span>
          <span className="value">{String(loading)}</span>
        </p>
        <p>
          <span className="label">error: </span>
          <span className="value">{error ?? 'null'}</span>
        </p>
        <p>
          <span className="label">embedUrl: </span>
          <span className="value" style={{ wordBreak: 'break-all' }}>
            {embedUrl ?? 'null'}
          </span>
        </p>
      </div>

      <div className="embed-container">
        {loading && <div className="loading-text">Loading...</div>}
        {error && <div className="error-text">{error}</div>}
        {embedUrl && !error && (
          <iframe
            src={embedUrl}
            style={{
              width: '100%',
              height: '400px',
              border: 'none',
              display: loading ? 'none' : 'block',
            }}
            allow="clipboard-write"
          />
        )}
      </div>
    </div>
  );
}
