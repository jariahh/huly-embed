import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMilestonesProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyMilestones({ height, ...rest }: HulyMilestonesProps) {
  return (
    <HulyEmbed
      component="milestones"
      height={height}
      {...rest}
    />
  );
}
