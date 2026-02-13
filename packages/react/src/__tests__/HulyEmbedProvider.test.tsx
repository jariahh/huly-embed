import { describe, it, expect } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import type { HulyEmbedConfig } from '@huly-embed/core';
import { HulyEmbedProvider, useHulyEmbedConfig } from '../context/HulyEmbedProvider.js';

const testConfig: HulyEmbedConfig = {
  hulyUrl: 'https://huly.test',
  defaultProject: 'TEST',
  tokenEndpoint: 'https://api.test/token',
};

describe('HulyEmbedProvider', () => {
  it('renders children', () => {
    render(
      <HulyEmbedProvider config={testConfig}>
        <div data-testid="child">Hello</div>
      </HulyEmbedProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('provides config via useHulyEmbedConfig', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HulyEmbedProvider config={testConfig}>{children}</HulyEmbedProvider>
    );

    const { result } = renderHook(() => useHulyEmbedConfig(), { wrapper });
    expect(result.current).toEqual(testConfig);
  });
});

describe('useHulyEmbedConfig', () => {
  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useHulyEmbedConfig());
    }).toThrow('useHulyEmbedConfig must be used within a <HulyEmbedProvider>');
  });
});
