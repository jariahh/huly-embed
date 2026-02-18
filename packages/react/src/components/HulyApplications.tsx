import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyApplicationsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  space?: string;
  readonly?: boolean;
}

export function HulyApplications({ space, readonly, ...rest }: HulyApplicationsProps) {
  const extraParams = useMemo(() => ({ space, readonly }), [space, readonly]);
  return (
    <HulyEmbed
      component="applications"
      extraParams={extraParams}
      {...rest}
    />
  );
}
