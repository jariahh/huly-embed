import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HulyDocumentComponent, HulyDocumentListComponent, HulyCreateDocumentComponent } from '@huly-embed/angular';

type DocView = 'document-list' | 'create-document' | 'document';

@Component({
  selector: 'app-documents-demo',
  standalone: true,
  imports: [FormsModule, HulyDocumentComponent, HulyDocumentListComponent, HulyCreateDocumentComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Documents</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">View</span>
        <select [ngModel]="view()" (ngModelChange)="view.set($event)">
          <option value="document-list">Document List</option>
          <option value="create-document">Create Document</option>
          <option value="document">Document Detail</option>
        </select>
        @if (view() === 'document') {
          <span class="demo-controls-label">Document ID</span>
          <input
            type="text"
            [ngModel]="inputValue()"
            (ngModelChange)="inputValue.set($event)"
            (keydown.enter)="loadDoc()"
            placeholder="doc-id"
          />
          <button class="load-btn" (click)="loadDoc()">Load</button>
        }
        @if (view() === 'create-document') {
          <span class="demo-controls-label">Space</span>
          <input
            type="text"
            [ngModel]="space()"
            (ngModelChange)="space.set($event)"
            placeholder="optional"
          />
        }
      </div>
      <div class="embed-container">
        @switch (view()) {
          @case ('document-list') {
            <huly-document-list
              [externalUser]="externalUser"
              (documentSelected)="event.emit('document-selected: ' + $event.documentId)"
            ></huly-document-list>
          }
          @case ('create-document') {
            <huly-create-document
              [space]="space() || undefined"
              [externalUser]="externalUser"
              (documentCreated)="event.emit('document-created: ' + $event.documentId)"
            ></huly-create-document>
          }
          @case ('document') {
            @if (documentId()) {
              <huly-document
                [documentId]="documentId()"
                [externalUser]="externalUser"
              ></huly-document>
            } @else {
              <div class="empty-state">Enter a document ID above and click Load.</div>
            }
          }
        }
      </div>
    </div>
  `,
})
export class DocumentsDemoComponent {
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  view = signal<DocView>('document-list');
  inputValue = signal('');
  documentId = signal('');
  space = signal('');

  loadDoc() {
    const value = this.inputValue().trim();
    if (value) this.documentId.set(value);
  }
}
