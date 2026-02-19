import { useState } from 'react';
import { HulyComments } from '@huly-embed/react';

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function CommentsDemo({ project, externalUser, onEvent }: Props) {
  const [issueId, setIssueId] = useState('');

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Comments</h2>
      </div>
      <div className="demo-controls">
        <span className="demo-controls-label">Issue ID</span>
        <input
          type="text"
          value={issueId}
          onChange={(e) => setIssueId(e.target.value)}
          placeholder="DEMO-1"
        />
      </div>
      <div className="embed-container">
        {issueId ? (
          <HulyComments
            issueId={issueId}
            project={project}
            externalUser={externalUser}
            onReady={() => onEvent(`comments: ready (${issueId})`)}
            onResize={(e) => onEvent(`comments: resize ${e.height}px`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
            loadingContent={<div className="loading-text">Loading comments...</div>}
            errorContent={<div className="error-text">Failed to load. Check backend is running.</div>}
          />
        ) : (
          <div className="empty-state">Enter an issue ID above to load comments.</div>
        )}
      </div>
    </div>
  );
}
