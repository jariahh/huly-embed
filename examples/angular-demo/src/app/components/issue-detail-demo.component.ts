import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HulyIssueDetailComponent } from '@huly-embed/angular';

@Component({
  selector: 'app-issue-detail-demo',
  standalone: true,
  imports: [FormsModule, HulyIssueDetailComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Issue Detail</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">Issue ID</span>
        <input
          type="text"
          [ngModel]="inputValue()"
          (ngModelChange)="inputValue.set($event)"
          (keydown.enter)="loadIssue()"
          placeholder="SUPPO-1"
        />
        <button class="load-btn" (click)="loadIssue()">Load</button>
      </div>
      <div class="embed-container">
        @if (issueId()) {
          <huly-issue-detail
            [issueId]="issueId()"
            [project]="project"
            [externalUser]="externalUser"
          >
          </huly-issue-detail>
        } @else {
          <div class="empty-state">
            <div class="empty-state-icon">&#x1f50d;</div>
            Enter an issue ID above and press Enter or click Load.
          </div>
        }
      </div>
    </div>
  `,
})
export class IssueDetailDemoComponent {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  inputValue = signal('');
  issueId = signal('');

  loadIssue() {
    const value = this.inputValue().trim();
    if (value) {
      this.issueId.set(value);
    }
  }
}
