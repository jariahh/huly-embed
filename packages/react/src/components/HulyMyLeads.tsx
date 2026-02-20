import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMyLeadsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyMyLeads({ height, ...rest }: HulyMyLeadsProps) {
  return (
    <HulyEmbed
      component="my-leads"
      height={height}
      {...rest}
    />
  );
}
