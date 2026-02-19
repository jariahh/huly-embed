import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HulyKanbanComponent } from '@huly-embed/angular';

@Component({
  selector: 'app-kanban-demo',
  standalone: true,
  imports: [HulyKanbanComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Kanban Board</h2>
      </div>
      <div class="embed-container">
        <huly-kanban
          [project]="project"
          [externalUser]="externalUser"
          (issueSelected)="event.emit('kanban issue-selected: ' + $event.identifier)"
          (resized)="event.emit('kanban: resize ' + $event.height + 'px')"
        >
        </huly-kanban>
      </div>
    </div>
  `,
})
export class KanbanDemoComponent {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();
}
