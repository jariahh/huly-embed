import { useMemo } from 'react';
import type { HulyDocumentCreatedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCreateDocumentProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  space?: string;
  onDocumentCreated?: (event: HulyDocumentCreatedEvent) => void;
}

export function HulyCreateDocument({ height = 'auto', space, onDocumentCreated, ...rest }: HulyCreateDocumentProps) {
  const extraParams = useMemo(() => ({ space }), [space]);
  return (
    <HulyEmbed
      component="create-document"
      height={height}
      extraParams={extraParams}
      onDocumentCreated={onDocumentCreated}
      {...rest}
    />
  );
}
