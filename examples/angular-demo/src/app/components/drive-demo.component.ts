import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HulyFileBrowserComponent, HulyFileDetailComponent } from '@huly-embed/angular';

type DriveView = 'file-browser' | 'file-detail';

@Component({
  selector: 'app-drive-demo',
  standalone: true,
  imports: [FormsModule, HulyFileBrowserComponent, HulyFileDetailComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Drive</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">View</span>
        <select [ngModel]="view()" (ngModelChange)="view.set($event)">
          <option value="file-browser">File Browser</option>
          <option value="file-detail">File Detail</option>
        </select>
        @if (view() === 'file-browser') {
          <span class="demo-controls-label">Drive</span>
          <input
            type="text"
            [ngModel]="drive()"
            (ngModelChange)="drive.set($event)"
            placeholder="optional"
          />
        }
        @if (view() === 'file-detail') {
          <span class="demo-controls-label">File ID</span>
          <input
            type="text"
            [ngModel]="inputValue()"
            (ngModelChange)="inputValue.set($event)"
            (keydown.enter)="loadFile()"
            placeholder="file-id"
          />
          <button class="load-btn" (click)="loadFile()">Load</button>
        }
      </div>
      <div class="embed-container">
        @switch (view()) {
          @case ('file-browser') {
            <huly-file-browser
              [drive]="drive() || undefined"
              [externalUser]="externalUser"
              (fileSelected)="event.emit('file-selected: ' + $event.fileId)"
            ></huly-file-browser>
          }
          @case ('file-detail') {
            @if (fileId()) {
              <huly-file-detail
                [fileId]="fileId()"
                [externalUser]="externalUser"
              ></huly-file-detail>
            } @else {
              <div class="empty-state">Enter a file ID above and click Load.</div>
            }
          }
        }
      </div>
    </div>
  `,
})
export class DriveDemoComponent {
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  view = signal<DriveView>('file-browser');
  inputValue = signal('');
  fileId = signal('');
  drive = signal('');

  loadFile() {
    const value = this.inputValue().trim();
    if (value) this.fileId.set(value);
  }
}
