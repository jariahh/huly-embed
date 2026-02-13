import { InjectionToken } from '@angular/core';
import type { HulyEmbedConfig } from '@huly-embed/core';

export const HULY_EMBED_CONFIG = new InjectionToken<HulyEmbedConfig>('HulyEmbedConfig');
