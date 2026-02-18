import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HulyIssueListComponent } from '@huly-embed/angular';

@Component({
  selector: 'app-issue-list-demo',
  standalone: true,
  imports: [HulyIssueListComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Issue List</h2>
      </div>
      <div class="embed-container">
        <huly-issue-list
          [project]="project"
          [externalUser]="externalUser"
          (issueSelected)="event.emit('issue-selected: ' + $event.identifier)"
        >
        </huly-issue-list>
      </div>
    </div>
  `,
})
export class IssueListDemoComponent {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();
}
