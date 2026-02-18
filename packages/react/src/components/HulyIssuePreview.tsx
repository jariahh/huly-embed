import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssuePreviewProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onError'> {
  issueId: string;
}

export function HulyIssuePreview({ issueId, ...rest }: HulyIssuePreviewProps) {
  return (
    <HulyEmbed
      component="issue-preview"
      issue={issueId}
      {...rest}
    />
  );
}
