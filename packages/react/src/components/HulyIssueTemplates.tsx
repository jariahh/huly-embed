import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssueTemplatesProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyIssueTemplates(props: HulyIssueTemplatesProps) {
  return (
    <HulyEmbed
      component="issue-templates"
      {...props}
    />
  );
}
