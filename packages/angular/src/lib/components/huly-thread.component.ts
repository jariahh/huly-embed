import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-thread',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; }`],
  template: `
    <huly-embed
      component="thread"
      [externalUser]="externalUser"
      [extraParams]="{ thread: threadId, readonly: isReadonly }"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyThreadComponent implements OnChanges {
  @Input({ required: true }) threadId!: string;
  @Input('readonly') isReadonly?: boolean;
  @Input() externalUser?: string;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }
}
