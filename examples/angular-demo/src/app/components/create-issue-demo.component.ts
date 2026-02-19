import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { HulyCreateIssueComponent } from '@huly-embed/angular';
import type { EmbedHideableField } from '@huly-embed/core';

const ALL_HIDEABLE_FIELDS: EmbedHideableField[] = [
  'status', 'priority', 'assignee', 'labels', 'component', 'estimation', 'milestone', 'duedate', 'parent',
];

@Component({
  selector: 'app-create-issue-demo',
  standalone: true,
  imports: [HulyCreateIssueComponent],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Create Issue</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">Hide fields</span>
        <label>
          <input
            type="checkbox"
            [checked]="allHidden()"
            (change)="toggleAll()"
          />
          All
        </label>
        <div class="separator"></div>
        @for (field of allFields; track field) {
          <label>
            <input
              type="checkbox"
              [checked]="hiddenSet().has(field)"
              (change)="toggleField(field)"
            />
            {{ field }}
          </label>
        }
      </div>
      <div class="embed-container">
        <huly-create-issue
          [project]="project"
          [externalUser]="externalUser"
          [hideFields]="hideFields()"
          (issueCreated)="event.emit('issue-created: ' + $event.identifier)"
          (issueCancelled)="event.emit('issue-cancelled')"
          (resized)="event.emit('create-issue: resize ' + $event.height + 'px')"
        >
        </huly-create-issue>
      </div>
    </div>
  `,
})
export class CreateIssueDemoComponent {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  allFields = ALL_HIDEABLE_FIELDS;
  hiddenSet = signal<Set<EmbedHideableField>>(new Set());
  allHidden = computed(() => this.hiddenSet().size === ALL_HIDEABLE_FIELDS.length);
  hideFields = computed(() => {
    const s = this.hiddenSet();
    if (s.size === ALL_HIDEABLE_FIELDS.length) return ['*'] as EmbedHideableField[];
    return s.size > 0 ? Array.from(s) : undefined;
  });

  toggleAll() {
    if (this.allHidden()) {
      this.hiddenSet.set(new Set());
    } else {
      this.hiddenSet.set(new Set(ALL_HIDEABLE_FIELDS));
    }
  }

  toggleField(field: EmbedHideableField) {
    this.hiddenSet.update((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  }
}
