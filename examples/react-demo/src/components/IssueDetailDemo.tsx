import { useState } from 'react';
import { HulyIssueDetail } from '@huly-embed/react';

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function IssueDetailDemo({ project, externalUser, onEvent }: Props) {
  const [issueId, setIssueId] = useState('');

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Issue Detail</h2>
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
          <HulyIssueDetail
            issueId={issueId}
            project={project}
            externalUser={externalUser}
            onReady={() => onEvent(`issue-detail: ready (${issueId})`)}
            onError={(e) => onEvent(`error: ${e.reason}`)}
            loadingContent={<div className="loading-text">Loading issue detail...</div>}
            errorContent={<div className="error-text">Failed to load. Check backend is running.</div>}
          />
        ) : (
          <div className="empty-state">Enter an issue ID above to load the detail view.</div>
        )}
      </div>
    </div>
  );
}
