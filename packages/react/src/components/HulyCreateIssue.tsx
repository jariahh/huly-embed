import type { HulyIssueCreatedEvent, HulyIssueCancelledEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCreateIssueProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'hideFields' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  onIssueCreated?: (event: HulyIssueCreatedEvent) => void;
  onIssueCancelled?: (event: HulyIssueCancelledEvent) => void;
}

export function HulyCreateIssue({ height = 'auto', onIssueCreated, onIssueCancelled, ...rest }: HulyCreateIssueProps) {
  return (
    <HulyEmbed
      component="create-issue"
      height={height}
      onIssueCreated={onIssueCreated}
      onIssueCancelled={onIssueCancelled}
      {...rest}
    />
  );
}
