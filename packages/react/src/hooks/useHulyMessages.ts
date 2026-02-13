import { useEffect, useRef } from 'react';
import type { HulyEmbedMessage } from '@jariahh/core';
import { isHulyMessage, parseHulyMessage } from '@jariahh/core';
import { useHulyEmbedConfig } from '../context/HulyEmbedProvider.js';

export function useHulyMessages(handler: (message: HulyEmbedMessage) => void): void {
  const config = useHulyEmbedConfig();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const allowedOrigins = config.allowedOrigins ?? [new URL(config.hulyUrl).origin];

    function listener(event: MessageEvent) {
      if (!isHulyMessage(event, allowedOrigins)) {
        return;
      }

      const message = parseHulyMessage(event);
      if (message !== null) {
        handlerRef.current(message);
      }
    }

    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [config.hulyUrl, config.allowedOrigins]);
}
