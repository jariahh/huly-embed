import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-event-log',
  standalone: true,
  template: `
    <div class="event-log">
      <div class="event-log-header">
        <h3>Event Log</h3>
        <button class="clear-btn" (click)="clear.emit()">Clear</button>
      </div>
      <div class="log-entries">
        @if (logs.length === 0) {
          <div class="log-empty">No events yet</div>
        }
        @for (entry of logs; track $index) {
          <div class="log-entry">
            <span class="log-time">{{ entry.time }}</span>
            <span class="log-message">{{ entry.message }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class EventLogComponent {
  @Input() logs: { time: string; message: string }[] = [];
  @Output() clear = new EventEmitter<void>();
}
