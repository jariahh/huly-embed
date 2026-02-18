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
      <h2>Comments</h2>
      <div className="demo-controls">
        <label>
          Issue ID:
          <input
            type="text"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            placeholder="DEMO-1"
          />
        </label>
      </div>
      <div className="embed-container">
        {issueId ? (
          <HulyComments
            issueId={issueId}
            project={project}
            externalUser={externalUser}
            onReady={() => onEvent(`comments: ready (${issueId})`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
            loadingContent={<div className="loading-text">Loading comments...</div>}
            errorContent={<div className="error-text">Failed to load. Check that the backend is running.</div>}
          />
        ) : (
          <div className="loading-text">Enter an issue ID above to load comments.</div>
        )}
      </div>
    </div>
  );
}
