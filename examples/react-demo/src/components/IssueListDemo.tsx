import { HulyIssueList } from '@huly-embed/react';

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function IssueListDemo({ project, externalUser, onEvent }: Props) {
  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Issue List</h2>
      </div>
      <div className="embed-container">
        <HulyIssueList
          project={project}
          externalUser={externalUser}
          onReady={() => onEvent('issue-list: ready')}
          onIssueSelected={(e) => onEvent(`issue-selected: ${e.identifier}`)}
          onError={(e) => onEvent(`error: ${e.reason}`)}
          loadingContent={<div className="loading-text">Loading issue list...</div>}
          errorContent={<div className="error-text">Failed to load. Check backend is running.</div>}
        />
      </div>
    </div>
  );
}
