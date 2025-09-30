import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/70">
      <div className="container flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} CryptoTracker. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>
            Powered by{' '}
            <Link href="https://www.coingecko.com" className="text-primary underline">
              CoinGecko API
            </Link>
          </span>
          <Link href="https://github.com/your-org/crypto-tracker" className="text-primary underline">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
