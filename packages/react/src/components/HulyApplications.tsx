import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyApplicationsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  applicationId?: string;
  space?: string;
  readonly?: boolean;
}

export function HulyApplications({ applicationId, space, readonly, ...rest }: HulyApplicationsProps) {
  const extraParams = useMemo(() => ({ application: applicationId, space, readonly }), [applicationId, space, readonly]);
  return (
    <HulyEmbed
      component="applications"
      extraParams={extraParams}
      {...rest}
    />
  );
}
