import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyDepartmentStaffProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'height' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  departmentId: string;
}

export function HulyDepartmentStaff({ height, departmentId, ...rest }: HulyDepartmentStaffProps) {
  const extraParams = useMemo(() => ({ department: departmentId }), [departmentId]);
  return (
    <HulyEmbed
      component="department-staff"
      height={height}
      extraParams={extraParams}
      {...rest}
    />
  );
}
