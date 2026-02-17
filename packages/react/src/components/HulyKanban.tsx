import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyKanbanProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyKanban({ onIssueSelected, ...rest }: HulyKanbanProps) {
  return (
    <HulyEmbed
      component="kanban"
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
