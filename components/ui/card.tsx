import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'outline' | 'ghost' | 'glass';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border border-border bg-card shadow-sm',
  elevated: 'border border-border/60 bg-card shadow-lg hover:shadow-xl',
  outline: 'border-2 border-border/70 bg-card hover:border-border',
  ghost: 'border border-border/40 bg-card/50 backdrop-blur-sm',
  glass: 'border border-white/10 bg-white/5 shadow-2xl backdrop-blur'
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function Card({
  className,
  variant = 'default',
  interactive,
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        interactive && 'hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring/40',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 flex flex-col gap-1', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('typography-h3', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('typography-body', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex items-center justify-between', className)} {...props} />;
}
