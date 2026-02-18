import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyActivityProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  issueId: string;
  readonly?: boolean;
}

export function HulyActivity({ issueId, readonly, ...rest }: HulyActivityProps) {
  const extraParams = useMemo(() => ({ readonly }), [readonly]);
  return (
    <HulyEmbed
      component="activity"
      issue={issueId}
      extraParams={extraParams}
      {...rest}
    />
  );
}
