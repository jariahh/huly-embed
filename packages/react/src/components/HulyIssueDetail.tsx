import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssueDetailProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  issueId: string;
}

export function HulyIssueDetail({ issueId, ...rest }: HulyIssueDetailProps) {
  return (
    <HulyEmbed
      component="issue-detail"
      issue={issueId}
      {...rest}
    />
  );
}
