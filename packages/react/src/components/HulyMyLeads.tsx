import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMyLeadsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyMyLeads(props: HulyMyLeadsProps) {
  return (
    <HulyEmbed
      component="my-leads"
      {...props}
    />
  );
}
