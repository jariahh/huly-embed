import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyMyIssuesProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyMyIssues({ onIssueSelected, ...rest }: HulyMyIssuesProps) {
  return (
    <HulyEmbed
      component="my-issues"
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
