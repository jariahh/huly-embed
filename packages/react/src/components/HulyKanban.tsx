import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyKanbanProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyKanban({ height, onIssueSelected, ...rest }: HulyKanbanProps) {
  return (
    <HulyEmbed
      component="kanban"
      height={height}
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
