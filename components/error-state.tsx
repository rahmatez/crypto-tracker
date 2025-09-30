import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Unable to load data</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button onClick={onRetry} variant="destructive" type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
