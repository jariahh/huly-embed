import { useMemo } from 'react';
import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyBoardProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  space?: string;
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyBoard({ space, onIssueSelected, ...rest }: HulyBoardProps) {
  const extraParams = useMemo(() => ({ space }), [space]);
  return (
    <HulyEmbed
      component="board"
      extraParams={extraParams}
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
