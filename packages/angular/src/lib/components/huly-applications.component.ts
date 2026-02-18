import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-applications',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; }`],
  template: `
    <huly-embed
      component="applications"
      [externalUser]="externalUser"
      [extraParams]="{ space: space, readonly: isReadonly }"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyApplicationsComponent implements OnChanges {
  @Input() space?: string;
  @Input('readonly') isReadonly?: boolean;
  @Input() externalUser?: string;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }
}
