import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateIssueDemoComponent } from './components/create-issue-demo.component';
import { IssueListDemoComponent } from './components/issue-list-demo.component';
import { IssueDetailDemoComponent } from './components/issue-detail-demo.component';
import { KanbanDemoComponent } from './components/kanban-demo.component';
import { CommentsDemoComponent } from './components/comments-demo.component';
import { DocumentsDemoComponent } from './components/documents-demo.component';
import { DriveDemoComponent } from './components/drive-demo.component';
import { MoreDemoComponent } from './components/more-demo.component';
import { CustomEmbedDemoComponent } from './components/custom-embed-demo.component';
import { EventLogComponent } from './components/event-log.component';

type Tab = 'create-issue' | 'issues' | 'detail' | 'kanban' | 'comments' | 'docs' | 'drive' | 'more' | 'custom';

interface LogEntry {
  time: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CreateIssueDemoComponent,
    IssueListDemoComponent,
    IssueDetailDemoComponent,
    KanbanDemoComponent,
    CommentsDemoComponent,
    DocumentsDemoComponent,
    DriveDemoComponent,
    MoreDemoComponent,
    CustomEmbedDemoComponent,
    EventLogComponent,
  ],
  template: `
    <div class="app">
      <header class="app-header">
        <div class="header-brand">
          <div class="header-logo">H</div>
          <h1>Huly Embed <span>Angular Demo</span></h1>
        </div>
        <button class="settings-toggle" (click)="settingsOpen.set(!settingsOpen())">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="8" cy="8" r="2.5"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
          </svg>
          Settings
        </button>
      </header>

      <nav class="tabs">
        @for (tab of tabs; track tab.id; let i = $index) {
          @if (i === 5) {
            <div class="tab-separator"></div>
          }
          <button
            class="tab"
            [class.active]="activeTab() === tab.id"
            (click)="activeTab.set(tab.id)"
          >
            {{ tab.label }}
          </button>
        }
      </nav>

      <div class="main-content">
        <div class="content-area">
          @if (settingsOpen()) {
            <div class="settings-panel">
              <h3>Configuration</h3>
              <div class="settings-grid">
                <label>
                  Project
                  <input
                    type="text"
                    [ngModel]="project()"
                    (ngModelChange)="project.set($event)"
                    placeholder="Override defaultProject"
                  />
                </label>
                <label>
                  External User
                  <input
                    type="text"
                    [ngModel]="externalUser()"
                    (ngModelChange)="externalUser.set($event)"
                    placeholder="user@example.com"
                  />
                </label>
              </div>
            </div>
          }

          <div class="component-area">
            @switch (activeTab()) {
              @case ('create-issue') {
                <app-create-issue-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('issues') {
                <app-issue-list-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('detail') {
                <app-issue-detail-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('kanban') {
                <app-kanban-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('comments') {
                <app-comments-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('docs') {
                <app-documents-demo
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('drive') {
                <app-drive-demo
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('more') {
                <app-more-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
              @case ('custom') {
                <app-custom-embed-demo
                  [project]="project() || undefined"
                  [externalUser]="externalUser() || undefined"
                  (event)="addLog($event)"
                />
              }
            }
          </div>
        </div>

        <app-event-log [logs]="logs()" (clear)="clearLogs()" />
      </div>
    </div>
  `,
})
export class AppComponent {
  tabs = [
    { id: 'create-issue' as Tab, label: 'Create Issue' },
    { id: 'issues' as Tab, label: 'Issues' },
    { id: 'detail' as Tab, label: 'Detail' },
    { id: 'kanban' as Tab, label: 'Kanban' },
    { id: 'comments' as Tab, label: 'Comments' },
    { id: 'docs' as Tab, label: 'Docs' },
    { id: 'drive' as Tab, label: 'Drive' },
    { id: 'more' as Tab, label: 'More' },
    { id: 'custom' as Tab, label: 'Custom' },
  ];

  activeTab = signal<Tab>('create-issue');
  settingsOpen = signal(false);
  project = signal('');
  externalUser = signal('');
  logs = signal<LogEntry[]>([]);

  addLog(message: string) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    this.logs.update((prev) => [{ time, message }, ...prev]);
  }

  clearLogs() {
    this.logs.set([]);
  }
}
