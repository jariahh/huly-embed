import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssueDetailProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  issueId: string;
}

export function HulyIssueDetail({ height = 'auto', issueId, ...rest }: HulyIssueDetailProps) {
  return (
    <HulyEmbed
      component="issue-detail"
      height={height}
      issue={issueId}
      {...rest}
    />
  );
}
