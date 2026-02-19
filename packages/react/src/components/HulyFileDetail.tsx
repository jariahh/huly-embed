import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyFileDetailProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  fileId: string;
  readonly?: boolean;
}

export function HulyFileDetail({ fileId, readonly, ...rest }: HulyFileDetailProps) {
  const extraParams = useMemo(() => ({ file: fileId, readonly }), [fileId, readonly]);
  return (
    <HulyEmbed
      component="file-detail"
      extraParams={extraParams}
      {...rest}
    />
  );
}
