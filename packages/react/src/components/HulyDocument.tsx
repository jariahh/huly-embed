import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyDocumentProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  documentId: string;
  readonly?: boolean;
}

export function HulyDocument({ documentId, readonly, ...rest }: HulyDocumentProps) {
  const extraParams = useMemo(() => ({ document: documentId, readonly }), [documentId, readonly]);
  return (
    <HulyEmbed
      component="document"
      extraParams={extraParams}
      {...rest}
    />
  );
}
