import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { HulyEmbedService, HulyMessageService } from '@huly-embed/angular';
import type { HulyEmbedComponent as EmbedComponentType } from '@huly-embed/core';

const COMPONENTS: EmbedComponentType[] = [
  'create-issue', 'issue-list', 'issue-detail', 'kanban', 'comments',
  'my-issues', 'milestones', 'milestone-detail', 'components', 'issue-templates',
  'issue-preview', 'time-reports', 'create-project', 'document', 'document-list',
  'create-document', 'file-browser', 'file-detail', 'thread', 'activity',
  'calendar', 'board', 'department-staff', 'todos', 'my-leads', 'applications',
];

@Component({
  selector: 'app-custom-embed-demo',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="demo-section">
      <div class="demo-section-header">
        <h2>Custom Embed</h2>
      </div>
      <div class="demo-controls">
        <span class="demo-controls-label">Component</span>
        <select [ngModel]="selectedComponent()" (ngModelChange)="onComponentChange($event)">
          @for (c of components; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
        @if (errorMessage()) {
          <button class="retry-btn" (click)="loadEmbed()">Retry</button>
        }
      </div>

      <div class="debug-panel">
        <p><span class="label">loading:</span> <span class="value">{{ loading() }}</span></p>
        <p><span class="label">error:</span> <span class="value">{{ errorMessage() ?? 'null' }}</span></p>
        <p><span class="label">url:</span> <span class="value" style="word-break: break-all">{{ rawUrl() ?? 'null' }}</span></p>
      </div>

      <div class="embed-container">
        @if (loading()) {
          <div class="loading-text">Loading embed...</div>
        }
        @if (errorMessage(); as err) {
          <div class="error-text">{{ err }}</div>
        }
        @if (safeUrl() && !errorMessage()) {
          <iframe
            [src]="safeUrl()"
            [style.display]="loading() ? 'none' : 'block'"
            style="width: 100%; height: 400px; border: none;"
            allow="clipboard-write"
          ></iframe>
        }
      </div>
    </div>
  `,
})
export class CustomEmbedDemoComponent implements OnInit, OnDestroy {
  @Input() project?: string;
  @Input() externalUser?: string;
  @Output() event = new EventEmitter<string>();

  private embedService = inject(HulyEmbedService);
  private messageService = inject(HulyMessageService);
  private sanitizer = inject(DomSanitizer);
  private subscription?: Subscription;
  private stopRefresh?: () => void;

  components = COMPONENTS;
  selectedComponent = signal<EmbedComponentType>('create-issue');
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  rawUrl = signal<string | null>(null);
  safeUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    this.subscription = this.messageService.messages$.subscribe((msg) => {
      this.event.emit(`[custom] ${msg.type}: ${JSON.stringify(msg)}`);
    });
    this.loadEmbed();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.stopRefresh?.();
  }

  onComponentChange(value: EmbedComponentType) {
    this.selectedComponent.set(value);
    this.loadEmbed();
  }

  async loadEmbed() {
    this.stopRefresh?.();
    this.loading.set(true);
    this.errorMessage.set(null);
    this.rawUrl.set(null);
    this.safeUrl.set(null);

    try {
      const component = this.selectedComponent();
      const tokenResponse = await this.embedService.fetchToken(component);
      const url = this.embedService.buildUrl(component, tokenResponse.token, {
        project: this.project,
        externalUser: this.externalUser,
      });
      this.rawUrl.set(url);
      this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      this.loading.set(false);

      this.stopRefresh = this.embedService.createRefresher(
        component,
        tokenResponse.expiresIn,
        (newToken) => {
          const newUrl = this.embedService.buildUrl(component, newToken.token, {
            project: this.project,
            externalUser: this.externalUser,
          });
          this.rawUrl.set(newUrl);
          this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(newUrl));
        },
        (err: Error) => {
          this.errorMessage.set(err.message);
        }
      );
    } catch (err) {
      this.loading.set(false);
      this.errorMessage.set(err instanceof Error ? err.message : String(err));
    }
  }
}
