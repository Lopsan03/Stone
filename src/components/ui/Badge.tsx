import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-slate-800 text-slate-300 border border-slate-700',
        secondary: 'bg-slate-800 text-slate-300 border border-slate-700',
        destructive: 'bg-red-500/10 text-red-500 border border-red-500/20',
        outline: 'text-bento-text-bold border border-bento-border',
        pending: 'badge badge-yellow uppercase tracking-tight',
        completed: 'badge badge-blue uppercase tracking-tight',
        paid: 'badge badge-green uppercase tracking-tight',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
