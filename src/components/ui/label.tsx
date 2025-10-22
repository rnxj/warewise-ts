import type * as React from 'react';

import { cn } from '@/lib/utils';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: This is a generic label component that can accept htmlFor via props
    <label
      className={cn('inline-flex items-center gap-2 text-sm/4', className)}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
