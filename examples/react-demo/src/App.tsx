import { useState, useCallback, useEffect } from 'react';
import { CreateIssueDemo } from './components/CreateIssueDemo';
import { IssueListDemo } from './components/IssueListDemo';
import { IssueDetailDemo } from './components/IssueDetailDemo';
import { KanbanDemo } from './components/KanbanDemo';
import { CommentsDemo } from './components/CommentsDemo';
import { DocumentsDemo } from './components/DocumentsDemo';
import { DriveDemo } from './components/DriveDemo';
import { MoreDemo } from './components/MoreDemo';
import { CustomEmbedDemo } from './components/CustomEmbedDemo';
import { EventLog } from './components/EventLog';

type Tab = 'create-issue' | 'issues' | 'detail' | 'kanban' | 'comments' | 'docs' | 'drive' | 'more' | 'custom';

const STORAGE_KEY = 'huly-demo-state';

function loadPersistedState(): { tab?: Tab; project?: string; externalUser?: string; settingsOpen?: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'create-issue', label: 'Create Issue' },
  { id: 'issues', label: 'Issues' },
  { id: 'detail', label: 'Detail' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'comments', label: 'Comments' },
  { id: 'docs', label: 'Docs' },
  { id: 'drive', label: 'Drive' },
  { id: 'more', label: 'More' },
  { id: 'custom', label: 'Custom' },
];

export interface LogEntry {
  time: string;
  message: string;
}

export function App() {
  const saved = loadPersistedState();
  const [activeTab, setActiveTab] = useState<Tab>(saved.tab ?? 'create-issue');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [project, setProject] = useState(saved.project ?? '');
  const [externalUser, setExternalUser] = useState(saved.externalUser ?? '');
  const [settingsOpen, setSettingsOpen] = useState(saved.settingsOpen ?? false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tab: activeTab, project, externalUser, settingsOpen }));
  }, [activeTab, project, externalUser, settingsOpen]);

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
        <div className="header-brand">
          <div className="header-logo">H</div>
          <h1>Huly Embed <span>React Demo</span></h1>
        </div>
        <button
          className="settings-toggle"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="2.5"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
          </svg>
          Settings
        </button>
      </header>

      <nav className="tabs">
        {TABS.map((tab, i) => (
          <span key={tab.id} style={{ display: 'contents' }}>
            {i === 5 && <div className="tab-separator" />}
            <button
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </span>
        ))}
      </nav>

      <div className="main-content">
        <div className="content-area">
          {settingsOpen && (
            <div className="settings-panel">
              <h3>Configuration</h3>
              <div className="settings-grid">
                <label>
                  Project
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Override defaultProject"
                  />
                </label>
                <label>
                  External User
                  <input
                    type="text"
                    value={externalUser}
                    onChange={(e) => setExternalUser(e.target.value)}
                    placeholder="user@example.com"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="component-area">
            {activeTab === 'create-issue' && <CreateIssueDemo {...sharedProps} />}
            {activeTab === 'issues' && <IssueListDemo {...sharedProps} />}
            {activeTab === 'detail' && <IssueDetailDemo {...sharedProps} />}
            {activeTab === 'kanban' && <KanbanDemo {...sharedProps} />}
            {activeTab === 'comments' && <CommentsDemo {...sharedProps} />}
            {activeTab === 'docs' && <DocumentsDemo externalUser={sharedProps.externalUser} onEvent={addLog} />}
            {activeTab === 'drive' && <DriveDemo externalUser={sharedProps.externalUser} onEvent={addLog} />}
            {activeTab === 'more' && <MoreDemo {...sharedProps} />}
            {activeTab === 'custom' && <CustomEmbedDemo {...sharedProps} />}
          </div>
        </div>

        <EventLog logs={logs} onClear={clearLogs} />
      </div>
    </div>
  );
}
