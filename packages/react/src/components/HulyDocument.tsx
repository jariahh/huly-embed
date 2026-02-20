import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyDocumentProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  documentId: string;
  readonly?: boolean;
}

export function HulyDocument({ height = 'auto', documentId, readonly, ...rest }: HulyDocumentProps) {
  const extraParams = useMemo(() => ({ document: documentId, readonly }), [documentId, readonly]);
  return (
    <HulyEmbed
      component="document"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
