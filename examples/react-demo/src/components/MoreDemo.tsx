import { useState } from 'react';
import {
  HulyMyIssues,
  HulyMilestones,
  HulyMilestoneDetail,
  HulyComponents,
  HulyIssueTemplates,
  HulyIssuePreview,
  HulyTimeReports,
  HulyCreateProject,
  HulyThread,
  HulyActivity,
  HulyCalendar,
  HulyBoard,
  HulyDepartmentStaff,
  HulyTodos,
  HulyMyLeads,
  HulyApplications,
} from '@huly-embed/react';

type MoreView =
  | 'my-issues' | 'board' | 'milestones' | 'milestone-detail'
  | 'components' | 'issue-templates' | 'issue-preview' | 'time-reports'
  | 'create-project' | 'thread' | 'activity' | 'calendar'
  | 'department-staff' | 'todos' | 'my-leads' | 'applications';

const VIEWS: { value: MoreView; label: string }[] = [
  { value: 'my-issues', label: 'My Issues' },
  { value: 'board', label: 'Board' },
  { value: 'milestones', label: 'Milestones' },
  { value: 'milestone-detail', label: 'Milestone Detail' },
  { value: 'components', label: 'Components' },
  { value: 'issue-templates', label: 'Issue Templates' },
  { value: 'issue-preview', label: 'Issue Preview' },
  { value: 'time-reports', label: 'Time Reports' },
  { value: 'create-project', label: 'Create Project' },
  { value: 'thread', label: 'Thread' },
  { value: 'activity', label: 'Activity' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'department-staff', label: 'Department Staff' },
  { value: 'todos', label: 'Todos' },
  { value: 'my-leads', label: 'My Leads' },
  { value: 'applications', label: 'Applications' },
];

interface Props {
  project?: string;
  externalUser?: string;
  onEvent: (message: string) => void;
}

export function MoreDemo({ project, externalUser, onEvent }: Props) {
  const [view, setView] = useState<MoreView>('my-issues');
  const [entityId, setEntityId] = useState('');

  const needsId = ['milestone-detail', 'issue-preview', 'time-reports', 'thread', 'activity', 'department-staff'].includes(view);
  const idLabel: Record<string, string> = {
    'milestone-detail': 'Milestone ID',
    'issue-preview': 'Issue ID',
    'time-reports': 'Issue ID',
    'thread': 'Thread ID',
    'activity': 'Issue ID',
    'department-staff': 'Department ID',
  };

  const loadingEl = <div className="loading-text">Loading {view}...</div>;
  const errorEl = <div className="error-text">Failed to load.</div>;
  const emptyEl = <div className="empty-state">Enter {idLabel[view]} above.</div>;
  const shared = { externalUser, onReady: () => onEvent(`${view}: ready`), onResize: (e: { height: number }) => onEvent(`${view}: resize ${e.height}px`), onError: (e: { reason: string }) => onEvent(`error: ${e.reason}`), loadingContent: loadingEl, errorContent: errorEl };

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>More Components</h2>
      </div>
      <div className="demo-controls">
        <span className="demo-controls-label">Component</span>
        <select value={view} onChange={(e) => { setView(e.target.value as MoreView); setEntityId(''); }}>
          {VIEWS.map((v) => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
        {needsId && (
          <>
            <span className="demo-controls-label">{idLabel[view]}</span>
            <input
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="Enter ID"
            />
          </>
        )}
      </div>
      <div className="embed-container">
        {view === 'my-issues' && <HulyMyIssues project={project} {...shared} onIssueSelected={(e) => onEvent(`issue-selected: ${e.identifier}`)} />}
        {view === 'board' && <HulyBoard {...shared} onIssueSelected={(e) => onEvent(`board issue-selected: ${e.identifier}`)} />}
        {view === 'milestones' && <HulyMilestones project={project} {...shared} />}
        {view === 'milestone-detail' && (entityId ? <HulyMilestoneDetail milestoneId={entityId} {...shared} /> : emptyEl)}
        {view === 'components' && <HulyComponents project={project} {...shared} />}
        {view === 'issue-templates' && <HulyIssueTemplates project={project} {...shared} />}
        {view === 'issue-preview' && (entityId ? <HulyIssuePreview issueId={entityId} {...shared} /> : emptyEl)}
        {view === 'time-reports' && (entityId ? <HulyTimeReports issueId={entityId} {...shared} /> : emptyEl)}
        {view === 'create-project' && <HulyCreateProject {...shared} />}
        {view === 'thread' && (entityId ? <HulyThread threadId={entityId} {...shared} /> : emptyEl)}
        {view === 'activity' && (entityId ? <HulyActivity issueId={entityId} {...shared} /> : emptyEl)}
        {view === 'calendar' && <HulyCalendar {...shared} />}
        {view === 'department-staff' && (entityId ? <HulyDepartmentStaff departmentId={entityId} {...shared} /> : emptyEl)}
        {view === 'todos' && <HulyTodos {...shared} />}
        {view === 'my-leads' && <HulyMyLeads {...shared} />}
        {view === 'applications' && <HulyApplications {...shared} />}
      </div>
    </div>
  );
}
