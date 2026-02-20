import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCreateProjectProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyCreateProject({ height = 'auto', ...rest }: HulyCreateProjectProps) {
  return (
    <HulyEmbed
      component="create-project"
      height={height}
      {...rest}
    />
  );
}
