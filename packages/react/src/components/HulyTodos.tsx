import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyTodosProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  mode?: string;
}

export function HulyTodos({ mode, ...rest }: HulyTodosProps) {
  const extraParams = useMemo(() => ({ mode }), [mode]);
  return (
    <HulyEmbed
      component="todos"
      extraParams={extraParams}
      {...rest}
    />
  );
}
