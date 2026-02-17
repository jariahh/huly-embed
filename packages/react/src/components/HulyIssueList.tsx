import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssueListProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyIssueList({ onIssueSelected, ...rest }: HulyIssueListProps) {
  return (
    <HulyEmbed
      component="issue-list"
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
