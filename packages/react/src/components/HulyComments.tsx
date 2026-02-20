import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCommentsProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  issueId: string;
}

export function HulyComments({ height, issueId, ...rest }: HulyCommentsProps) {
  return (
    <HulyEmbed
      component="comments"
      height={height}
      issue={issueId}
      {...rest}
    />
  );
}
