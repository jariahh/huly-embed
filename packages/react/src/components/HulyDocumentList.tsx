import type { HulyDocumentSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyDocumentListProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  onDocumentSelected?: (event: HulyDocumentSelectedEvent) => void;
}

export function HulyDocumentList({ onDocumentSelected, ...rest }: HulyDocumentListProps) {
  return (
    <HulyEmbed
      component="document-list"
      onDocumentSelected={onDocumentSelected}
      {...rest}
    />
  );
}
