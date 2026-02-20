import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCalendarProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyCalendar({ height, ...rest }: HulyCalendarProps) {
  return (
    <HulyEmbed
      component="calendar"
      height={height}
      {...rest}
    />
  );
}
