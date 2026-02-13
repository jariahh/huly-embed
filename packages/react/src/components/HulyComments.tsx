import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCommentsProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  issueId: string;
}

export function HulyComments({ issueId, ...rest }: HulyCommentsProps) {
  return (
    <HulyEmbed
      component="comments"
      issue={issueId}
      {...rest}
    />
  );
}
