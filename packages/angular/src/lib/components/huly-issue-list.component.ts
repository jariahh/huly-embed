import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import type { HulyIssueSelectedEvent, HulyResizeEvent } from '@huly-embed/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-issue-list',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; }`],
  template: `
    <huly-embed
      component="issue-list"
      [project]="project"
      [externalUser]="externalUser"
      [height]="height"
      (issueSelected)="issueSelected.emit($event)"
      (resized)="resized.emit($event)"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyIssueListComponent implements OnChanges {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Input() height?: string;

  @Output() readonly issueSelected = new EventEmitter<HulyIssueSelectedEvent>();
  @Output() readonly resized = new EventEmitter<HulyResizeEvent>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }
}
