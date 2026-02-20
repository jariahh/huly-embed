import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMilestoneDetailProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  milestoneId: string;
}

export function HulyMilestoneDetail({ height = 'auto', milestoneId, ...rest }: HulyMilestoneDetailProps) {
  const extraParams = useMemo(() => ({ milestone: milestoneId }), [milestoneId]);
  return (
    <HulyEmbed
      component="milestone-detail"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
