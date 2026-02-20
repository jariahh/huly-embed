import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyComponentsProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyComponents({ height, ...rest }: HulyComponentsProps) {
  return (
    <HulyEmbed
      component="components"
      height={height}
      {...rest}
    />
  );
}
