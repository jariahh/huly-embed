import type { HulyEmbedComponent } from './types.js';

export interface BuildEmbedUrlParams {
  hulyUrl: string;
  component: HulyEmbedComponent;
  token: string;
  project?: string;
  issue?: string;
  externalUser?: string;
  parentOrigin?: string;
}

export function buildEmbedUrl(params: BuildEmbedUrlParams): string {
  const url = new URL('/embed', params.hulyUrl);

  url.searchParams.set('component', params.component);
  url.searchParams.set('token', params.token);

  if (params.project) {
    url.searchParams.set('project', params.project);
  }
  if (params.issue) {
    url.searchParams.set('issue', params.issue);
  }
  if (params.externalUser) {
    url.searchParams.set('externalUser', params.externalUser);
  }
  if (params.parentOrigin) {
    url.searchParams.set('parentOrigin', params.parentOrigin);
  }

  return url.toString();
}

export function getParentOrigin(): string {
  return window.location.origin;
}
