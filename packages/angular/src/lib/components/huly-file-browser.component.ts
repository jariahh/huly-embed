import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import type { HulyFileSelectedEvent, HulyResizeEvent } from '@huly-embed/core';
import { HulyEmbedComponent } from './huly-embed.component';

@Component({
  selector: 'huly-file-browser',
  standalone: true,
  imports: [HulyEmbedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; }`],
  template: `
    <huly-embed
      component="file-browser"
      [externalUser]="externalUser"
      [extraParams]="{ drive: drive, folder: folder, readonly: isReadonly }"
      (fileSelected)="fileSelected.emit($event)"
      (resized)="resized.emit($event)"
    >
      <ng-content select="[loading]" loading></ng-content>
      <ng-content select="[error]" error></ng-content>
    </huly-embed>
  `,
})
export class HulyFileBrowserComponent implements OnChanges {
  @Input() drive?: string;
  @Input() folder?: string;
  @Input('readonly') isReadonly?: boolean;
  @Input() externalUser?: string;

  @Output() readonly fileSelected = new EventEmitter<HulyFileSelectedEvent>();
  @Output() readonly resized = new EventEmitter<HulyResizeEvent>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }
}
