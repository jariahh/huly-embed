import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyThreadProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  threadId: string;
  readonly?: boolean;
}

export function HulyThread({ height = 'auto', threadId, readonly, ...rest }: HulyThreadProps) {
  const extraParams = useMemo(() => ({ thread: threadId, readonly }), [threadId, readonly]);
  return (
    <HulyEmbed
      component="thread"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
