import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HulyCommentsComponent } from '@huly-embed/angular';

@Component({
  selector: 'app-comments-demo',
  standalone: true,
  imports: [FormsModule, HulyCommentsComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Comments</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">Issue ID</span>
        <input
          type="text"
          [ngModel]="inputValue()"
          (ngModelChange)="inputValue.set($event)"
          (keydown.enter)="loadIssue()"
          placeholder="SUPPO-1"
        />
        <button class="load-btn" (click)="loadIssue()">Load</button>
      </div>
      <div class="embed-container">
        @if (issueId()) {
          <huly-comments
            [issueId]="issueId()"
            [project]="project"
            [externalUser]="externalUser"
            (resized)="event.emit('comments: resize ' + $event.height + 'px')"
          >
          </huly-comments>
        } @else {
          <div class="empty-state">
            <div class="empty-state-icon">&#x1f4ac;</div>
            Enter an issue ID above and press Enter or click Load.
          </div>
        }
      </div>
    </div>
  `,
})
export class CommentsDemoComponent {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  inputValue = signal('');
  issueId = signal('');

  loadIssue() {
    const value = this.inputValue().trim();
    if (value) {
      this.issueId.set(value);
    }
  }
}
