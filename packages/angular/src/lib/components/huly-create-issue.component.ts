import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import type { HulyIssueCreatedEvent, HulyIssueCancelledEvent, EmbedHideableField, HulyResizeEvent } from '@huly-embed/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-create-issue',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; }`],
  template: `
    <huly-embed
      component="create-issue"
      [project]="project"
      [externalUser]="externalUser"
      [hideFields]="hideFields"
      [height]="height"
      (issueCreated)="issueCreated.emit($event)"
      (issueCancelled)="issueCancelled.emit($event)"
      (resized)="resized.emit($event)"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyCreateIssueComponent implements OnChanges {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Input() hideFields?: EmbedHideableField[];
  @Input() height: string = 'auto';

  @Output() readonly issueCreated = new EventEmitter<HulyIssueCreatedEvent>();
  @Output() readonly issueCancelled = new EventEmitter<HulyIssueCancelledEvent>();
  @Output() readonly resized = new EventEmitter<HulyResizeEvent>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }
}
