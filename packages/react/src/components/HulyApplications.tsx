import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyApplicationsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  applicationId?: string;
  space?: string;
  readonly?: boolean;
}

export function HulyApplications({ height, applicationId, space, readonly, ...rest }: HulyApplicationsProps) {
  const extraParams = useMemo(() => ({ application: applicationId, space, readonly }), [applicationId, space, readonly]);
  return (
    <HulyEmbed
      component="applications"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
