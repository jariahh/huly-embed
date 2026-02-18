import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { type Subscription } from 'rxjs';
import type {
  HulyEmbedComponent as EmbedComponentType,
  EmbedHideableField,
  HulyIssueCreatedEvent,
  HulyIssueCancelledEvent,
  HulyIssueSelectedEvent,
  HulyIssueClosedEvent,
  HulyDocumentCreatedEvent,
  HulyDocumentSelectedEvent,
  HulyFileSelectedEvent,
  HulyResizeEvent,
  HulyEmbedError,
  EmbedTokenResponse,
} from '@huly-embed/core';
import { EmbedMessageTypes } from '@huly-embed/core';
import { HulyEmbedService } from '../services/huly-embed.service';
import { HulyMessageService } from '../services/huly-message.service';

@Component({
  selector: 'huly-embed',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }
    iframe {
      flex: 1;
    }
  `],
  template: `
    @if (loading()) {
      <div class="huly-embed-loading">
        <ng-content select="[loading]"></ng-content>
      </div>
    }
    @if (errorMessage()) {
      <div class="huly-embed-error">
        <ng-content select="[error]"></ng-content>
      </div>
    }
    @if (embedUrl()) {
      <iframe
        #embedIframe
        [src]="embedUrl()"
        [style.height]="iframeHeight() ? iframeHeight() + 'px' : '100%'"
        [style.min-height.px]="minHeight"
        [style.display]="loading() ? 'none' : 'block'"
        style="width: 100%; border: none;"
        allow="clipboard-write"
      ></iframe>
    }
  `,
})
export class HulyEmbedComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) component!: EmbedComponentType;
  @Input() project?: string;
  @Input() issueId?: string;
  @Input() externalUser?: string;
  @Input() hideFields?: EmbedHideableField[];
  @Input() extraParams?: Record<string, string | boolean | undefined>;
  @Input() minHeight = 400;

  @Output() readonly ready = new EventEmitter<void>();
  @Output() readonly issueCreated = new EventEmitter<HulyIssueCreatedEvent>();
  @Output() readonly issueCancelled = new EventEmitter<HulyIssueCancelledEvent>();
  @Output() readonly issueSelected = new EventEmitter<HulyIssueSelectedEvent>();
  @Output() readonly issueClosed = new EventEmitter<HulyIssueClosedEvent>();
  @Output() readonly documentCreated = new EventEmitter<HulyDocumentCreatedEvent>();
  @Output() readonly documentSelected = new EventEmitter<HulyDocumentSelectedEvent>();
  @Output() readonly fileSelected = new EventEmitter<HulyFileSelectedEvent>();
  @Output() readonly resized = new EventEmitter<HulyResizeEvent>();
  @Output() readonly embedError = new EventEmitter<HulyEmbedError>();

  @ViewChild('embedIframe') iframeRef?: ElementRef<HTMLIFrameElement>;

  readonly embedUrl = signal<SafeResourceUrl | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly iframeHeight = signal<number | null>(null);

  private subscription?: Subscription;
  private destroyRefresher?: () => void;

  private initialized = false;

  constructor(
    private readonly embedService: HulyEmbedService,
    private readonly messageService: HulyMessageService,
    private readonly sanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.messageService.messages$.subscribe((message) => {
      switch (message.type) {
        case EmbedMessageTypes.Ready:
          this.loading.set(false);
          this.ready.emit();
          break;
        case EmbedMessageTypes.IssueCreated:
          if ('cancelled' in message && message.cancelled) {
            this.issueCancelled.emit(message);
          } else {
            this.issueCreated.emit(message as HulyIssueCreatedEvent);
          }
          break;
        case EmbedMessageTypes.IssueSelected:
          this.issueSelected.emit(message);
          break;
        case EmbedMessageTypes.IssueClosed:
          this.issueClosed.emit(message);
          break;
        case EmbedMessageTypes.DocumentCreated:
          this.documentCreated.emit(message);
          break;
        case EmbedMessageTypes.DocumentSelected:
          this.documentSelected.emit(message);
          break;
        case EmbedMessageTypes.FileSelected:
          this.fileSelected.emit(message);
          break;
        case EmbedMessageTypes.Resize:
          this.iframeHeight.set(message.height);
          this.resized.emit(message);
          break;
        case EmbedMessageTypes.Error:
          this.errorMessage.set(message.reason);
          this.loading.set(false);
          this.embedError.emit(message);
          break;
      }
    });

    this.loadEmbed();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) return;
    const urlInputs = ['project', 'issueId', 'externalUser', 'hideFields', 'extraParams'] as const;
    const hasUrlChange = urlInputs.some((key) => changes[key]);
    if (hasUrlChange) {
      this.loadEmbed();
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.destroyRefresher?.();
  }

  private async loadEmbed(): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      const tokenResponse = await this.embedService.fetchToken(this.component);
      const url = this.embedService.buildUrl(this.component, tokenResponse.token, {
        project: this.project,
        issue: this.issueId,
        externalUser: this.externalUser,
        hideFields: this.hideFields,
        extraParams: this.extraParams,
      });

      this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));

      this.destroyRefresher?.();
      this.destroyRefresher = this.embedService.createRefresher(
        this.component,
        tokenResponse.expiresIn,
        (response: EmbedTokenResponse) => {
          const newUrl = this.embedService.buildUrl(this.component, response.token, {
            project: this.project,
            issue: this.issueId,
            externalUser: this.externalUser,
            hideFields: this.hideFields,
            extraParams: this.extraParams,
          });
          this.loading.set(true);
          this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(newUrl));
        },
        (error: Error) => {
          this.errorMessage.set(error.message);
          this.loading.set(false);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load embed';
      this.errorMessage.set(message);
      this.loading.set(false);
    }
  }
}
