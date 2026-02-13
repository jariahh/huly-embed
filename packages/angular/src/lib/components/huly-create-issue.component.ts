import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import type { HulyIssueCreatedEvent, HulyIssueCancelledEvent } from '@huly-embed/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-create-issue',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <huly-embed
      component="create-issue"
      [project]="project"
      [externalUser]="externalUser"
      (issueCreated)="issueCreated.emit($event)"
      (issueCancelled)="issueCancelled.emit($event)"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyCreateIssueComponent {
  @Input() project?: string;
  @Input() externalUser?: string;

  @Output() readonly issueCreated = new EventEmitter<HulyIssueCreatedEvent>();
  @Output() readonly issueCancelled = new EventEmitter<HulyIssueCancelledEvent>();
}
