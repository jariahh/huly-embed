import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssuePreviewProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  issueId: string;
}

export function HulyIssuePreview({ height = 'auto', issueId, ...rest }: HulyIssuePreviewProps) {
  return (
    <HulyEmbed
      component="issue-preview"
      height={height}
      issue={issueId}
      {...rest}
    />
  );
}
