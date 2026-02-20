import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyIssueTemplatesProps
  extends Pick<HulyEmbedProps, 'project' | 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyIssueTemplates({ height, ...rest }: HulyIssueTemplatesProps) {
  return (
    <HulyEmbed
      component="issue-templates"
      height={height}
      {...rest}
    />
  );
}
