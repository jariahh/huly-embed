import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMyIssuesProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyMyIssues({ height, onIssueSelected, ...rest }: HulyMyIssuesProps) {
  return (
    <HulyEmbed
      component="my-issues"
      height={height}
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
