import { useMemo } from 'react';
import type { HulyFileSelectedEvent } from '@huly-embed/core';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyFileBrowserProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  drive?: string;
  folder?: string;
  readonly?: boolean;
  onFileSelected?: (event: HulyFileSelectedEvent) => void;
}

export function HulyFileBrowser({ drive, folder, readonly, onFileSelected, ...rest }: HulyFileBrowserProps) {
  const extraParams = useMemo(() => ({ drive, folder, readonly }), [drive, folder, readonly]);
  return (
    <HulyEmbed
      component="file-browser"
      extraParams={extraParams}
      onFileSelected={onFileSelected}
      {...rest}
    />
  );
}
