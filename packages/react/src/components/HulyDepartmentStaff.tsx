import { useMemo } from 'react';
import { HulyEmbed, type HulyEmbedProps } from './HulyEmbed.js';

export interface HulyDepartmentStaffProps
  extends Pick<HulyEmbedProps, 'externalUser' | 'loadingContent' | 'errorContent' | 'onReady' | 'onResize' | 'onError'> {
  departmentId: string;
}

export function HulyDepartmentStaff({ departmentId, ...rest }: HulyDepartmentStaffProps) {
  const extraParams = useMemo(() => ({ department: departmentId }), [departmentId]);
  return (
    <HulyEmbed
      component="department-staff"
      extraParams={extraParams}
      {...rest}
    />
  );
}
