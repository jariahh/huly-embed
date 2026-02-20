import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyActivityProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  issueId: string;
  readonly?: boolean;
}

export function HulyActivity({ height = 'auto', issueId, readonly, ...rest }: HulyActivityProps) {
  const extraParams = useMemo(() => ({ readonly }), [readonly]);
  return (
    <HulyEmbed
      component="activity"
      height={height}
      issue={issueId}
      extraParams={extraParams}
      {...rest}
    />
  );
}
