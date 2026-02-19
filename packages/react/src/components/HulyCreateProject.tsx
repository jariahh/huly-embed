import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCreateProjectProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyCreateProject(props: HulyCreateProjectProps) {
  return (
    <HulyEmbed
      component="create-project"
      {...props}
    />
  );
}
