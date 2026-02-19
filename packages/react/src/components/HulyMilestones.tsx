import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMilestonesProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyMilestones(props: HulyMilestonesProps) {
  return (
    <HulyEmbed
      component="milestones"
      {...props}
    />
  );
}
