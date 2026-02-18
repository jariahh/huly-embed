import { useState, useCallback } from 'react';
import { CreateIssueDemo } from './components/CreateIssueDemo';
import { IssueListDemo } from './components/IssueListDemo';
import { IssueDetailDemo } from './components/IssueDetailDemo';
import { KanbanDemo } from './components/KanbanDemo';
import { CommentsDemo } from './components/CommentsDemo';
import { CustomEmbedDemo } from './components/CustomEmbedDemo';
import { EventLog } from './components/EventLog';

type Tab = 'create-issue' | 'issues' | 'detail' | 'kanban' | 'comments' | 'custom';

const TABS: { id: Tab; label: string }[] = [
  { id: 'create-issue', label: 'Create Issue' },
  { id: 'issues', label: 'Issues' },
  { id: 'detail', label: 'Detail' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'comments', label: 'Comments' },
  { id: 'custom', label: 'Custom' },
];

export interface LogEntry {
  time: string;
  message: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create-issue');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [project, setProject] = useState('');
  const [externalUser, setExternalUser] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const addLog = useCallback((message: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [{ time, message }, ...prev]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const sharedProps = {
    project: project || undefined,
    externalUser: externalUser || undefined,
    onEvent: addLog,
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Huly Embed Demo (React)</h1>
        <button
          className="settings-toggle"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          Settings {settingsOpen ? '▲' : '▼'}
        </button>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="main-content">
        <div className="content-area">
          {settingsOpen && (
            <div className="settings-panel">
              <h3>Settings</h3>
              <label>
                Project:
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Override defaultProject"
                />
              </label>
              <label>
                External User:
                <input
                  type="text"
                  value={externalUser}
                  onChange={(e) => setExternalUser(e.target.value)}
                  placeholder="e.g. user@example.com"
                />
              </label>
            </div>
          )}

          <div className="component-area">
            {activeTab === 'create-issue' && <CreateIssueDemo {...sharedProps} />}
            {activeTab === 'issues' && <IssueListDemo {...sharedProps} />}
            {activeTab === 'detail' && <IssueDetailDemo {...sharedProps} />}
            {activeTab === 'kanban' && <KanbanDemo {...sharedProps} />}
            {activeTab === 'comments' && <CommentsDemo {...sharedProps} />}
            {activeTab === 'custom' && <CustomEmbedDemo {...sharedProps} />}
          </div>
        </div>

        <EventLog logs={logs} onClear={clearLogs} />
      </div>
    </div>
  );
}
