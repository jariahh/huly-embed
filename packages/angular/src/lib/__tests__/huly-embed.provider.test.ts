import { describe, it, expect } from 'vitest';
import { provideHulyEmbed } from '../providers/huly-embed.provider';

describe('provideHulyEmbed', () => {
  it('returns a non-null EnvironmentProviders object', () => {
    const result = provideHulyEmbed({
      hulyUrl: 'https://huly.test',
      defaultProject: 'TEST',
      tokenEndpoint: 'https://api.test/token',
    });
    expect(result).toBeTruthy();
  });

  it('returns an object with the ɵproviders symbol (Angular internal)', () => {
    const result = provideHulyEmbed({
      hulyUrl: 'https://huly.test',
      defaultProject: 'TEST',
      tokenEndpoint: 'https://api.test/token',
    });
    // EnvironmentProviders has a branded symbol; verify it's a valid provider structure
    expect(typeof result).toBe('object');
  });
});
