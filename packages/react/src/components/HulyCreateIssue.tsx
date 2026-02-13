import type { HulyIssueCreatedEvent, HulyIssueCancelledEvent } from '@jariahh/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCreateIssueProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  onIssueCreated?: (event: HulyIssueCreatedEvent) => void;
  onIssueCancelled?: (event: HulyIssueCancelledEvent) => void;
}

export function HulyCreateIssue({ onIssueCreated, onIssueCancelled, ...rest }: HulyCreateIssueProps) {
  return (
    <HulyEmbed
      component="create-issue"
      onIssueCreated={onIssueCreated}
      onIssueCancelled={onIssueCancelled}
      {...rest}
    />
  );
}
