import { Injectable, Inject, NgZone, OnDestroy } from '@angular/core';
import { Subject, type Observable } from 'rxjs';
import { type HulyEmbedMessage, isHulyMessage, parseHulyMessage } from '@jariahh/core';
import { HulyEmbedService } from './huly-embed.service';

@Injectable()
export class HulyMessageService implements OnDestroy {
  private readonly subject = new Subject<HulyEmbedMessage>();
  private readonly listener: (event: MessageEvent) => void;

  readonly messages$: Observable<HulyEmbedMessage> = this.subject.asObservable();

  constructor(
    private readonly embedService: HulyEmbedService,
    private readonly ngZone: NgZone
  ) {
    this.listener = (event: MessageEvent) => {
      if (!isHulyMessage(event, this.embedService.allowedOrigins)) {
        return;
      }

      const message = parseHulyMessage(event);
      if (message === null) {
        return;
      }

      this.ngZone.run(() => {
        this.subject.next(message);
      });
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('message', this.listener);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.listener);
    this.subject.complete();
  }
}
