import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import type { HulyEmbedConfig } from '@huly-embed/core';
import { HULY_EMBED_CONFIG } from './huly-embed.config';
import { HulyEmbedService } from '../services/huly-embed.service';
import { HulyMessageService } from '../services/huly-message.service';

export function provideHulyEmbed(config: HulyEmbedConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: HULY_EMBED_CONFIG, useValue: config },
    HulyEmbedService,
    HulyMessageService,
  ]);
}
