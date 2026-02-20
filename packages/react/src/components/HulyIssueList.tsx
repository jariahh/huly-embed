import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssueListProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyIssueList({ height, onIssueSelected, ...rest }: HulyIssueListProps) {
  return (
    <HulyEmbed
      component="issue-list"
      height={height}
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
