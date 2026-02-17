import { describe, it, expect, vi } from 'vitest';
import { buildEmbedUrl, getParentOrigin } from '../url.js';

describe('buildEmbedUrl', () => {
  it('builds URL with /embed path and required params', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc123',
    }));

    expect(url.pathname).toBe('/embed');
    expect(url.searchParams.get('component')).toBe('create-issue');
    expect(url.searchParams.get('token')).toBe('abc123');
  });

  it('includes project param when provided', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
      project: 'MY-PROJECT',
    }));
    expect(url.searchParams.get('project')).toBe('MY-PROJECT');
  });

  it('omits project param when not provided', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
    }));
    expect(url.searchParams.has('project')).toBe(false);
  });

  it('includes issue param when provided', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'issue-detail',
      token: 'abc',
      issue: 'issue-id-123',
    }));
    expect(url.searchParams.get('issue')).toBe('issue-id-123');
  });

  it('includes externalUser param when provided', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
      externalUser: 'user@example.com',
    }));
    expect(url.searchParams.get('externalUser')).toBe('user@example.com');
  });

  it('includes parentOrigin param when provided', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
      parentOrigin: 'https://myapp.com',
    }));
    expect(url.searchParams.get('parentOrigin')).toBe('https://myapp.com');
  });

  it('includes all optional params together', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'issue-detail',
      token: 'tok',
      project: 'PROJ',
      issue: 'iss',
      externalUser: 'ext',
      parentOrigin: 'https://origin.com',
    }));
    expect(url.searchParams.get('project')).toBe('PROJ');
    expect(url.searchParams.get('issue')).toBe('iss');
    expect(url.searchParams.get('externalUser')).toBe('ext');
    expect(url.searchParams.get('parentOrigin')).toBe('https://origin.com');
  });

  it('includes hideFields as comma-separated param', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
      hideFields: ['status', 'priority', 'duedate'],
    }));
    expect(url.searchParams.get('hideFields')).toBe('status,priority,duedate');
  });

  it('omits hideFields when empty array', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
      hideFields: [],
    }));
    expect(url.searchParams.has('hideFields')).toBe(false);
  });

  it('omits hideFields when not provided', () => {
    const url = new URL(buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'abc',
    }));
    expect(url.searchParams.has('hideFields')).toBe(false);
  });

  it('handles hulyUrl with trailing slash', () => {
    const url = buildEmbedUrl({
      hulyUrl: 'https://huly.test/',
      component: 'create-issue',
      token: 'abc',
    });
    expect(url).toContain('/embed');
    expect(url).not.toContain('//embed');
  });

  it('encodes special characters in param values', () => {
    const url = buildEmbedUrl({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'tok+en/special=chars',
    });
    expect(url).toContain('tok');
    // URL should be parseable
    const parsed = new URL(url);
    expect(parsed.searchParams.get('token')).toBe('tok+en/special=chars');
  });
});

describe('getParentOrigin', () => {
  it('returns window.location.origin', () => {
    const original = globalThis.window;
    vi.stubGlobal('window', { location: { origin: 'https://myapp.com' } });

    expect(getParentOrigin()).toBe('https://myapp.com');

    if (original) {
      vi.stubGlobal('window', original);
    } else {
      vi.unstubAllGlobals();
    }
  });
});
