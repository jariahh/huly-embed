import { useState } from 'react';
import { HulyCreateIssue } from '@huly-embed/react';
import type { EmbedHideableField } from '@huly-embed/core';

const ALL_HIDEABLE_FIELDS: EmbedHideableField[] = [
  'status', 'priority', 'assignee', 'labels', 'component', 'estimation', 'milestone', 'duedate', 'parent',
];

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function CreateIssueDemo({ project, externalUser, onEvent }: Props) {
  const [hiddenFields, setHiddenFields] = useState<Set<EmbedHideableField>>(new Set());

  const allHidden = hiddenFields.size === ALL_HIDEABLE_FIELDS.length;

  const toggleAll = () => {
    setHiddenFields(allHidden ? new Set() : new Set(ALL_HIDEABLE_FIELDS));
  };

  const toggleField = (field: EmbedHideableField) => {
    setHiddenFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const hideFields = allHidden
    ? (['*'] as EmbedHideableField[])
    : hiddenFields.size > 0
      ? Array.from(hiddenFields)
      : undefined;

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Create Issue</h2>
      </div>
      <div className="demo-controls">
        <span className="demo-controls-label">Hide fields</span>
        <label>
          <input type="checkbox" checked={allHidden} onChange={toggleAll} />
          All
        </label>
        <div className="separator" />
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
          errorContent={<div className="error-text">Failed to load. Check backend is running.</div>}
        />
      </div>
    </div>
  );
}
