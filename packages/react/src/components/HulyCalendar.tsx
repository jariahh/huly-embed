import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyCalendarProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {}

export function HulyCalendar(props: HulyCalendarProps) {
  return (
    <HulyEmbed
      component="calendar"
      {...props}
    />
  );
}
