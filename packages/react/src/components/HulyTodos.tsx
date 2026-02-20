import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyTodosProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  mode?: string;
}

export function HulyTodos({ height, mode, ...rest }: HulyTodosProps) {
  const extraParams = useMemo(() => ({ mode }), [mode]);
  return (
    <HulyEmbed
      component="todos"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
