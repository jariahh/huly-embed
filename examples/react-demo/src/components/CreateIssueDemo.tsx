import { useState } from 'react';
import { HulyCreateIssue } from '@huly-embed/react';
import type { EmbedHideableField } from '@huly-embed/core';

const ALL_HIDEABLE_FIELDS: EmbedHideableField[] = [
  'status', 'priority', 'assignee', 'estimation', 'milestone', 'duedate', 'parent',
];

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function CreateIssueDemo({ project, externalUser, onEvent }: Props) {
  const [hiddenFields, setHiddenFields] = useState<Set<EmbedHideableField>>(new Set());

  const toggleField = (field: EmbedHideableField) => {
    setHiddenFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const hideFields = hiddenFields.size > 0 ? Array.from(hiddenFields) : undefined;

  return (
    <div className="demo-section">
      <h2>Create Issue</h2>
      <div className="demo-controls">
        <span style={{ color: '#a0a0b0', fontSize: 13 }}>Hide fields:</span>
        {ALL_HIDEABLE_FIELDS.map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              checked={hiddenFields.has(field)}
              onChange={() => toggleField(field)}
            />
            {field}
          </label>
        ))}
      </div>
      <div className="embed-container">
        <HulyCreateIssue
          project={project}
          externalUser={externalUser}
          hideFields={hideFields}
          onReady={() => onEvent('create-issue: ready')}
          onIssueCreated={(e) => onEvent(`issue-created: ${e.identifier}`)}
          onIssueCancelled={() => onEvent('issue-cancelled')}
          onError={(e) => onEvent(`error: ${e.reason}`)}
          loadingContent={<div className="loading-text">Loading create issue form...</div>}
          errorContent={<div className="error-text">Failed to load. Check that the backend is running.</div>}
        />
      </div>
    </div>
  );
}
