import { Injectable, Inject } from '@angular/core';
import {
  type HulyEmbedConfig,
  type HulyEmbedComponent,
  type EmbedTokenResponse,
  fetchEmbedToken,
  buildEmbedUrl,
  createTokenRefresher,
  getParentOrigin,
} from '@huly-embed/core';
import { HULY_EMBED_CONFIG } from '../providers/huly-embed.config';

@Injectable()
export class HulyEmbedService {
  readonly config: HulyEmbedConfig;
  readonly allowedOrigins: string[];

  constructor(@Inject(HULY_EMBED_CONFIG) config: HulyEmbedConfig) {
    this.config = config;
    this.allowedOrigins = config.allowedOrigins ?? [new URL(config.hulyUrl).origin];
  }

  fetchToken(component: HulyEmbedComponent): Promise<EmbedTokenResponse> {
    return fetchEmbedToken(this.config.tokenEndpoint, component);
  }

  buildUrl(
    component: HulyEmbedComponent,
    token: string,
    options?: { project?: string; issue?: string; externalUser?: string }
  ): string {
    return buildEmbedUrl({
      hulyUrl: this.config.hulyUrl,
      component,
      token,
      project: options?.project ?? this.config.defaultProject,
      issue: options?.issue,
      externalUser: options?.externalUser,
      parentOrigin: getParentOrigin(),
    });
  }

  createRefresher(
    component: HulyEmbedComponent,
    initialExpiresIn: number,
    onToken: (response: EmbedTokenResponse) => void,
    onError: (error: Error) => void
  ): () => void {
    return createTokenRefresher(
      this.config.tokenEndpoint,
      component,
      this.config.tokenRefreshBuffer ?? 60,
      initialExpiresIn,
      onToken,
      onError
    );
  }
}
