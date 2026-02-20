import { useMemo } from 'react';
import type { HulyIssueSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyBoardProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  space?: string;
  onIssueSelected?: (event: HulyIssueSelectedEvent) => void;
}

export function HulyBoard({ height, space, onIssueSelected, ...rest }: HulyBoardProps) {
  const extraParams = useMemo(() => ({ space }), [space]);
  return (
    <HulyEmbed
      component="board"
      height={height}
      extraParams={extraParams}
      onIssueSelected={onIssueSelected}
      {...rest}
    />
  );
}
