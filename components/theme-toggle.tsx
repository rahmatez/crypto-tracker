"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button, type ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}

export function ThemeToggle({ className, variant = 'ghost', size = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('transition-colors', className)}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      type="button"
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
