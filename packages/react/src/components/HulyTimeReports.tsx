import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyTimeReportsProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  issueId: string;
}

export function HulyTimeReports({ issueId, ...rest }: HulyTimeReportsProps) {
  return (
    <HulyEmbed
      component="time-reports"
      issue={issueId}
      {...rest}
    />
  );
}
