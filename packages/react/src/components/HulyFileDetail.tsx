import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyFileDetailProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  fileId: string;
  readonly?: boolean;
}

export function HulyFileDetail({ height = 'auto', fileId, readonly, ...rest }: HulyFileDetailProps) {
  const extraParams = useMemo(() => ({ file: fileId, readonly }), [fileId, readonly]);
  return (
    <HulyEmbed
      component="file-detail"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
