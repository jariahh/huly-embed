import { createContext, useContext, type ReactNode } from 'react';
import type { HulyEmbedConfig } from '@jariahh/core';

const HulyEmbedContext = createContext<HulyEmbedConfig | null>(null);

export interface HulyEmbedProviderProps {
  config: HulyEmbedConfig;
  children: ReactNode;
}

export function HulyEmbedProvider({ config, children }: HulyEmbedProviderProps) {
  return (
    <HulyEmbedContext.Provider value={config}>
      {children}
    </HulyEmbedContext.Provider>
  );
}

export function useHulyEmbedConfig(): HulyEmbedConfig {
  const config = useContext(HulyEmbedContext);
  if (config === null) {
    throw new Error('useHulyEmbedConfig must be used within a <HulyEmbedProvider>');
  }
  return config;
}
