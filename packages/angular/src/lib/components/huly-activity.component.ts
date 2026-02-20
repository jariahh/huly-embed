import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import type { HulyResizeEvent } from '@huly-embed/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-activity',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; }`],
  template: `
    <huly-embed
      component="activity"
      [issueId]="issueId"
      [externalUser]="externalUser"
      [extraParams]="{ readonly: isReadonly }"
      [height]="height"
      (resized)="resized.emit($event)"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyActivityComponent implements OnChanges {
  @Input({ required: true }) issueId!: string;
  @Input('readonly') isReadonly?: boolean;
  @Input() externalUser?: string;
  @Input() height: string = 'auto';

  @Output() readonly resized = new EventEmitter<HulyResizeEvent>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }
}
