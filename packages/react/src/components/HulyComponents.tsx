import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyComponentsProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyComponents(props: HulyComponentsProps) {
  return (
    <HulyEmbed
      component="components"
      {...props}
    />
  );
}
