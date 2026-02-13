import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-issue-list',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <huly-embed
      component="issue-list"
      [project]="project"
      [externalUser]="externalUser"
      (issueSelected)="issueSelected.emit($event)"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyIssueListComponent {
  @Input() project?: string;
  @Input() externalUser?: string;

  @Output() readonly issueSelected = new EventEmitter<HulyIssueSelectedEvent>();
}
