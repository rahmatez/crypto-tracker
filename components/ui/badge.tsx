import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'muted' | 'outline';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
  danger: 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]',
  muted: 'bg-muted text-muted-foreground',
  outline: 'border border-border/70 text-muted-foreground'
};

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
