import { useMemo } from 'react';
import type { HulyDocumentCreatedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCreateDocumentProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  space?: string;
  onDocumentCreated?: (event: HulyDocumentCreatedEvent) => void;
}

export function HulyCreateDocument({ space, onDocumentCreated, ...rest }: HulyCreateDocumentProps) {
  const extraParams = useMemo(() => ({ space }), [space]);
  return (
    <HulyEmbed
      component="create-document"
      extraParams={extraParams}
      onDocumentCreated={onDocumentCreated}
      {...rest}
    />
  );
}
