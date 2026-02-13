import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-issue-detail',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <huly-embed
      component="issue-detail"
      [project]="project"
      [issueId]="issueId"
      [externalUser]="externalUser"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyIssueDetailComponent {
  @Input({ required: true }) issueId!: string;
  @Input() project?: string;
  @Input() externalUser?: string;
}
