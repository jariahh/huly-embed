import { HulyKanban } from '@huly-embed/react';

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function KanbanDemo({ project, externalUser, onEvent }: Props) {
  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Kanban Board</h2>
      </div>
      <div className="embed-container">
        <HulyKanban
          project={project}
          externalUser={externalUser}
          onReady={() => onEvent('kanban: ready')}
          onIssueSelected={(e) => onEvent(`kanban issue-selected: ${e.identifier}`)}
          onError={(e) => onEvent(`error: ${e.reason}`)}
          loadingContent={<div className="loading-text">Loading kanban board...</div>}
          errorContent={<div className="error-text">Failed to load. Check backend is running.</div>}
        />
      </div>
    </div>
  );
}
