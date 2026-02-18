import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyThreadProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  threadId: string;
  readonly?: boolean;
}

export function HulyThread({ threadId, readonly, ...rest }: HulyThreadProps) {
  const extraParams = useMemo(() => ({ thread: threadId, readonly }), [threadId, readonly]);
  return (
    <HulyEmbed
      component="thread"
      extraParams={extraParams}
      {...rest}
    />
  );
}
