import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMilestoneDetailProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  milestoneId: string;
}

export function HulyMilestoneDetail({ milestoneId, ...rest }: HulyMilestoneDetailProps) {
  const extraParams = useMemo(() => ({ milestone: milestoneId }), [milestoneId]);
  return (
    <HulyEmbed
      component="milestone-detail"
      extraParams={extraParams}
      {...rest}
    />
  );
}
