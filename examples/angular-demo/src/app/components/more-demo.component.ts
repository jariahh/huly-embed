import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HulyMyIssuesComponent,
  HulyMilestonesComponent,
  HulyMilestoneDetailComponent,
  HulyComponentsComponent,
  HulyIssueTemplatesComponent,
  HulyIssuePreviewComponent,
  HulyTimeReportsComponent,
  HulyCreateProjectComponent,
  HulyThreadComponent,
  HulyActivityComponent,
  HulyCalendarComponent,
  HulyBoardComponent,
  HulyDepartmentStaffComponent,
  HulyTodosComponent,
  HulyMyLeadsComponent,
  HulyApplicationsComponent,
} from '@huly-embed/angular';

type MoreView =
  | 'my-issues' | 'board' | 'milestones' | 'milestone-detail'
  | 'components' | 'issue-templates' | 'issue-preview' | 'time-reports'
  | 'create-project' | 'thread' | 'activity' | 'calendar'
  | 'department-staff' | 'todos' | 'my-leads' | 'applications';

interface ViewOption {
  value: MoreView;
  label: string;
}

@Component({
  selector: 'app-more-demo',
  standalone: true,
  imports: [
    FormsModule,
    HulyMyIssuesComponent,
    HulyMilestonesComponent,
    HulyMilestoneDetailComponent,
    HulyComponentsComponent,
    HulyIssueTemplatesComponent,
    HulyIssuePreviewComponent,
    HulyTimeReportsComponent,
    HulyCreateProjectComponent,
    HulyThreadComponent,
    HulyActivityComponent,
    HulyCalendarComponent,
    HulyBoardComponent,
    HulyDepartmentStaffComponent,
    HulyTodosComponent,
    HulyMyLeadsComponent,
    HulyApplicationsComponent,
  ],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>More Components</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">Component</span>
        <select [ngModel]="view()" (ngModelChange)="onViewChange($event)">
          @for (v of views; track v.value) {
            <option [value]="v.value">{{ v.label }}</option>
          }
        </select>
        @if (needsId()) {
          <span class="demo-controls-label">{{ idLabel() }}</span>
          <input
            type="text"
            [ngModel]="inputValue()"
            (ngModelChange)="inputValue.set($event)"
            (keydown.enter)="loadEntity()"
            placeholder="Enter ID"
          />
          <button class="load-btn" (click)="loadEntity()">Load</button>
        }
      </div>
      <div class="embed-container">
        @switch (view()) {
          @case ('my-issues') {
            <huly-my-issues
              [project]="project"
              [externalUser]="externalUser"
              (issueSelected)="event.emit('issue-selected: ' + $event.identifier)"
            ></huly-my-issues>
          }
          @case ('board') {
            <huly-board
              [externalUser]="externalUser"
              (issueSelected)="event.emit('board issue-selected: ' + $event.identifier)"
            ></huly-board>
          }
          @case ('milestones') {
            <huly-milestones [project]="project" [externalUser]="externalUser"></huly-milestones>
          }
          @case ('milestone-detail') {
            @if (entityId()) {
              <huly-milestone-detail [milestoneId]="entityId()" [externalUser]="externalUser"></huly-milestone-detail>
            } @else {
              <div class="empty-state">Enter a milestone ID above and click Load.</div>
            }
          }
          @case ('components') {
            <huly-components [project]="project" [externalUser]="externalUser"></huly-components>
          }
          @case ('issue-templates') {
            <huly-issue-templates [project]="project" [externalUser]="externalUser"></huly-issue-templates>
          }
          @case ('issue-preview') {
            @if (entityId()) {
              <huly-issue-preview [issueId]="entityId()" [externalUser]="externalUser"></huly-issue-preview>
            } @else {
              <div class="empty-state">Enter an issue ID above and click Load.</div>
            }
          }
          @case ('time-reports') {
            @if (entityId()) {
              <huly-time-reports [issueId]="entityId()" [externalUser]="externalUser"></huly-time-reports>
            } @else {
              <div class="empty-state">Enter an issue ID above and click Load.</div>
            }
          }
          @case ('create-project') {
            <huly-create-project [externalUser]="externalUser"></huly-create-project>
          }
          @case ('thread') {
            @if (entityId()) {
              <huly-thread [threadId]="entityId()" [externalUser]="externalUser"></huly-thread>
            } @else {
              <div class="empty-state">Enter a thread ID above and click Load.</div>
            }
          }
          @case ('activity') {
            @if (entityId()) {
              <huly-activity [issueId]="entityId()" [externalUser]="externalUser"></huly-activity>
            } @else {
              <div class="empty-state">Enter an issue ID above and click Load.</div>
            }
          }
          @case ('calendar') {
            <huly-calendar [externalUser]="externalUser"></huly-calendar>
          }
          @case ('department-staff') {
            @if (entityId()) {
              <huly-department-staff [departmentId]="entityId()" [externalUser]="externalUser"></huly-department-staff>
            } @else {
              <div class="empty-state">Enter a department ID above and click Load.</div>
            }
          }
          @case ('todos') {
            <huly-todos [externalUser]="externalUser"></huly-todos>
          }
          @case ('my-leads') {
            <huly-my-leads [externalUser]="externalUser"></huly-my-leads>
          }
          @case ('applications') {
            <huly-applications [externalUser]="externalUser"></huly-applications>
          }
        }
      </div>
    </div>
  `,
})
export class MoreDemoComponent {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  views: ViewOption[] = [
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

  private readonly ID_VIEWS = new Set<MoreView>([
    'milestone-detail', 'issue-preview', 'time-reports', 'thread', 'activity', 'department-staff',
  ]);

  private readonly ID_LABELS: Record<string, string> = {
    'milestone-detail': 'Milestone ID',
    'issue-preview': 'Issue ID',
    'time-reports': 'Issue ID',
    'thread': 'Thread ID',
    'activity': 'Issue ID',
    'department-staff': 'Department ID',
  };

  view = signal<MoreView>('my-issues');
  inputValue = signal('');
  entityId = signal('');
  needsId = signal(false);
  idLabel = signal('');

  onViewChange(value: MoreView) {
    this.view.set(value);
    this.inputValue.set('');
    this.entityId.set('');
    this.needsId.set(this.ID_VIEWS.has(value));
    this.idLabel.set(this.ID_LABELS[value] ?? '');
  }

  loadEntity() {
    const value = this.inputValue().trim();
    if (value) this.entityId.set(value);
  }
}
