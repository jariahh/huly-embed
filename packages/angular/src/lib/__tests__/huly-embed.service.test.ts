import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HulyEmbedService } from '../services/huly-embed.service';

vi.mock('@jariahh/core', () => ({
  fetchEmbedToken: vi.fn().mockResolvedValue({ token: 'mock-token', expiresIn: 3600 }),
  buildEmbedUrl: vi.fn().mockReturnValue('https://huly.test/embed?token=mock'),
  createTokenRefresher: vi.fn().mockReturnValue(vi.fn()),
  getParentOrigin: vi.fn().mockReturnValue('https://myapp.com'),
}));

import { fetchEmbedToken, buildEmbedUrl, createTokenRefresher } from '@jariahh/core';

const baseConfig = {
  hulyUrl: 'https://huly.test',
  defaultProject: 'TEST',
  tokenEndpoint: 'https://api.test/token',
};

describe('HulyEmbedService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores config from injection', () => {
    const service = new HulyEmbedService(baseConfig as any);
    expect(service.config).toBe(baseConfig);
  });

  it('derives allowedOrigins from hulyUrl when not provided', () => {
    const service = new HulyEmbedService(baseConfig as any);
    expect(service.allowedOrigins).toEqual(['https://huly.test']);
  });

  it('uses provided allowedOrigins when present', () => {
    const config = { ...baseConfig, allowedOrigins: ['https://custom.com'] };
    const service = new HulyEmbedService(config as any);
    expect(service.allowedOrigins).toEqual(['https://custom.com']);
  });

  it('fetchToken delegates to core fetchEmbedToken', async () => {
    const service = new HulyEmbedService(baseConfig as any);
    await service.fetchToken('create-issue');
    expect(fetchEmbedToken).toHaveBeenCalledWith('https://api.test/token', 'create-issue');
  });

  it('buildUrl delegates to core buildEmbedUrl with config defaults', () => {
    const service = new HulyEmbedService(baseConfig as any);
    service.buildUrl('create-issue', 'tok123');
    expect(buildEmbedUrl).toHaveBeenCalledWith({
      hulyUrl: 'https://huly.test',
      component: 'create-issue',
      token: 'tok123',
      project: 'TEST',
      issue: undefined,
      externalUser: undefined,
      parentOrigin: 'https://myapp.com',
    });
  });

  it('buildUrl uses provided project override', () => {
    const service = new HulyEmbedService(baseConfig as any);
    service.buildUrl('issue-list', 'tok', { project: 'OVERRIDE' });
    expect(buildEmbedUrl).toHaveBeenCalledWith(
      expect.objectContaining({ project: 'OVERRIDE' })
    );
  });

  it('buildUrl passes issue and externalUser options', () => {
    const service = new HulyEmbedService(baseConfig as any);
    service.buildUrl('issue-detail', 'tok', { issue: 'iss1', externalUser: 'user@test.com' });
    expect(buildEmbedUrl).toHaveBeenCalledWith(
      expect.objectContaining({ issue: 'iss1', externalUser: 'user@test.com' })
    );
  });

  it('createRefresher delegates to core with buffer defaulting to 60', () => {
    const service = new HulyEmbedService(baseConfig as any);
    const onToken = vi.fn();
    const onError = vi.fn();
    service.createRefresher('create-issue', 3600, onToken, onError);
    expect(createTokenRefresher).toHaveBeenCalledWith(
      'https://api.test/token', 'create-issue', 60, 3600, onToken, onError
    );
  });

  it('createRefresher uses config tokenRefreshBuffer when set', () => {
    const config = { ...baseConfig, tokenRefreshBuffer: 120 };
    const service = new HulyEmbedService(config as any);
    service.createRefresher('create-issue', 3600, vi.fn(), vi.fn());
    expect(createTokenRefresher).toHaveBeenCalledWith(
      expect.anything(), expect.anything(), 120, 3600, expect.anything(), expect.anything()
    );
  });
});
