import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyTimeReportsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  issueId: string;
}

export function HulyTimeReports({ height = 'auto', issueId, ...rest }: HulyTimeReportsProps) {
  return (
    <HulyEmbed
      component="time-reports"
      height={height}
      issue={issueId}
      {...rest}
    />
  );
}
